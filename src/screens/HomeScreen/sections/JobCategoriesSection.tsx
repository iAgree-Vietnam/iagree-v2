import React, { useMemo } from "react";
import { List, Row } from "antd";
import JobCategoryItem from "@/src/components/jobs/JobCategoryItem";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import _ from "lodash";
import Slider from "@ant-design/react-slick";
import { CategoryResource } from "@/src/data/category/models/category.types";

type Props = {
  jobCategories?: CategoryResource[];
  handleCategoryClick: (categoryName: string) => void;
};

const JobCategoriesSection: React.FC<Props> = ({
  jobCategories,
  handleCategoryClick,
}) => {
  const { isDesktop, isMobile } = useBreakpoint();

  // Desktop/Tablet: chia slide theo grid
  const jobCategorySlideItems = useMemo(() => {
    return _.chunk(jobCategories, isDesktop ? 12 : isMobile ? 3 : 6);
  }, [jobCategories, isDesktop, isMobile]);

  const jobCategorySlickSettings = {
    arrows: false,
    dots: jobCategorySlideItems.length > 1,
    infinite: true,
    speed: 500000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Mobile: chuẩn bị dữ liệu cho marquee (nhân đôi để lặp vô hạn)
  const marqueeData = useMemo(() => {
    const base = jobCategories ?? [];
    return [...base, ...base]; // duplicate để loop mượt
  }, [jobCategories]);

  if (isMobile) {
    // Marquee mobile
    return (
      <section className="sectionContainer jobCategory">
        <div className="contentWrapper">
          <Row className="sectionContentContainer" justify="center">
            <div className="marqueeWrap">
              <div className="marqueeTrack">
                {marqueeData?.map((item, idx) => (
                  <div
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   minWidth:"140px",
                    //   alignItems:"center"
                    // }}
                    className="marqueeItem"
                    key={`${item.categoryId}-${idx}`}
                  >
                    <JobCategoryItem
                      data={item}
                      onChange={handleCategoryClick}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Row>
        </div>
      </section>
    );
  }

  // Desktop/Tablet: như cũ (slider + grid)
  return (
    <section className="sectionContainer jobCategory">
      <div className="contentWrapper">
        <Row className="sectionContentContainer" justify="center">
          {/* <Slider className="categorySlider" {...jobCategorySlickSettings}> */}
          {jobCategorySlideItems.map((categoryPages, categoryPageIndex) => (
            <div key={categoryPageIndex}>
              <List
                key={categoryPageIndex}
                grid={{
                  gutter: [20, 16],
                  xs: 3,
                  sm: 3,
                  md: 6,
                  lg: 6,
                  xl: 6,
                  xxl: 6,
                }}
                dataSource={categoryPages}
                className="jobCategoryListContainer"
                renderItem={(item) => (
                  <List.Item
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                    key={item.categoryId}
                  >
                    <JobCategoryItem
                      data={item}
                      onChange={handleCategoryClick}
                    />
                  </List.Item>
                )}
              />
            </div>
          ))}
          {/* </Slider> */}
        </Row>
      </div>
    </section>
  );
};

export default JobCategoriesSection;
