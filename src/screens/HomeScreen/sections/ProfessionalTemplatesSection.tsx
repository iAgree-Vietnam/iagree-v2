"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Row, Typography, List, Menu, Col } from "antd";
import TemplateItem from "@/src/components/template/TemplateItem";
import TemplateRouteUtils from "@/src/data/template/utils/TemplateRouteUtils";
import Link from "next/link";
import { ButtonWithIcon } from "@/src/components/button";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { TemplateResource } from "@/src/data/template/models/template.types";
import useIsMobile from "../hooks/useIsMobile";
import { ButtonWithDottedLoadingIcon } from "@/src/components/button/ButtonWithDottedLoadingIcon";

type Props = {
  templateSlideItems: TemplateResource[];
  homeInitResource?: any;
  onTemplatePreview: (templateResource: any) => void;
  router: any;
};

const ProfessionalTemplatesSection: React.FC<Props> = ({
  templateSlideItems,
  homeInitResource,
  onTemplatePreview,
  router,
}) => {
  const isTablet = useIsMobile(991);
  const isMobile = useIsMobile(660);

  // 🔹 Gộp tất cả templates thành 1 danh sách phẳng

  const allTemplates = templateSlideItems?.flatMap(
    (templateSlideItems) => templateSlideItems
  );

  // 🔹 Load more / collapse cho mobile, tablet
  const [visibleCount, setVisibleCount] = useState(6);
  const limitedTemplates = useMemo(
    () => allTemplates.slice(0, visibleCount),
    [allTemplates, visibleCount]
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 6, allTemplates.length));
  };

  const handleCollapse = () => {
    setVisibleCount(6);
  };

  const renderLoadMoreOrCollapse = () => {
    if (visibleCount < allTemplates.length) {
      return (
        <Row justify="center" style={{ marginTop: 20 }}>
          <ButtonWithDottedLoadingIcon
            iconPosition={"end"}
            onClick={handleLoadMore}
          >
            Tải thêm
          </ButtonWithDottedLoadingIcon>
        </Row>
      );
    } else if (allTemplates.length > 6) {
      return (
        <Row justify="center" style={{ marginTop: 20 }}>
          <ButtonWithDottedLoadingIcon onClick={handleCollapse}>
            Thu gọn
          </ButtonWithDottedLoadingIcon>
        </Row>
      );
    }
    return null;
  };

  // 🔸 Chia template thành 2 nhóm (2 hàng)
  const topRowTemplates = useMemo(() => {
    const mid = Math.ceil(allTemplates.length / 2);
    return allTemplates.slice(0, mid);
  }, [allTemplates]);

  const bottomRowTemplates = useMemo(() => {
    const mid = Math.ceil(allTemplates.length / 2);
    return allTemplates.slice(mid);
  }, [allTemplates]);

  // 🔹 Nhân đôi cho hiệu ứng infinite scroll
  const infiniteTopTemplates = useMemo(
    () => [...topRowTemplates, ...topRowTemplates],
    [topRowTemplates]
  );
  const infiniteBottomTemplates = useMemo(
    () => [...bottomRowTemplates, ...bottomRowTemplates],
    [bottomRowTemplates]
  );

  const SCROLL_SPEED_PX_PER_SEC = 80;
  const [animationDuration, setAnimationDuration] = useState("40s");

  useEffect(() => {
    const track = document.querySelector(".templates-track-v3-row1");
    if (track) {
      const width = track.scrollWidth;
      const durationSec = width / SCROLL_SPEED_PX_PER_SEC;
      setAnimationDuration(`${durationSec}s`);
    }
  }, [allTemplates]);

  const renderContent = () => {
    // TABLET
    if (isTablet && !isMobile) {
      return (
        <>
          <List
            grid={{
              gutter: [20, 4],
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 3,
              xxl: 4,
            }}
            dataSource={limitedTemplates}
            renderItem={(item: TemplateResource) => (
              <List.Item>
                <TemplateItem data={item} onPreview={onTemplatePreview} />
              </List.Item>
            )}
          />
          {renderLoadMoreOrCollapse()}
        </>
      );
    }

    // MOBILE
    if (isMobile) {
      return (
        <>
          <List
            grid={{ gutter: 24, xs: 1, sm: 2, md: 2 }}
            dataSource={limitedTemplates}
            renderItem={(item: TemplateResource) => (
              <List.Item>
                <TemplateItem data={item} onPreview={onTemplatePreview} />
              </List.Item>
            )}
          />
          {renderLoadMoreOrCollapse()}
        </>
      );
    }

    // DESKTOP: animation scroll 2 hàng
    return (
      <div className="templatesRowWrapper">
        {/* Hàng 1 */}
        <div className="templates-faded-container-v3">
          <div
            className="templates-track-v3-row1"
            style={{ animationDuration }}
          >
            {infiniteTopTemplates?.map((item, index) => (
              <div key={index} className="templates-item-wrapper-v3">
                <TemplateItem data={item} onPreview={onTemplatePreview} />
              </div>
            ))}
          </div>
        </div>

        {/* Hàng 2 */}
        <div className="templates-faded-container-v3" style={{ marginTop: 20 }}>
          <div
            className="templates-track-v3-row2"
            style={{ animationDuration }}
          >
            {infiniteBottomTemplates?.map((item, index) => (
              <div key={index} className="templates-item-wrapper-v3">
                <TemplateItem data={item} onPreview={onTemplatePreview} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <section className="sectionContainer templateWrapper">
      <div className="contentWrapper">
        <Row
          className="sectionTitleContainer"
          gutter={[6, 6]}
          justify="space-between"
          align="middle"
        >
          <Col span={24}>
            <Typography.Title
              ellipsis={{ rows: 2 }}
              className="sectionTitle templateSectionTitle"
              level={2}
            >
              Biểu mẫu chuyên nghiệp
            </Typography.Title>
          </Col>
          <Col>
            <Typography.Paragraph className="templateSectionDescription">
              Tuỳ biến dễ dàng - Ứng dụng nhanh chóng
            </Typography.Paragraph>
          </Col>
          <Col>
            <ButtonWithIcon
              icon={
                <IconSvgLocal name="IC_ARROW_RIGHT" width={26} height={9} />
              }
              iconPosition="end"
              onClick={() => router.push(TemplateRouteUtils.toScreen({}))}
              className="hidden-mb"
            >
              Xem tất cả
            </ButtonWithIcon>
          </Col>
        </Row>

        <Row className="filterContainer" gutter={[16, 16]} align="middle">
          <Col span={24}>
            <Menu
              selectedKeys={["ALL"]}
              mode="horizontal"
              className="filterMenuContainer homeFilterMenu"
              items={[
                { key: "ALL", label: "Mới nhất" },
                ...(homeInitResource?.templateCategories?.items || [])?.map(
                  (categoryResource: any) => ({
                    key: categoryResource?.categoryId,
                    label: (
                      <Link
                        key={categoryResource.categoryId}
                        href={TemplateRouteUtils.toListScreen({
                          categoryIds: [categoryResource.categoryId],
                        })}
                      >
                        {categoryResource.name}
                      </Link>
                    ),
                  })
                ),
              ]}
            />
          </Col>
        </Row>

        {renderContent()}
      </div>
    </section>
  );
};

export default ProfessionalTemplatesSection;
