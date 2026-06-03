import React, { useEffect, useState } from 'react';
import { Input, Form, Button, Row, Col, Typography, Upload, Spin, Progress, message } from 'antd';
import { PlusOutlined, DeleteOutlined, CloseOutlined, FileOutlined } from '@ant-design/icons';
import AppDatePicker from '@/src/components/date/DatePicker';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import { CoverUploadImage } from '../uploads/CoverUploadImage';
import { TypicalProjectsResource, UploadedFile } from '@/src/data/typical-projects/models/typicalProjects.types';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { ConstantsHelper } from '@/src/constants/ConstantsHelper';
import { useUploadImageOfTypicalProjects } from '../hooks/useUploadImageOfTypicalProjects';
import { useUploadFilesOfTypicalProjects } from '../hooks/useUploadFilesOfTypicalProjects';
import { useDeleteFilesOfTypicalProjects } from '../hooks/useDeleteFilesOfTypicalProjects';
import { useDeleteTypicalProjects } from '../hooks/useDeleteTypicalProjects';
import dayjs from "dayjs";
import { Moment } from "moment";
import Constants from '@/src/constants/Constants';

const { Title, Text } = Typography;
const { TextArea } = Input;

export function PartnerFeaturedProjectsEditV2() {
  const form = Form.useFormInstance();
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [projectFiles, setProjectFiles] = useState<Record<number, UploadedFile[]>>({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const typicalProjects = form.getFieldValue('typicalProjects') || [];
    const allProjectFiles: Record<number, UploadedFile[]> = {};

    typicalProjects.forEach((project?: any, projectIndex?: number) => {
      const projectFilesArray: UploadedFile[] = [];
      
      if (project?.files && Array.isArray(project?.files)) {
        const apiFiles = project?.files
          .filter((file: any) => file.id)
          .map((file: any) => ({
            uid: `api-${file.id}`,
            name: file.fileName,
            url: file.filePath,
            type: ConstantsHelper.getFileTypeFromPath(file.filePath),
            fileType: file.type,
            size: 0,
            statusUpload: "done" as const,
            progress: 100,
            projectIndex,
            isApiFile: true,
            apiFileId: file.id,
          }));

        projectFilesArray.push(...apiFiles);

        const currentFormFiles = form.getFieldValue(['typicalProjects', projectIndex, 'files']) || [];
        const hasApiFiles = currentFormFiles.some((f: any) => f.id);

        if (!hasApiFiles && apiFiles.length > 0) {
          form.setFieldValue(['typicalProjects', projectIndex, 'files'], apiFiles.map((f: any) => ({ id: f.apiFileId, fileName: f.name, filePath: f.url })));
        }
      }
      
      allProjectFiles[projectIndex ?? 0] = projectFilesArray;
    });

    setProjectFiles(allProjectFiles);
  }, [form]);

  const uploadImage = useUploadImageOfTypicalProjects();
  const handleCoverImageChange = (url: string | undefined, file?: File, fieldName?: number) => {
    setCoverImage(url);
    const project = form.getFieldValue(['typicalProjects', fieldName]);
    const projectId = project?.id;

    form.setFieldValue(['typicalProjects', fieldName, 'image'], file);

    if (projectId && file) {
      uploadImage.mutateAsync({
        typical_project_id: projectId,
        image: file
      });
    }
  };

  const deleteFiles = useDeleteFilesOfTypicalProjects();
  const handleRemoveFile = (uid: string, fieldName: number) => {
    const project = form.getFieldValue(['typicalProjects', fieldName]);
    const projectId = project?.id;
    const fileToRemove = projectFiles[fieldName]?.find(f => f.uid === uid);
    
    if (fileToRemove?.isApiFile) {
      if (projectId && fileToRemove.apiFileId) {
        deleteFiles.mutateAsync({
          typical_project_id: projectId,
          file_ids: [fileToRemove.apiFileId]
        }, {
          onSuccess: () => {
            setProjectFiles(prev => ({
              ...prev,
              [fieldName]: prev[fieldName]?.filter(file => file.uid !== uid) || []
            }));

            const currentFiles = form.getFieldValue(['typicalProjects', fieldName, 'files']) || [];
            const updatedFiles = currentFiles.filter((file: any) => file.id !== fileToRemove.apiFileId);
            form.setFieldValue(['typicalProjects', fieldName, 'files'], updatedFiles);
          },
          onError: (error) => {
            // Error is handled by the hook
          }
        });
      } else {
        message.error("Không thể xóa tệp. Thông tin dự án hoặc tệp bị thiếu.");
      }
    } else {
      const currentFiles = form.getFieldValue(['typicalProjects', fieldName, 'files']) || [];
      const updatedFiles = currentFiles.filter((file: File) => (file as any).uid !== uid);

      setProjectFiles(prev => {
        const fileToRemove = prev[fieldName]?.find(f => f.uid === uid);
        if (fileToRemove?.url && !fileToRemove.isApiFile) {
          URL.revokeObjectURL(fileToRemove.url);
        }
        return {
          ...prev,
          [fieldName]: prev[fieldName]?.filter(file => file.uid !== uid) || []
        };
      });

      form.setFieldValue(['typicalProjects', fieldName, 'files'], updatedFiles);
      message.success("Đã xóa file thành công!");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderFileItem = (file: UploadedFile, index: number, fieldName: number) => {
    const isImage = file.type === 'image';
    return (
      <div
        key={file.uid}
        style={{
          position: "relative",
          marginBottom: "16px",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #d9d9d9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
          transition: "all 0.3s ease",
          backgroundColor: "#fff",
        }}
      >
        {file.statusUpload === "uploading" && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              borderRadius: "10px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Spin size="default" />
              <div
                style={{
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "#666",
                  fontWeight: "500",
                }}
              >
                Đang tải lên...
              </div>
              <Progress
                percent={file.progress}
                size="small"
                style={{ width: "200px", marginTop: "8px" }}
                strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
              />
            </div>
          </div>
        )}

        <div
          style={{
            height: "220px",
            position: "relative",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {isImage ? (
            <img
              src={file.url || "/placeholder.svg"}
              alt={file.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallbackDiv = e.currentTarget.parentElement?.querySelector('.fallback-content');
                if (fallbackDiv) (fallbackDiv as HTMLElement).style.display = 'flex';
              }}
            />
          ) : null}

          <div
            className="fallback-content"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: isImage ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#999",
              fontSize: "12px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <FileOutlined style={{ fontSize: "32px", marginBottom: "8px", color: "#1890ff" }} />
            <div style={{ textAlign: "center", fontWeight: "500" }}>
              {file.type === 'document' ? 'Tài liệu PDF' : 'Không thể tải hình ảnh'}
            </div>
            <div style={{ fontSize: "11px", color: "#bbb", marginTop: "4px" }}>
              {file.name}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.1), transparent, rgba(0,0,0,0.7))",
              opacity: 0,
              transition: "opacity 0.3s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "12px",
              zIndex: 5,
            }}
            className="image-overlay"
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0"; }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {file.isApiFile && (
                <div
                  style={{
                    backgroundColor: "rgba(24, 144, 255, 0.8)",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "500",
                  }}
                >
                  Tệp đã tải lên
                </div>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveFile(file.uid, fieldName)}
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white", border: "none", backdropFilter: "blur(4px)" }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </div>
              <div
                style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}
              >
                {file.size > 0 ? formatFileSize(file.size) : "Kích thước không xác định"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getFileType = (file: File): "image" | "document" => {
    const fileType = file.type || "";
    const fileName = file.name || "";

    if (fileType.startsWith("image/")) return "image";

    const extension = fileName.split(".").pop()?.toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

    if (imageExtensions.includes(extension || "")) return "image";

    return "document";
  };

  const uploadFiles = useUploadFilesOfTypicalProjects();
  const handleFileUpload = async (file: File, fieldName: number) => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fileType = getFileType(file);
    const project = form.getFieldValue(['typicalProjects', fieldName]);
    const projectId = project?.id;

    // Check if file size exceeds 5MB (5 * 1024 * 1024 bytes)
    const maxFileSize = Constants.MAX_FILE_SIZE;
    if (file.size > maxFileSize) {
      message.error(`Tệp ${file.name} vượt quá ${maxFileSize / 1024 / 1024}MB!`);
      return false;
    }

    const currentFiles = form.getFieldValue(['typicalProjects', fieldName, 'files']) || [];
    const currentProjectFiles = projectFiles[fieldName] || [];

    const maxFileCount = Constants.MAX_FILE_COUNT;
    if (currentProjectFiles.length >= maxFileCount) {
      message.error(`Bạn chỉ có thể tải lên tối đa ${maxFileCount} tệp!`);
      return false;
    }

    const isDuplicate = currentFiles.some((f: File) => f.name === file.name && f.size === file.size) || currentProjectFiles.some((f: UploadedFile) => f.name === file.name && f.size === file.size);

    if (isDuplicate) {
      message.warning(`File ${file.name} đã tồn tại!`);
      return false;
    }

    (file as any).uid = fileId;

    const newFileForUI: UploadedFile = {
      uid: fileId,
      name: file.name,
      url: "",
      type: fileType,
      fileType: file.type,
      size: file.size,
      statusUpload: "uploading",
      progress: 0,
      projectIndex: fieldName,
      isApiFile: false,
    };

    setProjectFiles(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), newFileForUI]
    }));
    setIsUploading(true);

    try {
      for (let progress = 0; progress <= 90; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setProjectFiles(prev => ({
          ...prev,
          [fieldName]: prev[fieldName]?.map(f => f.uid === fileId ? { ...f, progress } : f) || []
        }));
      }

      if (projectId && file) {
        const result = await uploadFiles.mutateAsync({
          typical_project_id: projectId,
          files: [file]
        });

        setProjectFiles(prev => ({
          ...prev,
          [fieldName]: prev[fieldName]?.filter(f => f.uid !== fileId) || []
        }));

        let apiFiles = [];
        if (result?.data?.files && Array.isArray(result.data.files)) {
          apiFiles = result.data.files;
        } else if (result?.files && Array.isArray(result.files)) {
          apiFiles = result.files;
        } else if (Array.isArray(result)) {
          apiFiles = result;
        }

        if (apiFiles.length > 0) {
          const newApiFiles: UploadedFile[] = apiFiles.map((apiFile: any) => ({
            uid: `api-${apiFile.id}`,
            name: apiFile.file_name || apiFile.fileName,
            url: apiFile.file_path || apiFile.filePath,
            type: ConstantsHelper.getFileTypeFromPath(apiFile.file_path || apiFile.filePath),
            fileType: apiFile.type,
            size: 0,
            statusUpload: "done" as const,
            progress: 100,
            projectIndex: fieldName,
            isApiFile: true,
            apiFileId: apiFile.id,
          }));

          const currentFormFiles = form.getFieldValue(['typicalProjects', fieldName, 'files']) || [];
          const updatedFormFiles = [...currentFormFiles, ...apiFiles.map((f: any) => ({ id: f.id, fileName: f.file_name || f.fileName, filePath: f.file_path || f.filePath }))];

          setProjectFiles(prev => ({
            ...prev,
            [fieldName]: [...(prev[fieldName] || []), ...newApiFiles]
          }));
          form.setFieldValue(['typicalProjects', fieldName, 'files'], updatedFormFiles);
        }
      } else {
        const fileUrl = URL.createObjectURL(file);

        setProjectFiles(prev => ({
          ...prev,
          [fieldName]: prev[fieldName]?.map(f => f.uid === fileId ? { ...f, url: fileUrl, statusUpload: "done", progress: 100 } : f) || []
        }));

        const currentFormFiles = form.getFieldValue(['typicalProjects', fieldName, 'files']) || [];
        const updatedFormFiles = [...currentFormFiles, file];
        form.setFieldValue(['typicalProjects', fieldName, 'files'], updatedFormFiles);
      }
    } catch (error) {
      setProjectFiles(prev => ({
        ...prev,
        [fieldName]: prev[fieldName]?.map(f => f.uid === fileId ? { ...f, statusUpload: "error", progress: 0 } : f) || []
      }));
      message.error(`Lỗi khi tải ${file.name}`);
    } finally {
      setIsUploading(false);
    }

    return false;
  };

  const getUploadedFilesForProject = (fieldName: number) => {
    return projectFiles[fieldName] || [];
  };

  const deleteProject = useDeleteTypicalProjects();
  const handleDeleteProject = (projectId?: number) => {
    if (projectId) {
      deleteProject.mutateAsync({
        typical_project_id: projectId
      });
    }
  }

  const typicalProjects = Form.useWatch('typicalProjects', form) || [];
  const handleDateChange = (
    index: number,
    field: "start_date" | "end_date",
    date: moment.Moment | null
  ) => {
    const typicalProjects = form.getFieldValue("typicalProjects");
    const updatedProjects = typicalProjects.map(
      (item: TypicalProjectsResource, i: number) =>
        i === index
          ? {
            ...item,
            [field]: date
              ? date.format(datetimeUtils.BACKEND_DATE_TIME_V2)
              : null,
          }
          : item
    );

    form.setFieldsValue({ typicalProjects: updatedProjects });
    form.validateFields([
      ["typicalProjects", index, "start_date"],
      ["typicalProjects", index, "end_date"],
    ]);
  };

  const maxLength = Constants.TEXT_MAX_LENGTH;

  return (
    <Form.List name={'typicalProjects'}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }, index) => {
            const projectUploadedFiles = getUploadedFilesForProject(name);
            const currentProject = form.getFieldValue(['typicalProjects', name]);
            const projectId = currentProject?.id;

            return (
              <div key={key} className={'experienceFormItem'}>
                <Title
                  level={5}
                  style={{ margin: "0 0 16px 0", color: "#09993E" }}
                >
                  Dự án ({index + 1})
                </Title>
                <Button 
                  className={'deleteBtn'} 
                  type={'text'} 
                  icon={<CloseOutlined />} 
                  onClick={() => {
                    handleDeleteProject(projectId);
                    setProjectFiles(prev => {
                      const newState = { ...prev };
                      delete newState[name];
                      return newState;
                    });
                    remove(name);
                  }} 
                />
                <Row gutter={20}>
                  <Col xs={24} lg={10}>
                    <Form.Item
                      {...restField}
                      label="ID"
                      name={[name, 'id']}
                      style={{ display: "none" }}
                    >
                      <Input
                        placeholder="ID dự án"
                        size="large"
                        style={{ borderRadius: "10px" }}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Tên dự án"
                      name={[name, 'name']}
                      rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
                    >
                      <Input
                        placeholder="Nhập tên dự án"
                        size="large"
                        style={{ borderRadius: "10px" }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Vai trò trong dự án"
                      name={[name, 'role']}
                      rules={[{ required: true, message: "Vui lòng nhập vai trò trong dự án" }]}
                    >
                      <Input
                        placeholder="Nhập vai trò trong dự án"
                        size="large"
                        style={{ borderRadius: "10px" }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'start_date']}
                      label={'Thời gian bắt đầu'}
                      dependencies={[["typicalProjects", name, "end_date"]]}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập thời gian bắt đầu',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) {
                              return Promise.resolve();
                            }
                            const startDate = dayjs(value);
                            const endDateValue = getFieldValue([
                              "typicalProjects",
                              name,
                              "end_date",
                            ]);
                            if (endDateValue) {
                              const endDate = dayjs(endDateValue);
                              if (
                                startDate.isAfter(endDate) ||
                                startDate.isSame(endDate)
                              ) {
                                return Promise.reject(
                                  new Error(
                                    "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc"
                                  )
                                );
                              }
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      getValueProps={(value) => ({
                        value: 
                          value && 
                          datetimeUtils.getMoment(
                            value, 
                            datetimeUtils.BACKEND_DATE_TIME_V2
                          ),
                      })}
                      normalize={(value) => 
                        (value && 
                          value.format(datetimeUtils.BACKEND_DATE_TIME_V2)) || 
                        ''
                      }
                    >
                      <AppDatePicker
                        className={"full-width"}
                        format={"MM/YYYY"}
                        picker="month"
                        placeholder={"mm/yyyy"}
                        onChange={(date: Moment | null) =>
                          handleDateChange(name, "start_date", date)
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'end_date']}
                      label={'Thời gian kết thúc (tuỳ chọn)'}
                      dependencies={[["typicalProjects", name, "start_date"]]}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value) {
                              return Promise.resolve();
                            }
                            const endDate = dayjs(value);
                            const startDateValue = getFieldValue([
                              "typicalProjects",
                              name,
                              "start_date",
                            ]);
                            if (startDateValue) {
                              const startDate = dayjs(startDateValue);
                              if (
                                endDate.isBefore(startDate) ||
                                endDate.isSame(startDate)
                              ) {
                                return Promise.reject(
                                  new Error(
                                    "Thời gian kết thúc phải lớn hơn thời gian bắt đầu"
                                  )
                                );
                              }
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      getValueProps={(value) => ({
                        value: 
                          value && 
                          datetimeUtils.getMoment(
                            value, 
                            datetimeUtils.BACKEND_DATE_TIME_V2
                          ),
                      })}
                      normalize={(value) => 
                        (value && 
                          value.format(datetimeUtils.BACKEND_DATE_TIME_V2)) || 
                        ''
                      }
                    >
                      <AppDatePicker
                        className={"full-width"}
                        format={"MM/YYYY"}
                        picker="month"
                        placeholder={"mm/yyyy"}
                        onChange={(date: Moment | null) =>
                          handleDateChange(name, "end_date", date)
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label={'Mô tả'}
                      name={[name, 'description']}
                      rules={[
                        { 
                          required: true, message: "Vui lòng nhập mô tả dự án" 
                        },
                        {
                          max: maxLength,
                          message: `Mô tả không được vượt quá ${maxLength} ký tự.`,
                        },
                      ]}
                    >
                      <TextArea
                        rows={5}
                        placeholder="Nhập mô tả dự án..."
                        style={{
                          borderRadius: "10px",
                          resize: "none",
                        }}
                      />
                    </Form.Item>

                    <div style={{ textAlign: "right", marginTop: "-12px" }}>
                      <Text
                        type="secondary"
                        style={{
                          color: typicalProjects[index]?.description?.length > maxLength ? "red" : undefined,
                        }}
                      >
                        ({`${typicalProjects[index]?.description?.length || 0} / ${maxLength}`})
                      </Text>
                    </div>

                    <Form.Item
                      {...restField}
                      label={'Thành tựu nổi bật (tuỳ chọn)'}
                      name={[name, 'achievements']}
                      rules={[
                        {
                          max: maxLength,
                          message: `Thành tựu không được vượt quá ${maxLength} ký tự.`,
                        },
                      ]}
                    >
                      <Input.TextArea
                        rows={5}
                        placeholder="Nhập thành tựu nổi bật..."
                        style={{ borderRadius: "10px", resize: "none" }}
                      />
                    </Form.Item>

                    <div style={{ textAlign: "right", marginTop: "-12px" }}>
                      <Text
                        type="secondary"
                        style={{
                          color: typicalProjects[index]?.achievements?.length > maxLength ? "red" : undefined,
                        }}
                      >
                        ({`${typicalProjects[index]?.achievements?.length || 0} / ${maxLength}`})
                      </Text>
                    </div>
                  </Col>

                  <Col xs={24} lg={14}>
                    <Form.Item
                      {...restField}
                      label="Hình bìa"
                      name={[name, 'image']}
                      rules={[{ required: true, message: "Vui lòng tải lên ảnh bìa của dự án" }]}
                    >
                      <CoverUploadImage
                        value={coverImage}
                        onChange={(url, file) => handleCoverImageChange(url, file, name)}
                        projectId={projectId}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      label="Tài liệu hoặc hình ảnh liên quan của dự án"
                      name={[name, 'files']}
                    >
                      <>
                        <div
                          style={{ padding: "12px 0", paddingTop: "0" }}
                        >
                          <Typography.Title level={5} style={{ margin: 0 }}>
                            Tổng số tệp: {projectUploadedFiles.length}
                          </Typography.Title>
                        </div>

                        <div
                          style={{
                            height: "600px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "10px",
                            padding: "0 12px 0 12px",
                          }}
                        >
                          <div
                            style={{ maxHeight: "600px", overflowY: "auto", paddingRight: "8px" }}
                          >
                            <div style={{ height: "12px", width: "100%" }} />
                            {projectUploadedFiles.map((file: UploadedFile, index: number) =>
                              renderFileItem(file, index, name)
                            )}

                            <Upload
                              multiple
                              accept="image/*,.pdf"
                              beforeUpload={(file) => handleFileUpload(file, name)}
                              showUploadList={false}
                              style={{ width: "100%", display: "block" }}
                              maxCount={5}
                              disabled={isUploading || projectUploadedFiles.length >= 5}
                            >
                              <div
                                className="upload-area"
                                style={{
                                  borderRadius: "10px",
                                  padding: "24px 24px",
                                  border: "2px dashed #d9d9d9",
                                  minHeight: "80px",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: isUploading ? "not-allowed" : "pointer",
                                  transition: "all 0.3s ease",
                                  opacity: isUploading ? 0.6 : 1,
                                }}
                                onMouseEnter={(e) => { if (!isUploading) e.currentTarget.style.borderColor = "#09993E"; }}
                                onMouseLeave={(e) => { if (!isUploading) e.currentTarget.style.borderColor = "#d9d9d9"; }}
                              >
                                <div
                                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                                >
                                  <div
                                    style={{ width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.3s ease" }}
                                  >
                                    <IconSvgLocal
                                      name={"IC_ADD_IMAGE_OR_FILE"}
                                      width={22}
                                      height={22}
                                      fill="transparent"
                                    />
                                  </div>
                                  <div
                                    style={{ fontSize: "14px", color: "#999", marginBottom: "3px" }}
                                  >
                                    {isUploading ? "Đang xử lý..." : "Thêm hình ảnh, tài liệu"}
                                  </div>
                                  <div
                                    style={{ fontSize: "12px", color: "#d9d9d9", textAlign: "center", lineHeight: "1.5" }}
                                  >
                                    (Hỗ trợ: Hình ảnh, PDF)
                                    <br />
                                    Kích thước tệp tối đa: 5MB
                                  </div>
                                </div>
                              </div>
                            </Upload>
                            <div style={{ height: "12px", width: "100%" }} />
                          </div>
                        </div>
                      </>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )
          })}
          <Form.Item>
            <Button 
              type="dashed"
              onClick={() => add()} 
              block
              icon={<PlusOutlined />}
            >
              Thêm dự án
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}