
import { CategoryResource } from "@/src/data/category/models/category.types";
import servicesStyles from "./ServicesSection.module.css";
import statsStyles from "./StatsSection.module.css";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import Image from "next/image";

type StatIconName = "IC_CHART" | "IC_SUIT_CASE" | "IC_ACCOUNT" | "IC_CORPORATE";

type ServicesSectionProps = {
  jobCategories: CategoryResource[];
};

const ServicesSection: React.FC<ServicesSectionProps> = ({
  jobCategories: categories,
}) => {
  const allStatsData: {
    value: string;
    label: string;
    icon: StatIconName;
  }[] = [
    { value: "400+", label: "Lĩnh vực & Dịch vụ", icon: "IC_CHART" },
    {
      value: "250+",
      label: "Số Khách hàng đã liên hệ đến iAgree",
      icon: "IC_ACCOUNT",
    },
    {
      value: "100+",
      label: "Dự án đang tìm kiếm Đối tác",
      icon: "IC_SUIT_CASE",
    },
    {
      value: "10+",
      label: "Doanh nghiệp lựa chọn hợp tác",
      icon: "IC_CORPORATE",
    },
  ];

  const firstStatsList = allStatsData.slice(0, 2);
  const secondStatsList = allStatsData.slice(2, 4);

  return (
    <section id="services-section" className={servicesStyles.servicesSection}>
      {/* Background Image */}
      <div className={servicesStyles.backgroundImage} />
      {/* Black Overlay */}
      <div className={servicesStyles.blackOverlay} />

      <div className={servicesStyles.contentWrapper}>
        <div className={servicesStyles.sectionTitle}>Lĩnh vực tại iAgree</div>

        <div className={servicesStyles.categoriesGrid}>
          {categories.map((item, index) => (
            <div key={item.categoryId} className={servicesStyles.categoryCard}>
              <div className={servicesStyles.categoryTitle}>{item.name}</div>
              <Image
                src={`/assets/img/introduce/icon_category_${index + 1}.png`}
                alt={item.name}
                width={150}
                height={150}
                className={servicesStyles.categoryIcon}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className={statsStyles.statsWrapper}>
        <div className={statsStyles.statsTitle}>
          iAgree đã chuẩn bị <br />
          <span className={servicesStyles.sectionTitleSpan}>
            {" "}
            những gì cho{" "}
          </span>
          Đối tác
        </div>

        {/* First Stats List */}
        <div className={statsStyles.statsGridFirst}>
          {firstStatsList.map((stat, index) => (
            <div key={index} className={statsStyles.statCard}>
              <IconSvgLocal name={stat.icon} className={statsStyles.statIcon} />
              <div className={statsStyles.statValue}>{stat.value}</div>
              <div className={statsStyles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Second Stats List */}
        <div className={statsStyles.statsGridSecond}>
          {secondStatsList.map((stat, index) => (
            <div key={index} className={statsStyles.statCard}>
              <IconSvgLocal name={stat.icon} className={statsStyles.statIcon} />
              <div className={statsStyles.statValue}>{stat.value}</div>
              <div className={statsStyles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
