/* eslint-disable import/no-unused-modules */
import React, { useEffect, useState } from "react";
import { Button, Card, Typography, Col, Space, Form, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { AddOrUpdateFeaturedProjectsModal } from "../modals/AddOrUpdateFeaturedProjectsModal";
import { ProjectMoreActions } from "./FeaturedProjectsOptionMore";
import { ButtonWithIcon } from "@/src/components/button";
import { ViewPartnerFeaturedProjectsModal } from "../modals/ViewPartnerFeaturedProjectsModal";
import { Modal } from "antd";
import { FeaturedProjectUploadItem, UploadedFile } from "@/src/data/typical-projects/models/typicalProjects.types";

const { Text } = Typography;

export interface PartnerFeaturedProjectsEditProps {
  projects?: FeaturedProjectUploadItem[];
  onProjectsChange?: (projects: FeaturedProjectUploadItem[]) => void;
}

export function PartnerFeaturedProjectsEdit({
  projects = [],
  onProjectsChange,
}: PartnerFeaturedProjectsEditProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] =
    useState<FeaturedProjectUploadItem | null>(null);
  const [form] = Form.useForm();
  const [hoveredId, setHoveredId] = useState<number | undefined>();
  const [listProject, setListProject] = useState<FeaturedProjectUploadItem[]>([]);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingProject, setViewingProject] =
    useState<FeaturedProjectUploadItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProjects = projects.slice(startIndex, endIndex);

  useEffect(() => {
    setListProject(currentProjects);
  }, [currentPage, projects]);

  // Get unique identifier - use id if exists, otherwise uid
  const getProjectId = (project: FeaturedProjectUploadItem) => {
    return project.id ?? project.uid;
  };

  // inside PartnerFeaturedProjectsEdit
  const handleDeleteProject = (projectId?: number) => {
    Modal.confirm({
      title: "Xác nhận xóa dự án",
      content: "Bạn có chắc chắn muốn xóa dự án này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        const updatedProjects = projects.filter((project) => getProjectId(project) !== projectId);
        onProjectsChange?.(updatedProjects);
        if (
          (currentPage - 1) * pageSize >= updatedProjects.length &&
          currentPage > 1
        ) {
          setCurrentPage(currentPage - 1);
        }
      },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewProject = (project: FeaturedProjectUploadItem) => {
    setViewingProject(project);
    setIsViewModalVisible(true);
  };

  const handleViewCancel = () => {
    setIsViewModalVisible(false);
    setViewingProject(null);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditProject = (project: FeaturedProjectUploadItem) => {
    // console.table(project.files);
    setEditingProject(project);
    form.setFieldsValue({
      name: project.name,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date,
      role: project.role,
      achievements: project.achievements,
      image: project.image,
      files: project.files,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = (values: any, uploadedFiles: UploadedFile[]) => {
    const newProject: FeaturedProjectUploadItem = {
      // For new projects, use Date.now() as uid. For existing projects, preserve the original id/uid
      ...(editingProject && {
        id: editingProject.id,
        uid: editingProject.uid,
      }),
      ...(!editingProject && {
        uid: Date.now(),
      }),
      name: values.name,
      description: values.description,
      start_date: values.start_date,
      end_date: values.end_date,
      role: values.role || "",
      achievements: values.achievements || "",
      image: values.image,
      status: 1,
      files: values.files || [],
      filesUploaded: uploadedFiles || [],
    };

    
    let updatedProjects: FeaturedProjectUploadItem[];
    if (editingProject) {
      // Update existing project by matching the correct identifier
      // updatedProjects = projects.map((project) =>
      //   project.uid === editingProject.uid ? newProject : project
      // );
      updatedProjects = projects.map((project) => {
        const currentId = getProjectId(project);
        const editingId = getProjectId(editingProject);
        return currentId === editingId ? newProject : project;
      });
    } else {
      // Add new project
      updatedProjects = [...listProject, newProject];
    }

    setListProject(updatedProjects);
    onProjectsChange?.(updatedProjects);
    
    setIsModalVisible(false);
    form.resetFields();
    setEditingProject(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProject(null);
  };

  return (
    <div className="partnerProjectsContainer">
      {projects.length === 0 ? (
        <div style={{ marginBottom: "24px" }}>
          <Col
            className="parnterProjectsEmptyContainer"
            style={{ textAlign: "center", padding: "0 0" }}
          >
            <Space direction="vertical" size={"middle"} align={"center"}>
              <div className={"iconWrapper"}>
                <IconSvgLocal
                  name={"IC_ADD_PROJECT"}
                  fill={"transparent"}
                  width={25}
                  height={28}
                />
              </div>
            </Space>
            <Text
              type="secondary"
              style={{ fontSize: "14px", display: "block" }}
            >
              Tạo dự án tiêu biểu của bạn
            </Text>
          </Col>
          <Button
            style={{ marginTop: "24px" }}
            icon={<PlusOutlined />}
            onClick={handleAddProject}
          >
            Thêm dự án
          </Button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 8,
              scrollbarWidth: "none",
            }}
          >
            {listProject.map((project) => {
              const projectId = getProjectId(project);
              return (
                <div
                  key={projectId}
                  style={{
                    flex: "0 0 280px",
                    position: "relative",
                    width: 280,
                  }}
                  onMouseEnter={() => setHoveredId(projectId)}
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
                      width: "100%",
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
                        <ProjectMoreActions
                          onEdit={() => handleEditProject(project)}
                          onDelete={() => handleDeleteProject(projectId)}
                        />
                        {/* Nút ButtonWithIcon xuất hiện khi hover */}
                        <ButtonWithIcon
                          icon={
                            <IconSvgLocal
                              name={"IC_ARROW_RIGHT"}
                              width={26}
                              height={9}
                            />
                          }
                          iconPosition={"end"}
                          style={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            border: "1.5px solid #09993E",
                            fontSize: 12,
                            fontWeight: 500,
                            opacity: hoveredId === projectId ? 1 : 0,
                            pointerEvents:
                              hoveredId === projectId ? "auto" : "none",
                            transition: "opacity 0.3s cubic-bezier(.4,0,.2,1)",
                            zIndex: 2,
                            borderRadius: 30,
                            height: 30,
                            boxShadow: "0 2px 8px rgba(9,153,62,0.08)",
                            padding: "2px 12px",
                          }}
                          onClick={() => handleViewProject(project)}
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
                    {project.description && (
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
                        {project.description}
                      </Typography.Paragraph>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: "24px",
              marginBottom: "24px",
              textAlign: "left",
            }}
          >
            <Button icon={<PlusOutlined />} onClick={handleAddProject}>
              Thêm dự án
            </Button>
          </div>

          {/* Thêm phần phân trang */}
          {projects.length > pageSize && (
            <div
              style={{
                display: "flex",
                marginTop: "24px",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={projects.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                hideOnSinglePage={true}
              />
            </div>
          )}
        </>
      )}

      <AddOrUpdateFeaturedProjectsModal
        visible={isModalVisible}
        editingProject={editingProject}
        form={form}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />

      <ViewPartnerFeaturedProjectsModal
        visible={isViewModalVisible}
        project={viewingProject}
        onCancel={handleViewCancel}
      />
    </div>
  );
}
