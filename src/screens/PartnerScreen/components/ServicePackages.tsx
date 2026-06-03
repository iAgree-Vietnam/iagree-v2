"use client";

import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { Typography, Row, Col } from "antd";
import { ChevronDown, DollarSign, Clock, Check } from "lucide-react";
import { useState } from "react";

type PackageType = "Cơ bản" | "Nâng cao" | "Cao cấp";

interface PackageDetails {
  price: string;
  duration: string;
  description: string;
  features: {
    name: string;
    included: boolean;
  }[];
}

interface ServicePackage {
  id: number;
  name: string;
  priceRange: string;
  packages: Record<PackageType, PackageDetails>;
}

export const ServicePackages = () => {
  const [expandedItems, setExpandedItems] = useState(new Set<number>());
  const [selectedPackage, setSelectedPackage] = useState<{
    [key: number]: PackageType;
  }>({});

  const servicePackages: ServicePackage[] = [
    {
      id: 1,
      name: "Thiết kế website doanh nghiệp chuyên nghiệp",
      priceRange: "20,000,000đ - 100,000,000đ",
      packages: {
        "Cơ bản": {
          price: "20,000,000",
          duration: "1 Tháng",
          description:
            "Gói cơ bản giúp doanh nghiệp sở hữu website chuẩn SEO, giao diện đẹp, phù hợp cho doanh nghiệp mới khởi nghiệp.",
          features: [
            { name: "Thiết kế giao diện chuẩn mobile", included: true },
            { name: "Tích hợp form liên hệ", included: true },
            { name: "Tích hợp thanh toán online", included: false },
          ],
        },
        "Nâng cao": {
          price: "50,000,000",
          duration: "2 Tháng",
          description:
            "Gói nâng cao với các tính năng mở rộng như blog, landing page, hỗ trợ đa ngôn ngữ, phù hợp cho doanh nghiệp đang phát triển.",
          features: [
            { name: "Thiết kế giao diện chuẩn mobile", included: true },
            { name: "Tích hợp form liên hệ", included: true },
            { name: "Tích hợp thanh toán online", included: true },
          ],
        },
        "Cao cấp": {
          price: "100,000,000",
          duration: "3 Tháng",
          description:
            "Gói cao cấp với đầy đủ tính năng premium, tối ưu tốc độ, bảo mật cao, tích hợp hệ thống quản lý nội dung (CMS) tùy biến.",
          features: [
            { name: "Thiết kế giao diện chuẩn mobile", included: true },
            { name: "Tích hợp form liên hệ", included: true },
            { name: "Tích hợp thanh toán online", included: true },
          ],
        },
      },
    },
    {
      id: 2,
      name: "Dịch vụ quản lý marketing đa kênh",
      priceRange: "30,000,000đ - 150,000,000đ",
      packages: {
        "Cơ bản": {
          price: "30,000,000",
          duration: "1 Tháng",
          description:
            "Gói cơ bản dành cho doanh nghiệp nhỏ, tập trung quản lý fanpage và quảng cáo Facebook cơ bản.",
          features: [
            { name: "Quản lý nội dung fanpage", included: true },
            { name: "Thiết kế bài đăng quảng cáo", included: true },
            { name: "Chạy quảng cáo Google Ads", included: false },
          ],
        },
        "Nâng cao": {
          price: "75,000,000",
          duration: "2 Tháng",
          description:
            "Gói nâng cao hỗ trợ chạy quảng cáo đa nền tảng, xây dựng chiến dịch tổng thể, phù hợp doanh nghiệp đang mở rộng.",
          features: [
            { name: "Quản lý nội dung fanpage", included: true },
            { name: "Thiết kế bài đăng quảng cáo", included: true },
            { name: "Chạy quảng cáo Google Ads", included: true },
          ],
        },
        "Cao cấp": {
          price: "150,000,000",
          duration: "3 Tháng",
          description:
            "Gói cao cấp cung cấp giải pháp toàn diện, quản lý hình ảnh thương hiệu, chạy quảng cáo đa quốc gia, tối ưu ngân sách.",
          features: [
            { name: "Quản lý nội dung fanpage", included: true },
            { name: "Thiết kế bài đăng quảng cáo", included: true },
            { name: "Chạy quảng cáo Google Ads", included: true },
          ],
        },
      },
    },
    {
      id: 3,
      name: "Phát triển ứng dụng di động theo yêu cầu",
      priceRange: "50,000,000đ - 300,000,000đ",
      packages: {
        "Cơ bản": {
          price: "50,000,000",
          duration: "2 Tháng",
          description:
            "Gói cơ bản dành cho startup, xây dựng ứng dụng MVP nhanh chóng, với các tính năng cơ bản.",
          features: [
            { name: "Ứng dụng Android hoặc iOS", included: true },
            { name: "Giao diện chuẩn UX/UI cơ bản", included: true },
            { name: "Tích hợp API nâng cao", included: false },
          ],
        },
        "Nâng cao": {
          price: "150,000,000",
          duration: "4 Tháng",
          description:
            "Gói nâng cao hỗ trợ phát triển đa nền tảng, tích hợp thanh toán, push notification, phù hợp doanh nghiệp đang phát triển.",
          features: [
            { name: "Ứng dụng Android & iOS", included: true },
            { name: "Giao diện UX/UI tùy chỉnh", included: true },
            { name: "Tích hợp API nâng cao", included: true },
          ],
        },
        "Cao cấp": {
          price: "300,000,000",
          duration: "6 Tháng",
          description:
            "Gói cao cấp thiết kế và phát triển toàn diện, bảo mật cao, hỗ trợ backend riêng, vận hành hệ thống cloud.",
          features: [
            { name: "Ứng dụng Android & iOS", included: true },
            { name: "Giao diện UX/UI tùy chỉnh", included: true },
            { name: "Tích hợp API nâng cao", included: true },
          ],
        },
      },
    },
  ];

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
      // Set default selected package to 'Cơ bản' when expanding
      if (!selectedPackage[id]) {
        setSelectedPackage((prev) => ({
          ...prev,
          [id]: "Cơ bản" as PackageType,
        }));
      }
    }
    setExpandedItems(newExpanded);
  };

  const selectPackage = (serviceId: number, packageName: PackageType) => {
    setSelectedPackage((prev) => ({ ...prev, [serviceId]: packageName }));
  };

  return (
    <div className="partnerConnectContainer" style={{ marginBottom: 24 }}>
      <Typography.Title level={4} style={{ fontWeight: "500" }}>
        Các gói dịch vụ cung cấp
      </Typography.Title>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {servicePackages.map((service) => (
          <div key={service.id}>
            {/* Service Item */}
            <div
              style={{
                width: "100%",
                transition: "all 0.2s",
                background: expandedItems.has(service.id)
                  ? "linear-gradient(135deg, rgba(245, 247, 246, 1) 0%, rgba(224, 255, 233, 1) 100%)"
                  : "transparent",
              }}
            >
              <div
                style={{
                  minHeight: "82px", // Đổi từ height thành minHeight
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: expandedItems.has(service.id)
                    ? "#09993E"
                    : "linear-gradient(135deg, rgba(251, 246, 245, 1) 0%, rgba(241, 246, 255, 1) 100%)",
                  padding: "16px",
                  display: "flex", // Thêm flex display
                  alignItems: "center", // Căn giữa theo chiều dọc
                }}
                onClick={() => toggleExpanded(service.id)}
              >
                <Row style={{ width: "100%" }}>
                  <Col span={22}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: expandedItems.has(service.id)
                            ? "#FFFFFF"
                            : "#111827",
                          lineHeight: "1.2",
                          margin: 0, // Loại bỏ margin mặc định
                          wordBreak: "break-word", // Cho phép xuống dòng
                          display: "-webkit-box",
                          WebkitLineClamp: 2, // Giới hạn tối đa 2 dòng
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {service.name}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <IconSvgLocal
                          name={"IC_MONEY"}
                          fill={
                            expandedItems.has(service.id)
                              ? "#FFFFFF"
                              : "#09993E"
                          }
                        />
                        <Typography.Text
                          style={{
                            fontSize: "14px",
                            fontWeight: "400",
                            color: expandedItems.has(service.id)
                              ? "#FFFFFF"
                              : "#111827",
                            margin: 0,
                          }}
                        >
                          {service.priceRange}
                        </Typography.Text>
                      </div>
                    </div>
                  </Col>
                  <Col
                    span={2}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronDown
                      className={`transition-transform duration-200 ${
                        expandedItems.has(service.id) ? "rotate-180" : ""
                      }`}
                      style={{
                        color: expandedItems.has(service.id)
                          ? "#FFFFFF"
                          : "#09993E",
                        width: "20px",
                        height: "20px",
                        transform: expandedItems.has(service.id)
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedItems.has(service.id) && (
              <div
                style={{
                  marginTop: "0",
                  padding: "12px",
                  background:
                    "linear-gradient(135deg, rgba(245, 247, 246, 1) 0%, rgba(224, 255, 233, 1) 100%)",
                  borderRadius: "0 0 12px 12px",
                  animation: "slideIn 0.2s ease-out",
                }}
              >
                {/* Package Tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: "0px",
                    marginBottom: "12px",
                    background: "#F5F6FB",
                    borderRadius: "12px",
                    padding: "4px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {(Object.keys(service.packages) as PackageType[]).map(
                    (packageName) => (
                      <button
                        key={packageName}
                        onClick={() => selectPackage(service.id, packageName)}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          border: "none",
                          background:
                            selectedPackage[service.id] === packageName
                              ? "#FFFFFF"
                              : "transparent",
                          color:
                            selectedPackage[service.id] === packageName
                              ? "#000000"
                              : "#6B7280",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "500",
                          transition: "all 0.2s",
                          textAlign: "center",
                        }}
                      >
                        {packageName}
                      </button>
                    )
                  )}
                </div>

                {/* Package Details */}
                {selectedPackage[service.id] && (
                  <div
                    style={{
                      background: "transparent",
                      padding: "6px",
                    }}
                  >
                    {/* Price and Duration */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "transparent",
                        marginBottom: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0",
                        }}
                      >
                        <div
                          style={{
                            background: "transparent",
                            borderRadius: "8px",
                            padding: "0",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <IconSvgLocal
                            name={"IC_MONEY"}
                            fill="#09993E"
                            height={20}
                            width={20}
                          />
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#000000",
                            }}
                          >
                            {
                              service.packages[selectedPackage[service.id]]
                                .price
                            }
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            background: "transparent",
                            borderRadius: "8px",
                            padding: "4px 8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Clock size={16} color="#09993E" />
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: "#000000",
                            }}
                          >
                            {
                              service?.packages?.[
                                selectedPackage?.[service?.id]
                              ].duration
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "24px" }}>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6B7280",
                          lineHeight: "1.6",
                          margin: 0,
                        }}
                      >
                        {
                          service?.packages?.[selectedPackage?.[service?.id]]
                            .description
                        }
                      </p>
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: "1px",
                        background: "#E5E7EB",
                        margin: "24px 0",
                      }}
                    ></div>

                    {/* Features */}
                    <div>
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#111827",
                          marginBottom: "16px",
                        }}
                      >
                        Tính năng bao gồm:
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        {service?.packages?.[
                          selectedPackage?.[service?.id]
                        ].features?.map((feature, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                background: feature.included
                                  ? "#16A34A"
                                  : "#E5E7EB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Check
                                size={12}
                                color={feature.included ? "#FFFFFF" : "#9CA3AF"}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "14px",
                                color: feature.included ? "#111827" : "#9CA3AF",
                                fontWeight: feature.included ? "500" : "400",
                              }}
                            >
                              {feature.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
