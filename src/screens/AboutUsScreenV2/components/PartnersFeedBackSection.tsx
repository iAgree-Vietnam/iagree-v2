import React, { useRef, useState } from "react";
import Slider from "@ant-design/react-slick";
import { Avatar, Typography } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";

export const PartnersFeedBackSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slider = useRef<Slider>(null);
  const { isDesktop, isMobile } = useBreakpoint();

  const settings = {
    arrows: false,
    dots: false,
    infinite: true,
    centerMode: true,
    centerPadding: isDesktop ? "0" : isMobile ? "40px" : "160px",
    slidesToShow: !isDesktop ? 1 : 3,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    beforeChange: (_: number, next: number) => setActiveIndex(next),
  };

  const testimonials = [
    {
      name: "Nguyễn Minh Quân",
      jobTitle: "Chuyên viên Marketing",
      description:
        "Trước đây, việc tìm kiếm một công việc phù hợp với đam mê và định hướng phát triển bản thân thật sự rất khó khăn. iAgree đã mang đến cho tôi một cơ hội tuyệt vời, nơi tôi có thể làm việc và phát triển sự nghiệp một cách bền vững.",
      img: "/assets/img/about-us/men-1.png",
    },
    {
      name: "Trần Khánh Linh",
      jobTitle: "Nhà thiết kế đồ họa (Freelancer)",
      description:
        "Là một freelancer, tôi luôn lo lắng về các vấn đề pháp lý và rủi ro thanh toán. Nhờ hệ thống hợp đồng điện tử và cơ chế thanh toán bảo chứng của iAgree, tôi hoàn toàn an tâm tập trung vào công việc sáng tạo của mình.",
      img: "/assets/img/about-us/women-1.png",
    },
    {
      name: "Phạm Gia Bảo",
      jobTitle: "Lập trình viên",
      description:
        "iAgree không chỉ là nền tảng kết nối, mà còn là người bảo chứng uy tín cho mọi giao dịch. Quy trình làm việc chuyên nghiệp, minh bạch giúp tôi tránh được những tranh chấp không đáng có, bảo vệ quyền lợi chính đáng của mình.",
      img: "/assets/img/about-us/men-2.png",
    },
    {
      name: "Lê Nhật Lệ",
      jobTitle: "Content Creator",
      description:
        "Sự minh bạch và an toàn là yếu tố tôi đặt lên hàng đầu khi hợp tác. iAgree đã vượt qua mọi kỳ vọng. Tôi tìm thấy nhiều dự án chất lượng và các Đối tác đáng tin cậy, giúp tôi phát triển sự nghiệp một cách vượt bậc.",
      img: "/assets/img/about-us/women-2.png",
    },
  ];

  return (
    <div style={{ position: "relative", marginTop: "3rem" }}>
      <Slider {...settings} ref={slider} className={"aboutUsFeedbackSlider"}>
        {testimonials.map((item, index) => (
          <div
            key={index}
            className={`aboutUsFeedbackSliderItem ${
              index === activeIndex ? "active" : ""
            }`}
          >
            <div className={"aboutUsFeedbackSliderCard"}>
              <div className={"customerContainer"}>
                <IconSvgLocal
                  name={"IC_QUOTE"}
                  fill={"#09993E"}
                  width={48}
                  height={48}
                  className={"quoteIcon"}
                />

                <Avatar
                  src={item.img}
                  className={"customerAvatarImage"}
                  alt={item.name}
                  style={{
                    height: index === activeIndex ? 128 : 100,
                    width: index === activeIndex ? 128 : 100,
                  }}
                />
                <Typography.Paragraph strong={true} className={"customerName"}>
                  {item.name}
                </Typography.Paragraph>
                <Typography.Paragraph className={"customerJobTitle"}>
                  {item.jobTitle}
                </Typography.Paragraph>
                <Typography.Paragraph
                  className={"quoteText"}
                  italic={true} // Thêm thuộc tính italic để in nghiêng
                >
                  {`"${item.description}"`} {/* Thêm dấu ngoặc kép */}
                </Typography.Paragraph>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
