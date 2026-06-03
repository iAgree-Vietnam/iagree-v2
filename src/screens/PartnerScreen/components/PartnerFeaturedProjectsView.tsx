import React, { useState } from "react";
import { Typography, Row, Col, Card, Pagination } from "antd";
import ViewFeaturedProjectsModal from "../modals/ViewFeaturedProjectsModal";
import { ButtonWithIcon } from "@/src/components/button/ButtonWithIcon";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { TypicalProjectsResource } from "@/src/data/typical-projects/models/typicalProjects.types";
import { size, slice } from "lodash";

interface PartnerFeaturedProjectsViewSectionProps {
  projects?: TypicalProjectsResource[];
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number, pageSize: number) => void;
}

export const PartnerFeaturedProjectsViewSection: React.FC<PartnerFeaturedProjectsViewSectionProps> = ({
  projects,
  currentPage = 1,
  pageSize = 3,
  onPageChange,
}) => {
  const [hoveredId, setHoveredId] = useState<number | undefined>(undefined);
  const [modalProject, setModalProject] = useState<TypicalProjectsResource | null>(null);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProjects = slice(projects,startIndex, endIndex);

  const handlePageChange = (page: number, size: number) => {
    if (onPageChange) {
      onPageChange(page, size);
    }
  };

  return (
    <div>
      <Typography.Title className={"infoTitle"} level={4}>
        Dự án/sản phẩm tiêu biểu
      </Typography.Title>

      <Row gutter={[24, 24]}>
        {currentProjects.map((project) => (
          <Col xs={24} sm={12} lg={8} key={project.id}>
            <div
              style={{ position: "relative", width: "256px", margin: "0 auto" }}
              onMouseEnter={() => setHoveredId(project.id ?? undefined)}
              onMouseLeave={() => setHoveredId(undefined)}
            >
              <Card
                hoverable
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251, 246, 245, 1) 0%, rgba(241, 246, 255, 1) 100%)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #f0f0f0",
                  width: "256px",
                  padding: "10px",
                  height: "230px",
                }}
                cover={
                  <div
                    style={{
                      height: "140px",
                      overflow: "hidden",
                      borderRadius: "8px",
                      position: "relative",
                    }}
                  >
                    <img
                      alt={project.name}
                      src={project.image}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {/* Nút ButtonWithIcon xuất hiện khi hover */}
                    <ButtonWithIcon
                      icon={
                        <IconSvgLocal name={'IC_ARROW_RIGHT'} width={26} height={9} />
                      }
                      iconPosition={'end'}
                      style={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        border: "1.5px solid #09993E",
                        fontSize: 12,
                        fontWeight: 500,
                        opacity: hoveredId === project.id ? 1 : 0,
                        pointerEvents: hoveredId === project.id ? "auto" : "none",
                        transition: "opacity 0.3s cubic-bezier(.4,0,.2,1)",
                        zIndex: 2,
                        borderRadius: 30,
                        height: 30,
                        boxShadow: "0 2px 8px rgba(9,153,62,0.08)",
                        padding: "2px 12px",
                      }}
                      onClick={() => {
                        setModalProject(project);
                      }}
                    >
                      Xem dự án
                    </ButtonWithIcon>
                  </div>
                }
                bodyStyle={{
                  padding: "12px",
                  height: "90px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography.Title
                  level={5}
                  style={{
                    marginBottom: "4px",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#333",
                    lineHeight: "1.2",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  ellipsis={{ rows: 1 }}
                  title={project.name}
                >
                  {project.name}
                </Typography.Title>
                {project.role && (
                  <Typography.Paragraph
                    style={{
                      margin: 0,
                      color: "#999",
                      fontSize: "12px",
                      lineHeight: "1.4",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    ellipsis={{ rows: 1 }}
                  >
                    {project.role}
                  </Typography.Paragraph>
                )}
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      {size(projects) > pageSize && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
          <Pagination
            size="default"
            current={currentPage}
            pageSize={pageSize}
            total={size(projects)}
            showSizeChanger={false}
            hideOnSinglePage={true}
            onChange={(page) => handlePageChange(page, pageSize)}
          />
        </div>
      )}

      {/* Modal hiển thị chi tiết dự án */}
      <ViewFeaturedProjectsModal
        open={!!modalProject}
        project={modalProject}
        onClose={() => setModalProject(null)}
      />
    </div>
  );
};
