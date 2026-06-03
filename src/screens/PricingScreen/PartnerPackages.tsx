import { Typography, Row, Col, Button } from "antd";
import { useState } from "react";
import { PricingItemForPartner } from "./PricingItemForPartner";
import styles from "./PartnerPackages.module.css";

type PartnerPackageType = "Hằng tháng" | "Hằng năm";

interface PartnerPackageDetails {
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  features: {
    name: string;
    valueStart: string;
    valueMiddle?: string | null;
    valueEnd?: string | null;
    included: boolean | string;
    enable?: boolean | null;
  }[];
  discount?: string;
}

interface PartnerServicePackage {
  id: number;
  name: string;
  priceRange: string;
  label: string;
  packages: Record<PartnerPackageType, PartnerPackageDetails>;
}

const allPartnerPackages: PartnerServicePackage[] = [
  {
    id: 1,
    name: "Gói cơ bản",
    priceRange: "Miễn phí",
    label: "BASIC",
    packages: {
      "Hằng tháng": {
        price: 0,
        duration: "1 Tháng",
        description: "Gói cơ bản, miễn phí với các tính năng giới hạn.",
        features: [
          { name: "10 ", valueStart: "Cơ Hội/tháng", included: true },
          // {
          //   name: "Loại công việc: ",
          //   valueStart: "Cơ bản (Ngân sách công việc dưới ",
          //   valueMiddle: "5.000.000 VNĐ",
          //   valueEnd: ")",
          //   included: true,
          // },

          {
            name: "Quyền nhắn tin trực tiếp tới Khách hàng: ",
            valueStart: "Chỉ nhắn khi Khách hàng mở chat",
            included: true,
          },

          // {
          //   name: "Thẻ hồ sơ: ",
          //   valueStart: "Mặc định",
          //   included: true,
          // },
          // { name: "Hỗ trợ ưu tiên: ", valueStart: "Cơ bản", included: true },
          // {
          //   name: "Ưu tiên hiển thị trong tìm kiếm",
          //   valueStart: "",
          //   included: false,
          // },
          // {
          //   name: "Huy hiệu trên hồ sơ",
          //   valueStart: "",
          //   included: false,
          // },
          // { name: "Link profile riêng", valueStart: "", included: false },
        ],
      },
      "Hằng năm": {
        price: 0,
        duration: "12 Tháng",
        description: "Gói cơ bản, miễn phí với các tính năng giới hạn.",
        features: [
          { name: "10 ", valueStart: "Cơ Hội/tháng", included: true },
          // {
          //   name: "Loại công việc: ",
          //   valueStart: "Cơ bản (Ngân sách công việc dưới ",
          //   valueMiddle: "5.000.000 VNĐ",
          //   valueEnd: ")",
          //   included: true,
          // },

          {
            name: "Quyền nhắn tin trực tiếp tới Khách hàng: ",
            valueStart: "Chỉ nhắn khi Khách hàng mở chat",
            included: true,
          },

          // {
          //   name: "Thẻ hồ sơ: ",
          //   valueStart: "Mặc định",
          //   included: true,
          // },
          // { name: "Hỗ trợ ưu tiên: ", valueStart: "Cơ bản", included: true },
          // {
          //   name: "Ưu tiên hiển thị trong tìm kiếm",
          //   valueStart: "",
          //   included: false,
          // },
          // {
          //   name: "Huy hiệu trên hồ sơ",
          //   valueStart: "",
          //   included: false,
          // },
          // { name: "Link profile riêng", valueStart: "", included: false },
        ],
      },
    },
  },
  {
    id: 2,
    name: "Gói nâng cấp tài khoản Pro Partner",
    priceRange: "99,000đ - 999,000đ",
    label: "PRO",
    packages: {
      "Hằng tháng": {
        price: 99000,
        duration: "1 Tháng",
        description:
          "Gói hàng tháng linh hoạt, phù hợp cho Đối tác muốn thử nghiệm dịch vụ trước khi cam kết dài hạn.",
        features: [
          { name: "50 ", valueStart: "Cơ Hội/tháng", included: true },
          // {
          //   name: "Loại công việc: ",
          //   valueStart: "Nâng cao (Ngân sách công việc từ ",
          //   valueMiddle: "5.000.000 VNĐ - 20.000.000 VNĐ",
          //   valueEnd: ")",
          //   included: true,
          // },

          {
            name: "Quyền nhắn tin trực tiếp tới Khách hàng: ",
            valueStart: "Nhắn trực tiếp sau khi apply",
            included: true,
          },

          { name: "Thẻ hồ sơ: ", valueStart: "Bạc", included: true },
          // { name: "Hỗ trợ ưu tiên: ", valueStart: "Ưu tiên", included: true },
          // {
          //   name: "Ưu tiên hiển thị trong tìm kiếm: ",
          //   valueStart: "Ưu tiên",
          //   included: true,
          // },
          {
            name: "Huy hiệu trên hồ sơ: ",
            valueStart: "Pro-Partner",
            included: true,
          },
          // { name: "Link profile riêng", valueStart: "", included: false },
        ],
      },
      "Hằng năm": {
        price: 999000,
        originalPrice: 1188000,
        duration: "12 Tháng",
        description: "Gói hàng năm tiết kiệm với nhiều tính năng nâng cao.",
        discount: "Tiết kiệm 16%",
        features: [
          { name: "50 ", valueStart: "Cơ Hội/tháng", included: true },
          // {
          //   name: "Loại công việc: ",
          //   valueStart: "Nâng cao (Ngân sách công việc từ ",
          //   valueMiddle: "5.000.000 VNĐ - 20.000.000 VNĐ",
          //   valueEnd: ")",
          //   included: true,
          // },

          {
            name: "Quyền nhắn tin trực tiếp tới Khách hàng: ",
            valueStart: "Nhắn trực tiếp sau khi apply",
            included: true,
          },

          { name: "Thẻ hồ sơ: ", valueStart: "Bạc", included: true },
          // { name: "Hỗ trợ ưu tiên: ", valueStart: "Ưu tiên", included: true },
          // {
          //   name: "Ưu tiên hiển thị trong tìm kiếm: ",
          //   valueStart: "Ưu tiên",
          //   included: true,
          // },
          {
            name: "Huy hiệu trên hồ sơ: ",
            valueStart: "Pro-Partner",
            included: true,
          },
          // { name: "Link profile riêng", valueStart: "", included: false },
        ],
      },
    },
  },
  {
    id: 3,
    name: "Gói nâng cấp tài khoản Elite Partner",
    priceRange: "199,000đ - 1,999,000đ",
    label: "ELITE",
    packages: {
      "Hằng tháng": {
        price: 199000,
        duration: "1 Tháng",
        description:
          "Gói hàng tháng linh hoạt, phù hợp cho Đối tác muốn thử nghiệm dịch vụ trước khi cam kết dài hạn.",
        features: [
          { name: "100 ", valueStart: "Cơ Hội/tháng", included: true },
          // {
          //   name: "Loại công việc: ",
          //   valueStart: "Không giới hạn công việc (Từ cơ bản đến dự án trên ",
          //   valueMiddle: "20.000.000 VNĐ",
          //   valueEnd: ")",
          //   included: true,
          // },

          {
            name: "Quyền nhắn tin trực tiếp tới Khách hàng: ",
            valueStart: "Nhắn trực tiếp sau khi apply",
            included: true,
          },
          {
            name: "Thẻ hồ sơ: ",
            valueStart: "Vàng",
            included: true,
          },
          {
            name: "Hỗ trợ ưu tiên: ",
            valueStart: "Ưu tiên cao nhất (chat/email ưu tiên)",
            included: true,
          },
          {
            name: "Ưu tiên hiển thị trong tìm kiếm: ",
            valueStart: "TOP",
            included: true,
          },
          {
            name: "Huy hiệu trên hồ sơ: ",
            valueStart: "Elite-Partner",
            included: true,
          },
          {
            name: "Link profile riêng: ",
            valueStart: "Có (iagree.vn/tenban)",
            included: true,
          },
        ],
      },
      "Hằng năm": {
        price: 1999000,
        originalPrice: 2388000,
        duration: "12 Tháng",
        description:
          "Gói hàng năm tiết kiệm, bao gồm đầy đủ tính năng premium và hỗ trợ tối đa cho Đối tác.",
        discount: "Tiết kiệm 16%",
        features: [
          { name: "100 ", valueStart: "Cơ Hội/tháng", included: true },
          // {
          //   name: "Loại công việc: ",
          //   valueStart: "Không giới hạn công việc (Từ cơ bản đến dự án trên ",
          //   valueMiddle: "20.000.000 VNĐ",
          //   valueEnd: ")",
          //   included: true,
          // },

          {
            name: "Quyền nhắn tin trực tiếp tới Khách hàng: ",
            valueStart: "Nhắn trực tiếp sau khi apply",
            included: true,
          },
          {
            name: "Thẻ hồ sơ: ",
            valueStart: "Vàng",
            included: true,
          },
          {
            name: "Hỗ trợ ưu tiên: ",
            valueStart: "Ưu tiên cao nhất (chat/email ưu tiên)",
            included: true,
          },
          {
            name: "Ưu tiên hiển thị trong tìm kiếm: ",
            valueStart: "TOP",
            included: true,
          },
          {
            name: "Huy hiệu trên hồ sơ: ",
            valueStart: "Elite-Partner",
            included: true,
          },
          {
            name: "Link profile riêng: ",
            valueStart: "Có (iagree.vn/tenban)",
            included: true,
          },
        ],
      },
    },
  },
];

export const PartnerPackages = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  const handleRegister = (packageData: PartnerPackageDetails) => {
  };

  return (
    <div className="contentWrapper">
      <Typography.Title className={"sectionTitle"} level={3}>
        Nâng cấp tài khoản dành cho Đối tác
      </Typography.Title>

      {/* Nút chuyển đổi giữa tháng và năm */}
      <div className={styles["toggle-container"]}>
        <Button.Group>
          <Button
            type={isMonthly ? "primary" : "default"}
            onClick={() => setIsMonthly(true)}
          >
            Thanh toán theo tháng
          </Button>
          <Button
            type={!isMonthly ? "primary" : "default"}
            onClick={() => setIsMonthly(false)}
          >
            Thanh toán theo năm
          </Button>
        </Button.Group>
      </div>

      <Row gutter={[24, 24]} justify="center">
        {allPartnerPackages.map((partnerServicePackage) => {
          const selectedPackageData = isMonthly
            ? partnerServicePackage.packages["Hằng tháng"]
            : partnerServicePackage.packages["Hằng năm"];

          const colProps = {
            xs: 24,
            sm: 12,
            md: 8,
          };

          return (
            <Col
              {...colProps}
              className={styles["centered-col"]}
              key={partnerServicePackage?.id}
            >
              <PricingItemForPartner
                data={{
                  ...selectedPackageData,
                  name: partnerServicePackage?.name,
                  label: partnerServicePackage?.label,
                }}
                onRegister={() => handleRegister(selectedPackageData)}
                hideRegister={partnerServicePackage?.id === 1}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
