import React, { useEffect } from "react";
import { Col, Layout, Menu, Row, Space } from "antd";
import {
  FacebookFilled,
  InstagramFilled,
  LinkedinFilled,
  TwitterSquareFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import { SiTiktok } from "react-icons/si"; // TikTok icon từ react-icons (vì Ant Design không có sẵn)
import clsx from "clsx";
import Link from "next/link";
import { useAccountContext } from "../../contexts/AccountContext";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import { useFooterMenu } from "./hooks/useFooterMenu";
import styles from "./FooterV2.module.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/store/store";
import { fetchChatList } from "@/src/store/slices/chat";

const FooterV2 = () => {
  const accountContext = useAccountContext();
  const { isDesktop } = useBreakpoint();
  const { setting } = accountContext;

  const {
    termMenus,
    supportMenus,
    policyMenus,
    introduceMenus,
    partnerMenus,
    partners,
    communityMenus,
    normalizeSettingItem,
  } = useFooterMenu();
  const dispatch = useDispatch<AppDispatch>();
  const { auth: fullProfileResource } = accountContext;

  useEffect(() => {
    // Dispatch fetchChatList khi component được render lần đầu
    dispatch(
      fetchChatList({
        userId: fullProfileResource?.userId,
        params: { message: 1 },
      })
    );
  }, [dispatch]);
  return (
    <Layout.Footer className={clsx(styles.antLayoutFooter, "text-black")}>
      <div className={styles.footerWrapper}>
        <img
          src="https://tracker.metricool.com/c3po.jpg?hash=594337d2cb19b0dac6c89fdc3502ca87"
          alt=""
          className="absolute w-px h-px opacity-0 pointer-events-none"
        />
        <div className={styles.footerMainContainer}>
          <div className={clsx(styles.contentWrapper, "flex-col md:flex-row")}>
            <Row gutter={[40, 16]} justify={"space-between"}>
              <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                <div className={styles.footerLogo}>
                  <img alt={"IAGREE logo"} src={"/assets/img/logo.svg"} />
                </div>

                {setting?.officeAddress && (
                  <div className={styles.footerInfoContainer}>
                    <div className={styles.footerInfoLabel}>
                      <strong
                        dangerouslySetInnerHTML={{
                          __html: setting?.officeName || "",
                        }}
                      />
                    </div>

                    <div className={styles.footerInfoContainer}>
                      <div className={styles.footerInfoLabel}>
                        Đăng ký kinh doanh số:
                      </div>
                      <div className={styles.footerInfoValue}>
                        <strong
                          dangerouslySetInnerHTML={{
                            __html: setting?.taxCode || "",
                          }}
                        />
                      </div>
                    </div>

                    <div className={styles.footerInfoLabel}>
                      Địa chỉ trụ sở:
                    </div>
                    <div className={styles.footerInfoValue}>
                      <strong
                        dangerouslySetInnerHTML={{
                          __html: setting?.officeAddress || "",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className={styles.footerInfoContainer}>
                  <Space size={"large"} align={"start"}>
                    {setting?.hotlineNumber && (
                      <div>
                        <div className={styles.footerInfoLabel}>
                          Hotline hỗ trợ
                        </div>
                        <div className={styles.footerInfoValue}>
                          <strong
                            dangerouslySetInnerHTML={{
                              __html: setting?.hotlineNumber || "",
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {setting?.email && (
                      <div>
                        <div className={styles.footerInfoLabel}>
                          Mail liên hệ:
                        </div>
                        <div className={styles.footerInfoValue}>
                          <strong
                            dangerouslySetInnerHTML={{
                              __html: setting?.email || "",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Space>
                </div>

                {/* START: Thêm số điện thoại liên hệ tương tự Email */}
                <div
                  className={styles.footerInfoContainer}
                  style={{ marginTop: "16px" }}
                >
                  <div>
                    <div className={styles.footerInfoLabel}>
                      Điện thoại liên hệ:
                    </div>
                    <div className={styles.footerInfoValue}>
                      <Link
                        href="tel:02873030313"
                        style={{ fontWeight: "bold" }}
                      >
                        02873030313
                      </Link>
                      <span style={{ margin: "0 4px", color: "#666" }}>|</span>
                      <Link
                        href="tel:1900638313"
                        style={{ fontWeight: "bold" }}
                      >
                        1900638313
                      </Link>
                    </div>
                  </div>
                </div>
                {/* END: Thêm số điện thoại liên hệ tương tự Email */}

                <div style={{ marginTop: "0", marginBottom: "0" }}>
                  <Link
                    target="_blank"
                    href={"http://online.gov.vn/Website/chi-tiet-132417"}
                  >
                    <img
                      style={{ maxWidth: 150 }}
                      alt=""
                      title=""
                      src={"/assets/img/logoCCDV.png"}
                    />
                  </Link>
                </div>
              </Col>

              <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={18}>
                {!isDesktop ? (
                  <div>
                    <Menu
                      className={styles.footerMenuContainer}
                      mode={"inline"}
                      items={[
                        {
                          key: "POLICY_INFO",
                          label: (
                            <h3 className={styles.footerTitle}>Chính sách</h3>
                          ),
                          children: policyMenus,
                        },
                        {
                          key: "COMMUNITY_IAGREE",
                          label: (
                            <h3 className={styles.footerTitle}>Cộng đồng</h3>
                          ),
                          children: communityMenus,
                        },
                        {
                          key: "TERM_INFO",
                          label: (
                            <h3 className={styles.footerTitle}>Điều khoản</h3>
                          ),
                          children: termMenus,
                        },
                        {
                          key: "SUPPORT_INFO",
                          label: <h3 className={styles.footerTitle}>Hỗ trợ</h3>,
                          children: supportMenus,
                        },
                        {
                          key: "INTRODUCE_INFO",
                          label: (
                            <h3 className={styles.footerTitle}>Giới thiệu</h3>
                          ),
                          children: introduceMenus,
                        },
                        {
                          key: "PAYMENT_INFO",
                          label: (
                            <h3 className={styles.footerTitle}>Thanh toán</h3>
                          ),
                          children: partnerMenus,
                        },
                      ]}
                    />
                  </div>
                ) : (
                  <Row justify={"space-between"}>
                    <Col xs={12} sm={12} flex={1}>
                      <h3 className={styles.footerTitle}>Chính sách</h3>
                      <Menu
                        className={styles.footerMenuContainer}
                        mode={"vertical"}
                        items={policyMenus}
                      />
                      <h3 className={styles.footerTitle}>Cộng đồng</h3>
                      <Menu
                        className={styles.footerMenuContainer}
                        mode={"vertical"}
                        items={communityMenus}
                      />
                    </Col>

                    <Col xs={12} sm={12} flex={1}>
                      <h3 className={styles.footerTitle}>Điều khoản</h3>
                      <Menu
                        className={styles.footerMenuContainer}
                        mode={"vertical"}
                        items={termMenus}
                      />
                      <h3 className={styles.titleMargin}>Hỗ trợ</h3>
                      <Menu
                        className={styles.footerMenuContainer}
                        mode={"vertical"}
                        items={supportMenus}
                      />
                    </Col>

                    <Col xs={12} sm={12} flex={1}>
                      <h3 className={styles.footerTitle}>Giới thiệu</h3>
                      <Menu
                        className={styles.footerMenuContainer}
                        mode={"vertical"}
                        items={introduceMenus}
                      />

                      <h3 className={styles.titleMargin}>Thanh toán</h3>
                      <div className={styles.partnerLogos}>
                        {partners?.map((partner, index) => (
                          <img
                            key={index}
                            src={partner.src}
                            alt={partner.alt}
                            style={{ height: 28, objectFit: "cover" }}
                          />
                        ))}
                      </div>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          </div>
        </div>

        <div className={styles.copyrightWrapper}>
          <div className={styles.contentWrapper}>
            <Space size={"middle"}>
              {setting?.facebookUrl && (
                <Link
                  href={normalizeSettingItem(setting.facebookUrl)}
                  target="_blank"
                >
                  <FacebookFilled style={{ fontSize: 24 }} />
                </Link>
              )}
              {setting?.twitterUrl && (
                <Link
                  href={normalizeSettingItem(setting.twitterUrl)}
                  target="_blank"
                >
                  <TwitterSquareFilled style={{ fontSize: 24 }} />
                </Link>
              )}
              {setting?.instagramUrl && (
                <Link
                  href={normalizeSettingItem(setting.instagramUrl)}
                  target="_blank"
                >
                  <InstagramFilled style={{ fontSize: 24 }} />
                </Link>
              )}
              {setting?.linkedinUrl && (
                <Link
                  href={normalizeSettingItem(setting.linkedinUrl)}
                  target="_blank"
                >
                  <LinkedinFilled style={{ fontSize: 24 }} />
                </Link>
              )}
              {/* {setting?.communFacebook && (
                <Link
                  href={normalizeSettingItem(setting.communFacebook)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {(FaFacebookSquare as any)({ style: { fontSize: 24 } })}
                </Link>
              )} */}
              {/* TikTok */}
              {setting?.tiktokUrl && (
                <Link
                  href={normalizeSettingItem(setting.tiktokUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {(SiTiktok as any)({ style: { fontSize: 22 } })}
                </Link>
              )}
              {/* YouTube */}
              {setting?.youtubeUrl && (
                <Link
                  href={normalizeSettingItem(setting?.youtubeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YoutubeFilled style={{ fontSize: 24 }} />
                </Link>
              )}
            </Space>
            <div className={styles.copyrightText}>
              © A&D 2025. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </Layout.Footer>
  );
};

export default FooterV2;
