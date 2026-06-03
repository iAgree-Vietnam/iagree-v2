
import { FormInstance } from "antd/lib/form/Form";
import { Result, Button, Typography, Divider, Row, Col, Empty } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

import PartnerCard from "./PartnerCard";
import { useRouter } from "next/router";

const { Title, Text } = Typography;

interface JobRegisteredOptionsStepsProps {
  form: FormInstance;
  redirectUrl?: string | null;
  suggestedPartners?: {
    id: string;
    name: string;
    avatar: string;
    expertise: string;
    title?: string;
    rating?: number;
    field?: string;
  }[];
}

function JobRegisteredOptionsStep(props: JobRegisteredOptionsStepsProps) {
  const { form, redirectUrl, suggestedPartners } = props;
  const router = useRouter();

  // const defaultSuggestedPartners = [
  //   {
  //     id: "1",
  //     name: "Nguyễn Văn A",
  //     avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
  //     expertise: "Frontend Development, UI/UX, ReactJS",
  //     title: "Senior Frontend Developer",
  //     rating: 4.8,
  //     field: "Phát triển phần mềm, Website",
  //   },
  //   {
  //     id: "2",
  //     name: "Trần Thị B",
  //     avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
  //     expertise: "Backend Development, Node.js, Database Design",
  //     title: "Lead Backend Engineer",
  //     rating: 4.5,
  //     field: "Phát triển phần mềm, Dữ liệu lớn",
  //   },
  //   {
  //     id: "3",
  //     name: "Lê Văn C",
  //     avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
  //     expertise:
  //       "Mobile App Development, Flutter, React Native, Mobile App Development, Flutter, React Native",
  //     title: "Senior Mobile Developer",
  //     rating: 4.2,
  //     field: "Phát triển ứng dụng di động",
  //   },
  //   {
  //     id: "4",
  //     name: "Phạm Thị D",
  //     avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=4",
  //     expertise: "Data Science, Machine Learning, Python",
  //     title: "AI/ML Specialist",
  //     rating: 4.9,
  //     field: "Khoa học dữ liệu & AI, Nghiên cứu",
  //   },
  //   {
  //     id: "5",
  //     name: "Hoàng Văn E",
  //     avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=5",
  //     expertise: "UI/UX Design, Figma, Prototyping",
  //     title: "Product Designer",
  //     rating: 4.7,
  //     field: "Thiết kế UI/UX, Đồ họa",
  //   },
  //   {
  //     id: "6",
  //     name: "Đỗ Thị F",
  //     avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=6",
  //     expertise: "Cloud Computing, AWS, DevOps",
  //     title: "Cloud Architect",
  //     rating: 4.6,
  //     field: "DevOps & Cloud, Hạ tầng",
  //   },
  // ];

  // const partnersToDisplay = suggestedPartners || defaultSuggestedPartners;

  return (
    <div
      className={"formGroupContainer"}
      style={{ borderBottom: "0px solid #D4D4D4" }}
    >
      <div className={"formGroupContentContainer"}>
        {/* Phần thông báo đăng tuyển thành công */}
        <Result
          status="success"
          icon={
            <IconSvgLocal
              name={"IC_CHECK_SUCCESS"}
              width={60}
              height={60}
              fill="transparent"
            />
          }
          title="Công việc đã được đăng tải thành công"
          subTitle="Đừng quên bật thông báo và chờ đón các ứng viên phù hợp gửi đề xuất nhé!"
          extra={[
            <Button 
              type="primary" 
              key="view-job"
              disabled={!redirectUrl}
              onClick={() => {
                if (redirectUrl) {
                  router.push(redirectUrl);
                }
              }}
            >
              Xem chi tiết công việc đã đăng
            </Button>,
          ]}
        />

        {/* Đường phân cách */}
        <Divider style={{ borderColor: "#d4d4d4", margin: "32px 0" }} />

        {/* Phần danh sách Đối tác gợi ý */}
        {/* <div style={{ marginTop: 32 }}>
          <Title level={4}>Đối tác gợi ý</Title>
          {partnersToDisplay.length > 0 ? (
            <Row gutter={[16, 16]}>
              {" "} */}
              {/* gutter để tạo khoảng cách giữa các cột và hàng */}
              {/* {partnersToDisplay.map((partner) => (
                <Col key={partner.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                  <PartnerCard partner={partner} />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không tìm thấy đối tác gợi ý nào dựa trên tiêu chí của bạn."
              style={{ margin: "24px 0" }}
            />
          )}
        </div> */}
      </div>
    </div>
  );
}

export default JobRegisteredOptionsStep;
