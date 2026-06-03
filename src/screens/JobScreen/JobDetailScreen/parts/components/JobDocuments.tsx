import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  message,
  Popconfirm,
  Radio,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  FullJobResource,
  JobResultResource,
} from "../../../../../data/job/models/job.types";
import useDocumentDelete from "../../hooks/document/useDocumentDelete";
import useDocumentDownload from "../../hooks/document/useDocumentDownload";
import _ from "lodash";
import Constants from "@/src/constants/Constants";
import ViewResultFileModal, {
  ViewResultFileModalizeHelperVisible,
} from "../../modals/ViewResultFileModal";
import { ColumnType } from "antd/es/table";
import Link from "next/link";

interface JobDocumentProps {
  job: FullJobResource;
  loading: boolean;
  data: JobResultResource[];
  onEdit?: (resultResource: JobResultResource) => void;
  isCreated?: boolean;
  isPartner?: boolean;
  canDownload: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onStatusChange?: (resultId: number, status: number) => void;
}

function JobDocuments(props: JobDocumentProps) {
  const {
    job: fullJobResource,
    loading,
    data,
    isPartner,
    canDownload,
    canEdit,
    canDelete,
    isCreated,
    onStatusChange,
  } = props;

  // const [loadingRowId, setLoadingRowId] = useState<number | null>(null);
  const [fileStatuses, setFileStatuses] = useState<Record<number, number>>({});
  // const documentDownloadMutation = useDocumentDownload();
  const documentDeleteMutation = useDocumentDelete();
  const viewResultModalRef = useRef<ViewResultFileModalizeHelperVisible>(null);

  const isPartnerCantEdit =
    isPartner &&
    [Constants.JOB.STATUS.CHO_NGHIEM_THU].includes(fullJobResource?.status);

  // const handleDownloadButton = async (record: JobResultResource) => {
  //   // setLoadingRowId(record.resultId);
  // };

  const getRadioValue = (status: number) => {
    switch (status) {
      case 1:
        return "approved";
      case 2:
        return "rejected";
      default:
        return undefined;
    }
  };

  const getApiStatus = (radioValue: string) => {
    switch (radioValue) {
      case "approved":
        return 1;
      case "rejected":
        return 2;
      default:
        return 0;
    }
  };

  const handleStatusChange = useCallback(
    (resultId: number, radioValue: string) => {
      const apiStatus = getApiStatus(radioValue);

      setFileStatuses((prev) => ({
        ...prev,
        [resultId]: apiStatus,
      }));

      if (onStatusChange) {
        onStatusChange(resultId, apiStatus);
      }
    },
    [onStatusChange]
  );

  const columns: ColumnType<JobResultResource>[] = [
    {
      key: "index",
      dataIndex: "index",
      title: "Số thứ tự",
      render: (value: any, record: any, index: any) => index + 1,
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Tên tài liệu",
    },
    // {
    //     key: 'fileSize',
    //     dataIndex: 'fileSize',
    //     title: 'Dung lượng',
    // },
    {
      key: "createdDate",
      dataIndex: "createdDate",
      title: "Ngày tải",
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Mô tả",
      width: 500,
      render: (text) => (
        <Tooltip title={text}>
          <div
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "status",
      dataIndex: "status",
      title: "Trạng thái",
      width: 200,
      align: "center" as const,
      render: (_: any, resultResource: JobResultResource) => {
        if (isCreated) {
          if (fullJobResource.status === Constants.JOB.STATUS.CHO_NGHIEM_THU) {
            const currentStatus =
              fileStatuses[resultResource.resultId] || resultResource.status;
            const radioValue = getRadioValue(currentStatus);

            return (
              <div onClick={(e) => e.stopPropagation()}>
                <Radio.Group
                  value={radioValue}
                  onChange={(e) =>
                    handleStatusChange(resultResource.resultId, e.target.value)
                  }
                  size={"small"}
                >
                  <Radio.Button
                    value="approved"
                    style={{
                      fontSize: "13px",
                      padding: "0 8px",
                      height: "28px",
                      lineHeight: "26px",
                    }}
                  >
                    Chấp nhận
                  </Radio.Button>

                  <Radio.Button
                  
                    value="rejected"
                    style={{
                      fontSize: "13px",
                      padding: "0 8px",
                      height: "28px",
                      lineHeight: "26px",
                      border: "1px solid red",
                      color:"red"
                    }}
                  >
                    Cần chỉnh sửa
                  </Radio.Button>
                </Radio.Group>
              </div>
            );
          } else {
            const statusText = () => {
              switch (resultResource.status) {
                case 0:
                  return "Chờ duyệt";
                case 1:
                  return "Chấp nhận";
                case 2:
                  return "Cần chỉnh sửa";
                default:
                  return "Chờ duyệt";
              }
            };

            const statusColor = () => {
              switch (resultResource.status) {
                case 1:
                  return "#09993E";
                case 2:
                  return "#ff4d4f";
                default:
                  return "#faad14";
              }
            };

            return (
              <Tag
                color={statusColor()}
                style={{
                  marginInlineEnd: 0,
                  width: "88px",
                  textAlign: "center",
                }}
              >
                {statusText()}
              </Tag>
            );
          }
        }

        // Đối tác (isPartner = true)
        const statusText = () => {
          switch (resultResource.status) {
            case 0:
              return "Chờ duyệt";
            case 1:
              return "Chấp nhận";
            case 2:
              return "Cần chỉnh sửa";
            default:
              return "Chờ duyệt";
          }
        };

        const statusColor = () => {
          switch (resultResource.status) {
            case 1:
              return "#09993E";
            case 2:
              return "#ff4d4f";
            default:
              return "#faad14";
          }
        };

        return (
          <Tag
            color={statusColor()}
            style={{
              marginInlineEnd: 0,
              width: "88px",
              textAlign: "center",
            }}
          >
            {statusText()}
          </Tag>
        );
      },
    },
    {
      key: "actions",
      dataIndex: "actions",
      title: "Hành động",
      fixed: "right",
      align: "right",
      width: 150,
      render: (value: any, resultResource: JobResultResource) => {
        const shouldShowDeleteButton =
          resultResource.status === Constants.JOB.RESULT_STATUS.WAITING_APPROVE;

        return (
          <Row justify={"end"}>
            <Space>
              <Link href={resultResource.fileUrl} target="_blank">
                <Button
                  className="btnAction"
                  icon={<EyeOutlined />}
                  // onClick={() => {
                  //   if (resultResource.fileUrl && window) {
                  //     window.open(resultResource.fileUrl, "_blank");
                  //     // viewResultModalRef.current?.open(fullJobResource!, resultResource);
                  //   } else {
                  //     message.warning("Không tìm thấy tệp để xem");
                  //   }
                  // }}
                />
              </Link>

              {/* {canDownload && (
                <Button
                  icon={<DownloadOutlined />}
                  className={"btnAction"}
                  disabled={documentDownloadMutation.isPending}
                  loading={loadingRowId === resultResource.resultId}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadButton(resultResource);
                    documentDownloadMutation.mutate(
                      {
                        jobId: fullJobResource?.jobId,
                        resultId: resultResource.resultId,
                        file: resultResource,
                      },
                      {
                        onSuccess: () => {
                          setLoadingRowId(null);
                          message.success("Tải tệp kết quả thành công");
                        },
                        onError: () => {
                          setLoadingRowId(null);
                          message.success("Tải tệp kết quả thất bại");
                        },
                        onSettled: () => {
                          setLoadingRowId(null);
                        },
                      }
                    );
                  }}
                />
              )} */}

              {/* {canEdit && (
                <Button
                  className={"btnAction"}
                  icon={<EditOutlined />}
                  disabled={isPartnerCantEdit}
                  onClick={() => {
                    _.isFunction(props.onEdit)
                      ? props.onEdit(resultResource)
                      : null;
                  }}
                />
              )} */}

              {canDelete && shouldShowDeleteButton && (
                <Popconfirm
                  title={"Xóa kết quả"}
                  description={"Bạn có chắc muốn xóa"}
                  onConfirm={() =>
                    documentDeleteMutation.mutate({
                      jobId: fullJobResource?.jobId,
                      resultId: resultResource.resultId,
                    })
                  }
                  okText={"Đồng ý"}
                  cancelText={"Hủy"}
                >
                  <Button
                    className={"btnAction"}
                    disabled={
                      documentDeleteMutation.isPending || isPartnerCantEdit
                    }
                    loading={documentDeleteMutation.isPending}
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              )}
            </Space>
          </Row>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        loading={loading}
        dataSource={data}
        rowKey={"resultId"}
        pagination={false}
        size={"small"}
        locale={{ emptyText: "Không có dữ liệu" }}
        scroll={{ x: "max-content" }}
        onRow={(record) => ({
          onClick: () => {
            if (record.fileUrl) {
              viewResultModalRef.current?.open(fullJobResource!, record, !!isCreated);
            } else {
              message.warning("Không tìm thấy tệp để xem");
            }
          },
        })}
      />

      <ViewResultFileModal
        ref={viewResultModalRef}
        onAccept={(resultId: number) =>
          handleStatusChange(resultId, "approved")
        }
        onRequestEdit={(resultId: number) =>
          handleStatusChange(resultId, "rejected")
        }
      />
    </>
  );
}

export default JobDocuments;
