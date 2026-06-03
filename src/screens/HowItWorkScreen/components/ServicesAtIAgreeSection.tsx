
import { CategoryResource } from "@/src/data/category/models/category.types";
import servicesStyles from "./ServicesAtIAgreeSection.module.css";
import Image from "next/image";

type ServicesSectionProps = {
  jobCategories: CategoryResource[];
};

const ServicesAtIAgreeSection: React.FC<ServicesSectionProps> = ({
  jobCategories: categories,
}) => {
  return (
    <section id="services-section" className={servicesStyles.servicesSection}>
      <div className={servicesStyles.contentWrapper}>
        <div className={servicesStyles.sectionTitle}>CÁC LĨNH VỰC IAGREE CUNG CẤP</div>

        <div className={servicesStyles.categoriesGrid}>
          {categories?.map((item, index) => (
            <div key={item.categoryId} className={servicesStyles?.categoryCard}>
              <div className={servicesStyles?.categoryTitle}>{item?.name}</div>
              <Image
                src={`/assets/img/introduce/icon_category_${index + 1}.png`}
                alt={item.name}
                width={150}
                height={150}
                className={servicesStyles?.categoryIcon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesAtIAgreeSection;
