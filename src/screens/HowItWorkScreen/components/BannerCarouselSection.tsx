// BannerCarouselSection.tsx
"use client";


import { Button, Carousel } from "antd";
import Image from "next/image";
import styles from "./BannerCarouselSection.module.css";
import { useRouter } from "next/router";
import { useAccountContext } from "@/src/contexts/AccountContext";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";

const carouselImages = [
  {
    src: "/assets/img/how-it-work/banner_carousel_1.png",
    alt: "Image 1",
  },
  {
    src: "/assets/img/how-it-work/banner_carousel_2_1.png",
    alt: "Image 2",
  },
  {
    src: "/assets/img/how-it-work/banner_carousel_3.png",
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

  const handleJobAddClick = () => {
    if (!isActuallyLoggedIn) {
      Cookies.set(Constants.ROUTE_PRE_LOGIN, JobRouteUtils.toAddScreen());
      router.push("/login");
    } else {
      router.push(JobRouteUtils.toAddScreen());
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
            Đăng công việc
            <br />
            Kết nối Đối tác
            <br />
            Nhận thành phẩm
          </div>
          <div className={styles.subTitle}>
            Giải pháp toàn diện cho công việc của bạn
          </div>
          <Button
            type="primary"
            size="large"
            className={styles.postJobButton}
            onClick={handleJobAddClick}
          >
            Đăng công việc ngay
          </Button>
        </div>

        {/* Carousel Content - Right Side */}
        <div className={styles.imageContent}>
          <Carousel {...settings} className={styles.imageCarousel}>
            {carouselImages?.map((image, index) => (
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
