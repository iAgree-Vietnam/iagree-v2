
import { Table } from "antd";

const dataSource = [
  {
    key: "1",
    content:
      "Tại góc phải phía trên màn hình, nhấn vào biểu tượng Ảnh đại diện.",
    image: "/assets/img/identity-support/1.png",
  },
  {
    key: "2",
    content: "Chọn mục “Thông tin cá nhân” từ danh sách.",
    image: "/assets/img/identity-support/2.png",
  },
  {
    key: "3",
    content:
      "Tại giao diện “Thông tin cá nhân”, điền số CCCD chính xác vào ô tương ứng.",
    image: "/assets/img/identity-support/3.png",
  },
  {
    key: "4",
    content:
      "Kéo xuống phần “Hình mặt trước” và “Hình mặt sau” → Tải lên hình ảnh CCCD rõ nét, không bị mờ hoặc che khuất thông tin.",
    image: "/assets/img/identity-support/4.png",
  },
  {
    key: "5",
    content: `Sau khi điền và tải lên đầy đủ, kiểm tra lại toàn bộ thông tin một lần nữa.<br/>
    Nhấn “Lưu thông tin” ở cuối trang để hoàn tất.<br/>
    Hệ thống sẽ hiển thị thông báo “Cập nhật thông tin tài khoản thành công” khi quá trình hoàn tất.`,
    image: "/assets/img/identity-support/5.png",
  },
];

const columns = [
  {
    title: "NỘI DUNG HƯỚNG DẪN",
    dataIndex: "content",
    key: "content",
    width: "50%",
    render: (text: string) => (
      <div
        style={{
          whiteSpace: "normal",
          fontSize: 16,
          lineHeight: 1.6,
        }}
        dangerouslySetInnerHTML={{
          __html: text.replace(/\n/g, "<br/>"),
        }}
      />
    ),
  },
  {
    title: "HÌNH ẢNH MINH HỌA",
    dataIndex: "image",
    key: "image",
    width: "50%",
    render: (src: string) =>
      src.includes("http") ? (
        <iframe
          src={src}
          title="Video hướng dẫn"
          allowFullScreen
          frameBorder="0"
          style={{
            width: "100%",
            height: "320px",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
          }}
        />
      ) : (
        <img
          src={src}
          alt="Hình minh họa"
          style={{
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #f0f0f0",
          }}
        />
      ),
  },
];

const GuideTable: React.FC = () => (
  <div>
    <style>{`
      /* Header styling */
      .custom-guide-table .ant-table-thead > tr > th {
        background-color: #01b004 !important;
        color: white !important;
        font-weight: 600;
        text-align: center;
      }

      /* Hover effect for rows */
      .custom-guide-table .ant-table-tbody > tr:hover > td {
        background-color: #e6f7e6 !important;
        transition: background-color 0.3s ease;
      }

      /* Center image cell */
      .custom-guide-table .ant-table-tbody td img {
        display: block;
        margin: 0 auto;
      }
    `}</style>

    <Table
      className="custom-guide-table"
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      bordered
      style={{
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
      }}
    />
  </div>
);

export default GuideTable;