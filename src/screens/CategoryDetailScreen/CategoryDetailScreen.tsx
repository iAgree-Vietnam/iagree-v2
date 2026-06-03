import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Breadcrumb, Typography, Button, Row, Col, Space, Card } from "antd";

import RootLayoutWithFilterCategory from "@/src/layouts/RootLayoutWithFilterCategory";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { JobSelectboxResource } from "@/src/data/job/models/job.types";
import ServiceCategoryImage from "./components/ServiceCategoryImage";
import HorizontalServiceCategoriesList from "./components/HorizontalServiceCategoriesList";
import { CategoryResource } from "@/src/data/category/models/category.types";
import SearchRouteUtils from "@/src/data/search/utils/SearchRouteUtils";
import SearchAutoComplete from "@/src/components/search/SearchAutoComplete";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import useSetRouterPath from "@/src/hooks/useSetRouterPath";

const { Text } = Typography;

interface CategoryDetailScreenProps {
  selectboxResource: JobSelectboxResource;
  categoryId: number;
}

function CategoryDetailScreen({
  selectboxResource,
  categoryId,
}: CategoryDetailScreenProps) {
  const router = useRouter();
  const [selectedCategoryData, setSelectedCategoryData] =
    useState<CategoryResource | null>(null);

    useSetRouterPath();

  useEffect(() => {
    if (selectboxResource && categoryId) {
      const foundCategory = selectboxResource?.categories?.find(
        (cat) => cat?.categoryId === categoryId
      );
      setSelectedCategoryData(foundCategory || null);
    } else {
      setSelectedCategoryData(null);
    }
  }, [selectboxResource, categoryId]);

  const handleServiceCategoriesClick = (
    categoryName: string,
    serviceCategoryName: string,
    serviceId: number
  ) => {
    router.push(
      AuthRouteUtils.toService(categoryName, serviceCategoryName, [serviceId])
    );
  };

  if (!selectedCategoryData) {
    return (
      <RootLayoutWithFilterCategory>
        <div style={{ padding: "50px", textAlign: "center" }}>
          <Text type="secondary">
            Không tìm thấy thông tin lĩnh vực hoặc dữ liệu chưa sẵn sàng.
          </Text>
        </div>
      </RootLayoutWithFilterCategory>
    );
  }

  return (
    <RootLayoutWithFilterCategory>
      <Head>
        <title>{selectedCategoryData.name || "Chi tiết Lĩnh vực"}</title>
      </Head>

      <section className={"pageHeaderWrapper"}>
        <div className="contentWrapper">
          <div className={"pageHeaderContainer serviceHeaderContainer"}>
            <h1 className={"pageHeaderTitle nm-typo"}>
              {selectedCategoryData.name || "Chi tiết Lĩnh vực"}
              <Row className={"searchContainer"} justify={"center"}>
                <SearchAutoComplete width="50%" />
              </Row>
            </h1>
          </div>
        </div>
      </section>

      <section className={"breadcrumbContainer"}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              {
                title: selectedCategoryData.name,
              },
            ]}
          />
        </div>
      </section>

      {/* New Section for displaying Service Categories in a horizontal list */}
      {selectedCategoryData.childrens && (
        <section className={"sectionContainer"}>
          <div className="contentWrapper">
            <Typography.Title
              className={"sectionTitle"}
              level={3}
              style={{ marginBottom: "16px" }}
            >
              Danh mục Dịch vụ trong lĩnh vực {selectedCategoryData.name}
            </Typography.Title>
            <HorizontalServiceCategoriesList
              serviceCategories={selectedCategoryData.childrens}
              categoryName={selectedCategoryData.name}
            />
          </div>
        </section>
      )}

      {/* Existing Section for displaying Service Categories and Services */}
      {selectedCategoryData.childrens && (
        <section className={"sectionContainer"}>
          <div className="contentWrapper">
            <Typography.Title className={"sectionTitle"} level={3}>
              Các Dịch vụ trong lĩnh vực {selectedCategoryData.name}
            </Typography.Title>
            <div className="sectionContentContainer">
              {selectedCategoryData.childrens.length === 0 ? (
                <Text type="secondary">
                  Hiện chưa có danh mục dịch vụ nào trong lĩnh vực này.
                </Text>
              ) : (
                <Row gutter={[24, 24]} justify={"start"}>
                  {selectedCategoryData.childrens.map(
                    (serviceCategory: any) => (
                      <Col
                        key={serviceCategory.cateServiceId}
                        xs={24}
                        sm={12}
                        md={8}
                        lg={8}
                      >
                        <Card
                          cover={
                            <ServiceCategoryImage
                              src={serviceCategory.photo}
                              alt={serviceCategory.name}
                              style={{
                                borderRadius: "8px",
                              }}
                            />
                          }
                          style={{
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "none",
                          }}
                        >
                          <Card.Meta
                            title={
                              <Typography.Title
                                level={4}
                                style={{
                                  marginBottom: "8px",
                                  fontWeight: "bold",
                                  color: "#09993E",
                                }}
                              >
                                {serviceCategory.name}
                              </Typography.Title>
                            }
                            description={
                              <Space
                                direction="vertical"
                                style={{ width: "100%" }}
                              >
                                {serviceCategory.childrens &&
                                serviceCategory.childrens.length > 0 ? (
                                  serviceCategory.childrens.map(
                                    (service: any) => (
                                      <Button
                                        key={service.serviceId}
                                        type="link"
                                        onClick={() =>
                                          handleServiceCategoriesClick(
                                            selectedCategoryData.name,
                                            serviceCategory.name,
                                            service.serviceId
                                          )
                                        }
                                        style={{
                                          padding: 0,
                                          textAlign: "left",
                                          height: "auto",
                                          fontWeight: "500",
                                          color: "#000",
                                        }}
                                      >
                                        {service.name}
                                      </Button>
                                    )
                                  )
                                ) : (
                                  <Text type="secondary">
                                    Chưa có dịch vụ nào trong danh mục này.
                                  </Text>
                                )}
                              </Space>
                            }
                          />
                        </Card>
                      </Col>
                    )
                  )}
                </Row>
              )}
            </div>
          </div>
        </section>
      )}
    </RootLayoutWithFilterCategory>
  );
}

export default CategoryDetailScreen;
