// BannerCarouselSection.tsx
"use client";


import { Button, Carousel } from "antd"; // Import Carousel thay cho Slider
import Image from "next/image";
import styles from "./BannerCarouselSection.module.css";
import { useRouter } from "next/router";
import { useAccountContext } from "@/src/contexts/AccountContext";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";

const carouselImages = [
  {
    src: "/assets/img/become-partner/banner_carousel_1.png",
    alt: "Image 1",
  },
  {
    src: "/assets/img/become-partner/banner_carousel_2.png",
    alt: "Image 2",
  },
  {
    src: "/assets/img/become-partner/banner_carousel_3.png",
    alt: "Image 3",
  },
];

const BannerCarouselSection: React.FC = () => {
  const router = useRouter();
  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;

  const isLoggedIn = accountContext.isLoggedIn;
  const isValidUser =
    fullProfileResource &&
    fullProfileResource.userId &&
    fullProfileResource?.fullName;
  const isActuallyLoggedIn = isLoggedIn && isValidUser;

  const onRegisterNow = () => {
    if (!isActuallyLoggedIn) {
      Cookies.set(
        Constants.ROUTE_PRE_LOGIN,
        PartnerRouteUtils.toPartnerRegisterGetStart()
      );

      router.push("/login");
    } else {
      router.push(PartnerRouteUtils.toPartnerRegisterGetStart());
    }
  };

  // Cấu hình Carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <section className={styles.bannerContainer}>
      <div className={styles.bannerFlexContainer}>
        {/* Text Content - Left Side */}
        <div className={styles.textContent}>
          <div className={styles.mainTitle}>
            Xây dựng thương hiệu <br />
            Làm chủ công việc <br />
            Gia tăng thu nhập
          </div>
          <div className={styles.subTitle}>
            Bạn là Freelancer, một tài năng hay chuyên gia trong lĩnh vực của
            mình?
          </div>
          <Button
            type="primary"
            size="large"
            className={styles.postJobButton}
            onClick={onRegisterNow}
          >
            Trở thành Đối tác ngay
          </Button>
        </div>

        {/* Carousel Content - Right Side */}
        <div className={styles.imageContent}>
          <Carousel {...settings} className={styles.imageCarousel}>
            {carouselImages.map((image, index) => (
              <div key={index} className={styles.imageWrapper}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={500}
                  height={500}
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BannerCarouselSection;
