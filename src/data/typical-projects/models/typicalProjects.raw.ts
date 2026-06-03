export interface RawTypicalProjectsResource {
    id: number;
    partner_id: number;
    name: string;
    image: string;
    start_date: string;
    end_date: string;
    description: string;
    achievements: string;
    role: string;
    status: number;
    created_at: string;
    updated_at: string;
    files?: RawFileResource[];
}

export interface RawFileResource {
    id: number;
    ref_id: string;
    type: string;
    file_name: string;
    file_path: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface UploadImageParam {
    typical_project_id: number;
    image: File;
}

export interface UploadFilesParam {
    typical_project_id: number;
    files: File[];
}

export interface DeleteFileParam {
    typical_project_id: number;
    file_ids?: number[];
}

export interface DeleteTypicalProjectParam {
    typical_project_id: number;
    type?: string;
}
