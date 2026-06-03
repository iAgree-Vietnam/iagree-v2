import { RcFile } from "antd/es/upload";

export interface TypicalProjectsResource {
    id?: number | null;
    partnerId?: number | undefined;
    name: string;
    image: string;
    start_date: string;
    end_date: string;
    description: string;
    achievements: string;
    role: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
    files?: FileResource[];
}

export interface FeaturedProjectUploadItem extends TypicalProjectsResource {
    uid?: number | undefined;
    filesUploaded?: UploadedFile[] | undefined;
}

export interface FileResource {
    id: number;
    refId: string;
    type: string;
    fileName: string;
    filePath: string;
    status: number;
    createAt: string;
    updatedAt: string;
}

export interface UploadedFile {
  uid: string;
  name: string;
  url: string;
  type: "image" | "video" | "document";
  fileType: string;
  size: number;
  statusUpload: "uploading" | "done" | "error";
  progress: number;
  projectIndex?: number; // Track which project this file belongs to
  isApiFile?: boolean; // Flag to identify files from API vs newly uploaded
  apiFileId?: number; // Store original API file ID for deletion
}