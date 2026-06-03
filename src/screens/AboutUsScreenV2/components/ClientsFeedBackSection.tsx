import React, { useRef, useState } from "react";
import Slider from "@ant-design/react-slick";
import { Avatar, Typography } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";

export const ClientsFeedBackSection = () => {
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
      name: "A&D Law Firm",
      jobTitle: "Công ty Luật",
      description:
        "iAgree là Đối tác chiến lược giúp chúng tôi tiếp cận và quản lý các hợp đồng một cách hiệu quả, đảm bảo tính pháp lý và an toàn cao, củng cố niềm tin với khách hàng.",
      img: "/assets/img/partners/partner-3.png",
    },
    {
      name: "Nguyễn Thu Hà",
      jobTitle: "Chuyên gia tư vấn chiến lược",
      description:
        "Nhờ iAgree, tôi có thể dễ dàng tìm kiếm và ký kết hợp đồng với các Đối tác lớn. Nền tảng này không chỉ giúp tôi tiết kiệm thời gian mà còn đảm bảo mọi giao dịch được bảo mật và minh bạch.",
      img: "/assets/img/about-us/women-1.png",
    },
    {
      name: "BUFF",
      jobTitle: "Nhà cung cấp dịch vụ công nghệ",
      description:
        "Chúng tôi tin tưởng vào sự chuyên nghiệp của iAgree trong việc kết nối các dự án chất lượng, tạo ra một môi trường làm việc đáng tin cậy và hiệu quả cho các Đối tác.",
      img: "/assets/img/partners/partner-4.png",
    },
    {
      name: "Phạm Minh Hoàng",
      jobTitle: "Giám đốc Dự án Công nghệ",
      description:
        "Là người quản lý nhiều dự án, tôi đánh giá cao hệ thống hợp đồng điện tử và quy trình thanh toán minh bạch của iAgree. Điều này giúp tôi tập trung vào công việc mà không lo lắng về các thủ tục pháp lý phức tạp.",
      img: "/assets/img/about-us/men-2.png", // Sử dụng hình ảnh nam khách hàng
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
                <Typography.Paragraph className={"quoteText"} italic={true}>
                  {`"${item.description}"`}
                </Typography.Paragraph>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};
