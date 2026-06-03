
import { Layout as AntLayout, Layout } from "antd"; // Đổi tên để tránh xung đột với tên component của bạn

interface PartnerRegisterLayoutProps {
  children: React.ReactNode;
}

export const PartnerRegisterLayout: React.FC<PartnerRegisterLayoutProps> = ({
  children,
}) => {
  return (
    <Layout style={{ minHeight: "100vh", background: "white" }}>
      {/* Content của các trang sẽ được render ở đây */}
      {children}
    </Layout>
  );
};
