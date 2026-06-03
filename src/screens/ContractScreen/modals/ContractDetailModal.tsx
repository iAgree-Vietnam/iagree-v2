"use client";
import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Drawer, Popconfirm, Space, Typography } from "antd";
import { SendOutlined, DownloadOutlined } from "@ant-design/icons";
import useSelectedContract from "@/src/screens/ContractScreen/hooks/useSelectedContract";
import {
  ContractResource,
  FullContractResource,
} from "@/src/data/contract/models/contract.types";
import _ from "lodash";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import ContractEditModal, {
  ContractEditModalizeHelperVisible,
} from "@/src/screens/ContractScreen/modals/ContractEditModal";
import useContractRequestMailToSign from "@/src/screens/ContractScreen/hooks/flow/useContractRequestMailToSign";
import dynamic from "next/dynamic";
import useContractRequestSignOnMySign from "@/src/screens/ContractScreen/hooks/flow/useContractRequestSignOnMySign";
import useContractUpdatePDF from "@/src/screens/ContractScreen/hooks/useContractUpdatePDF";
import Constants from "@/src/constants/Constants";
import { PDFDocument } from "pdf-lib";
import StringUtils from "@/src/utils/StringUtils";
import FileUtils from "@/src/utils/FileUtils";

interface ContractDetailModalProps {}

export interface ContractDetailModalizeHelper {
  open: (contractResource: ContractResource) => void;
  close: () => void;
}

const ContractDetailViewClient = dynamic(
  () => import("./components/ContractDetailView"),
  {
    ssr: false,
  }
);

const ContractDetailModal = React.forwardRef(
  (props: ContractDetailModalProps, ref) => {
    const contractEditModalRef =
      useRef<ContractEditModalizeHelperVisible>(null);

    const [contract, setContract] = useState<ContractResource | null>(null);
    const open = useCallback(
      (contractResource: ContractResource) => setContract(contractResource),
      []
    );
    const close = useCallback(() => setContract(null), []);

    useImperativeHandle(
      ref,
      useCallback(() => ({ open, close }), [open, close])
    );

    const contractQuery = useSelectedContract(contract?.contractId);
    const requestMailToSignMutation = useContractRequestMailToSign({
      onSuccess: close,
    });
    const requestSignOnMySignMutation = useContractRequestSignOnMySign();
    const updatePDFMutation = useContractUpdatePDF();

    const fullContractResource: FullContractResource | undefined =
      contractQuery.data;

    const confirmRequestMailToSign = async () => {
      if (!fullContractResource) return;

      let isSetupSign = true;

      fullContractResource?.signUsers?.forEach((signUser) => {
        const { pageNumber, top, left } = signUser;
        if (!pageNumber || !top || !left) {
          isSetupSign = false;
          return;
        }
      });

      // if (!isSetupSign) {
      //     message.error('Vui lòng cấu hình chân ký');
      //     return;
      // }

      if (isSetupSign) {
        await addImageToPDF();
      }

      requestMailToSignMutation.mutate(fullContractResource);
    };

    async function addImageToPDF() {
      try {
        if (!fullContractResource) return;

        // Load PDF hiện tại
        const existingPdfBytes = await fetch(fullContractResource.fileUrl).then(
          (res) => res.arrayBuffer()
        );

        // Tạo một tài liệu PDF từ file hiện có
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();

        let isDrewSign = false;

        for (const signUser of fullContractResource.signUsers) {
          const { pageNumber, imageUrl, top, left } = signUser;

          if (!pageNumber || !top || !left) {
            isDrewSign = false;
            return;
          }

          // Load page có chữ ký
          const currentPage = pages[pageNumber - 1];
          // Load ảnh từ URL
          const imageBytes = await fetch(imageUrl).then((res) =>
            res.arrayBuffer()
          );

          let image = null;

          const isJpgExtension = imageUrl.toLowerCase().includes(".jpg");
          const isPngExtension = imageUrl.toLowerCase().includes(".png");

          // Nhúng ảnh vào PDF
          if (isJpgExtension) {
            image = await pdfDoc.embedJpg(imageBytes);
          }
          if (isPngExtension) {
            image = await pdfDoc.embedPng(imageBytes);
          }

          if (image) {
            const { height: pdfHeight } = currentPage.getSize();

            // const scale = pdfHeight / pageHeight
            const scale = 1;

            // Thêm ảnh vào trang với tọa độ cụ thể (x, y)
            currentPage.drawImage(image, {
              x: left,
              y:
                pdfHeight -
                top * scale -
                Constants.CONTRACT.SIGN_IMG_SIZE.HEIGHT,
              width: Constants.CONTRACT.SIGN_IMG_SIZE.WIDTH,
              height: Constants.CONTRACT.SIGN_IMG_SIZE.HEIGHT,
            });
            isDrewSign = true;
          }
        }

        if (isDrewSign) {
          // Lưu PDF đã chỉnh sửa thành file mới
          const pdfBytes: any = await pdfDoc.save();

          // Lưu file dưới dạng Blob để tải xuống
          const blob: any = new Blob([pdfBytes], { type: "application/pdf" });

          const pdfFile = new File([blob], "signed.pdf", {
            type: "application/pdf",
          });

          updatePDFMutation.mutate({
            pdfFile,
            contractId: fullContractResource.contractId,
          });
        }
      } catch (err) {}
    }

    const downloadInfo = useMemo(() => {
      if (!fullContractResource) return;

      const fileResource = fullContractResource.fileUrl;
      const fileName = StringUtils.normalizeDownloadFilename(
        fullContractResource.name
      );
      const fileExt = FileUtils.getFileExtension(fileResource);
      return {
        fileResource,
        fileName: `${fileName}.${fileExt}`,
      };
    }, [fullContractResource]);

    const onDownloadContract = () => {
      if (!downloadInfo) return;
      FileUtils.downloadFromUrl(
        downloadInfo.fileResource,
        downloadInfo.fileName
      );
    };

    return (
      <div className={"contractSignContainer"}>
        <Drawer
          rootClassName={"contractSignContainer"}
          open={!_.isNull(contract)}
          title={
            contract ? (
              <Space size={"large"}>
                <div>
                  <div className="ant-drawer-title">
                    {fullContractResource?.name || contract.name}
                  </div>
                  <Typography.Paragraph
                    className={"nm-typo"}
                    type={"secondary"}
                  >
                    Tạo bởi:{" "}
                    {fullContractResource?.userName ||
                      contract.userName ||
                      "Chưa xác định"}
                    , lúc{" "}
                    {datetimeUtils
                      .getMoment(
                        fullContractResource?.lastModifiedDate ||
                          contract.lastModifiedDate,
                        datetimeUtils.BACKEND_DATE_TIME
                      )
                      ?.format(datetimeUtils.LOCAL_DATE_TIME)}
                  </Typography.Paragraph>
                </div>

                {fullContractResource &&
                fullContractResource.status ===
                  Constants.CONTRACT.STATUS.LUU_NHAP ? (
                  <Button
                    onClick={() =>
                      contractEditModalRef.current?.open(fullContractResource)
                    }
                  >
                    Sửa hợp đồng
                  </Button>
                ) : null}
              </Space>
            ) : null
          }
          footer={
            !fullContractResource ? null : (
              <Space size={"large"}>
                {/* {fullContractResource.status === Constants.CONTRACT.STATUS.REQUEST_MY_SIGN && (
                            <Popconfirm
                                placement={'topLeft'}
                                title={'Gửi yêu cầu ký trên MySign'}
                                description={'Xác nhận gửi yêu cầu ký trên MySign'}
                                okText={'Gửi yêu cầu'}
                                cancelText={'Hủy'}
                                onConfirm={() => requestSignOnMySignMutation.mutate(fullContractResource)}
                            >
                                <Button
                                    icon={<SendOutlined/>}
                                    type={'primary'}
                                >
                                    Gửi yêu cầu ký trên My Sign
                                </Button>
                            </Popconfirm>
                        )}  */}
                {fullContractResource.status ===
                  Constants.CONTRACT.STATUS.LUU_NHAP && (
                  <Popconfirm
                    placement={"topLeft"}
                    title={"Gửi yêu cầu ký"}
                    description={
                      "Xác nhận gửi yêu cầu ký đến những đối tượng được chọn"
                    }
                    okText={"Gửi yêu cầu ký"}
                    cancelText={"Hủy"}
                    onConfirm={confirmRequestMailToSign}
                  >
                    <Button icon={<SendOutlined />} type={"primary"}>
                      Gửi yêu cầu ký
                    </Button>
                  </Popconfirm>
                )}
                {fullContractResource.status !==
                  Constants.CONTRACT.STATUS.LUU_NHAP &&
                  downloadInfo && (
                    <Popconfirm
                      placement={"topLeft"}
                      title={"Tải xuống hợp đồng"}
                      description={
                        <Typography>
                          Xác nhận tải xuống hợp đồng{" "}
                          <strong>{downloadInfo.fileName}</strong>
                        </Typography>
                      }
                      okText={"Tải xuống"}
                      cancelText={"Hủy"}
                      onConfirm={onDownloadContract}
                    >
                      <Button icon={<DownloadOutlined />} type={"primary"}>
                        Tải xuống hợp đồng
                      </Button>
                    </Popconfirm>
                  )}
              </Space>
            )
          }
          onClose={close}
          width={"100%"}
          classNames={{
            header: "signHeaderDrawerContainer",
            body: "signBodyDrawerContainer",
            footer: "signFooterDrawerContainer",
          }}
        >
          {fullContractResource && (
            <ContractDetailViewClient data={fullContractResource} />
          )}
        </Drawer>

        <>
          {fullContractResource && (
            <ContractEditModal ref={contractEditModalRef} />
          )}
        </>
      </div>
    );
  }
);

ContractDetailModal.displayName = "ContractDetailModal";

export default ContractDetailModal;
