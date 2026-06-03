import React, {
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Modal,
  Row,
  Space,
  Table,
  Tooltip,
  Select,
  Spin,
  Col,
  Typography,
  Image,
} from "antd";
import { DeleteOutlined, WarningOutlined } from "@ant-design/icons";
import _, { debounce, map, toString } from "lodash";

import Constants from "@/src/constants/Constants";
import dialogUtils from "@/src/utils/DialogUtils";
import usePaginatedSharedUsers from "@/src/screens/DocumentScreen/DocumentSharedScreen/hooks/usePaginatedSharedUsers";
import useCancelShareDocument from "@/src/screens/DocumentScreen/DocumentSharedScreen/hooks/useCancelShareDocument";
import useUserList from "@/src/screens/DocumentScreen/DocumentSharedScreen/hooks/useUserList";
import useShareDocument from "@/src/screens/DocumentScreen/DocumentSharedScreen/hooks/useShareDocument";
import { DocumentResource } from "@/src/data/document/models/document.types";
import Images from "@/src/constants/Images";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";

export type DocumentShareModalizeHelperVisible = {
  open: (documentResource: DocumentResource) => void;
  close: () => void;
};

const DocumentShareModal = React.forwardRef((props, ref) => {
  const { isDesktop } = useBreakpoint();

  const [document, setDocument] = useState<DocumentResource | null>(null);

  const [search, setSearch] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const userSharedQuery = usePaginatedSharedUsers();

  const userQuery = useUserList({ filters: { name: search } });

  const cancelShareMutation = useCancelShareDocument();

  const shareMutation = useShareDocument({
    onSuccess: () => setSelectedUser([]),
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearch = useCallback(
    debounce((key) => setSearch(key), 500),
    []
  );

  const open = useCallback(
    (documentResource: DocumentResource) => setDocument(documentResource),
    [setDocument]
  );
  const close = useCallback(() => {
    setSelectedUser([]);
    setDocument(null);
  }, [setDocument]);

  useImperativeHandle(
    ref,
    useCallback(() => ({ open, close }), [open, close])
  );

  const filterOption = useCallback(
    (input: string, option?: { label: string; value: string }) =>
      (option?.label ?? "").toLowerCase().includes(input.toLowerCase()),
    []
  );

  const userShared = useMemo(
    () =>
      userSharedQuery.data.filter(
        (i) =>
          i.documentId === document?.documentId &&
          (i.status === Constants.DOCUMENT.SHARE_STATUS.SHARE ||
            i.status === Constants.DOCUMENT.SHARE_STATUS.APPROVED)
      ),
    [document, userSharedQuery]
  );

  return (
    <Modal
      title={"Chia sẻ văn bản"}
      open={!_.isNull(document)}
      className={"DocumentShareModalContainer"}
      onCancel={close}
      width={"800px"}
      centered={true}
      footer={null}
    >
      <div className={"shareContentWrapper"}>
        <Row
          style={{ margin: "20px 0", gap: "16px" }}
          justify={"end"}
          wrap={!isDesktop ? true : false}
          align={"middle"}
        >
          <Select
            size={"large"}
            showSearch
            mode={"multiple"}
            allowClear
            placeholder={"Nhập tên người nhận"}
            value={selectedUser}
            onChange={setSelectedUser}
            onSearch={debouncedSetSearch}
            filterOption={filterOption}
            options={map(userQuery.data.items, (i) => ({
              value: toString(i?.userId || ""),
              label: i?.fullName || "",
              avatarUrl: i?.avatarUrl || "",
              email: i?.email || "",
            }))}
            optionRender={(option: any) => (
              <Row gutter={16}>
                <Col>
                  <Image
                    preview={false}
                    width={40}
                    height={40}
                    src={option?.data?.avatarUrl.toString()}
                    fallback={Images.ACCOUNT_DEFAULT}
                    alt="User review avatar"
                    className="partnerAvatar"
                  />
                </Col>
                <Col flex="auto">
                  <Typography>{option.label}</Typography>
                  <Typography>{option.data.email}</Typography>
                </Col>
              </Row>
            )}
            notFoundContent={
              userQuery.isFetching ? (
                <Row
                  style={{ padding: "6px 0" }}
                  gutter={16}
                  justify={"center"}
                >
                  <Spin />
                </Row>
              ) : (
                <Row
                  style={{ padding: "6px 0" }}
                  gutter={16}
                  justify={"center"}
                  align={"middle"}
                >
                  <Col>
                    <WarningOutlined />
                  </Col>
                  <Col>
                    <Typography>Không tìm thấy người dùng</Typography>
                  </Col>
                </Row>
              )
            }
            style={{ width: "100%" }}
          />
          <Button
            size={"large"}
            type={"primary"}
            onClick={() =>
              document &&
              shareMutation.mutate({
                documentId: document.documentId,
                userIds: selectedUser,
              })
            }
            disabled={selectedUser.length === 0}
            block={!isDesktop ? true : false}
          >
            Chia sẻ văn bản
          </Button>
        </Row>

        <Typography.Title level={5} style={{ fontSize: "14px" }}>
          Danh sách người nhận
        </Typography.Title>

        <Table
          rowKey={"documentShareId"}
          size={"small"}
          columns={[
            {
              key: "index",
              dataIndex: "index",
              title: "STT",
              width: 60,
              render: (value, record, index) => index + 1,
            },
            {
              key: "name",
              dataIndex: "name",
              title: "Tên người nhận",
              width: 180,
              render: (value, documentResource) => {
                return documentResource.userView.fullName;
              },
            },
            {
              key: "phoneNumber",
              dataIndex: "phoneNumber",
              title: "Số điện thoại",
              width: 180,
              render: (value, documentResource) => {
                return documentResource.userView.phoneNumber;
              },
            },
            {
              key: "email",
              dataIndex: "email",
              title: "Email",
              width: 180,
              render: (value, documentResource) => {
                return documentResource.userView.email;
              },
            },
            {
              key: "actions",
              dataIndex: "actions",
              title: "Hành động",
              fixed: "right",
              align: "right",
              render: (value, documentResource) => {
                return (
                  <Row justify={"end"}>
                    <Space size={"small"} align={"end"}>
                      <Tooltip title="Xóa khỏi danh sách">
                        <Button
                          className={"btnAction"}
                          icon={<DeleteOutlined />}
                          onClick={() =>
                            cancelShareMutation.mutate(documentResource)
                          }
                        />
                      </Tooltip>
                    </Space>
                  </Row>
                );
              },
            },
          ]}
          locale={{ emptyText: "Không có dữ liệu" }}
          dataSource={userShared}
          pagination={{
            size: "default",
            position: ["bottomCenter"],
            total: userShared.length,
            current: currentPage,
            pageSize: 5,
            hideOnSinglePage: true,
            showSizeChanger: false,
            onChange: setCurrentPage,
          }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </Modal>
  );
});

DocumentShareModal.displayName = "DocumentShareModal";

export default DocumentShareModal;
