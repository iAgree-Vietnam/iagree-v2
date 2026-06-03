import React, { useCallback, useMemo } from "react";
import { Typography, Button, Row, Col, message } from "antd";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "./PartnerRegisterGetStartScreen.module.css";
// Giữ nguyên Imports hình ảnh
import image1 from "@/public/assets/img/partner-register/img_get_started_1.png";
import image2 from "@/public/assets/img/partner-register/img_get_started_2.png";
import image3 from "@/public/assets/img/partner-register/img_get_started_3.png";
import { useAccountContext } from "@/src/contexts/AccountContext";
import Cookies from "js-cookie";
import Constants from "@/src/constants/Constants";
import { useLogout } from "@/src/hooks/query/useLogout";
// 🛑 XÓA: useIsMobile không được sử dụng
// import useIsMobile from "../HomeScreen/hooks/useIsMobile"; 

const { Title, Text } = Typography;

// 🛑 XÓA PROPS KHÔNG DÙNG: onStart
// interface PartnerRegisterGetStartScreenProps {
//   onStart: () => void;
// }

const sampleImages = [image1.src, image2.src, image3.src];

export const PartnerRegisterGetStartScreen: React.FC = () => {
  const router = useRouter();
  const accountContext = useAccountContext();
  const fullProfileResource = accountContext.auth;
  const { mutateAsync: mutateAsyncLogout } = useLogout();

  // 🟢 TỐI ƯU HÓA: Tính toán trạng thái bằng useMemo
  const { isActuallyLoggedIn, isPartner, isRegisterBecomePartnerFlag } = useMemo(() => {
    const isLoggedIn = accountContext.isLoggedIn;
    const isValidUser =
      fullProfileResource &&
      fullProfileResource?.userId &&
      fullProfileResource?.fullName;
    
    const actuallyLoggedIn = isLoggedIn && isValidUser;
    const isPartner = fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;
    const isRegisterBecomePartner = Cookies.get(Constants.IS_REGISTER_BECOME_PARTNER);
    
    return {
      isActuallyLoggedIn: actuallyLoggedIn,
      isPartner: isPartner,
      isRegisterBecomePartnerFlag: isRegisterBecomePartner === "true",
    };
  }, [fullProfileResource, accountContext.isLoggedIn]);


  // 🟢 DÙNG USECALLBACK CHO ONLOGOUT
  const onLogout = useCallback(async () => {
    try {
      await mutateAsyncLogout();
    } catch (_) {
        // Bỏ qua lỗi logout
    }
    // Dọn dẹp cookies và chuyển hướng
    Cookies.set(Constants.IS_REGISTER_BECOME_PARTNER, "false");
    Cookies.set(Constants.ROUTE_PRE_LOGIN, "/introduce");
    router.replace("/introduce");
  }, [mutateAsyncLogout, router]);


  // 🟢 TỐI ƯU HÓA: Đơn giản hóa luồng onStart
  const onStart = useCallback(async () => {
    
    const preLoginRoute = PartnerRouteUtils.toPartnerRegisterGetStart();

    // 1. CHƯA ĐĂNG NHẬP
    if (!isActuallyLoggedIn) {
      Cookies.set(Constants.ROUTE_PRE_LOGIN, preLoginRoute);
      router.push("/login");
      return;
    }

    // 2. ĐÃ ĐĂNG KÝ TRƯỚC VÀ ĐÃ LÀ ĐỐI TÁC (Tức là đã hoàn thành quy trình)
    if (isRegisterBecomePartnerFlag && isPartner) {
      message.success(
        "Bạn đã là Đối tác của iAgree, chúng tôi sẽ gửi email thông báo tới bạn khi ra mắt chính thức"
      );
      await onLogout();
      return;
    }

    // 3. ĐÃ ĐĂNG KÝ TRƯỚC NHƯNG CHƯA LÀ ĐỐI TÁC (Tiếp tục quy trình)
    if (isRegisterBecomePartnerFlag && !isPartner) {
      router.push(PartnerRouteUtils.toPartnerRegisterV2());
      return;
    }
    
    // 4. ĐÃ ĐĂNG NHẬP NHƯNG CHƯA ĐĂNG KÝ TRƯỚC (Đây là lần đầu tiên bấm Bắt đầu)
    if (!isPartner) {
      // Chuyển đến trang đăng ký V2
      router.push(PartnerRouteUtils.toPartnerRegisterV2());
    } else {
      // Đã là đối tác, kiểm tra nếu có trang chi tiết job để điều hướng
      const jobDetailRoute = Cookies.get("JOB_DETAIL_PAGE");
      if (jobDetailRoute) {
        Cookies.remove("JOB_DETAIL_PAGE");
        router.push(jobDetailRoute);
      } else {
        router.push(PartnerRouteUtils.toProfileUrl());
      }
    }
  }, [
    isActuallyLoggedIn,
    isPartner,
    isRegisterBecomePartnerFlag,
    onLogout,
    router,
  ]);

  const title = "Đăng ký Đối tác";

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={styles.getStartedContainer}>
        <Row
          justify="center"
          align="middle"
          className={styles.getStartedContent}
        >
          <Col xs={24} md={24} lg={12} className={styles.textColumn}>
            <Title level={1} className={styles.mainTitle}>
              Sẵn sàng kết nối Khách hàng tiềm năng và phát triển sự nghiệp của
              bạn
            </Title>
            <Text className={styles.descriptionText}>
              Hãy gia nhập cộng đồng Đối tác iAgree ngay hôm nay để kết nối với
              hàng ngàn Khách hàng tiềm năng, mở rộng mạng lưới, và xây dựng
              thương hiệu cá nhân vững chắc. Chỉ với vài bước đăng ký đơn giản,
              hành trình phát triển sự nghiệp tự do của bạn chính thức bắt đầu.
            </Text>
            <Button
              type="primary"
              size="large"
              onClick={onStart}
              className={styles.startButton}
              // 🟢 Dùng isActuallyLoggedIn để kiểm tra trạng thái chung
              disabled={!isActuallyLoggedIn && !isRegisterBecomePartnerFlag} 
            >
              Bắt đầu đăng ký ngay
            </Button>
          </Col>

          <Col xs={24} md={24} lg={12} className={styles.imageColumn}>
            <div className={styles.imageStackContainer}>
              {sampleImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Image ${index + 1}`}
                  className={`${styles.imageStackItem} image-stack-item`}
                  style={{
                    animationDelay: `${index * 3}s`,
                  }}
                />
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};