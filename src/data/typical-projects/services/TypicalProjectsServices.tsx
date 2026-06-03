import EndpointConfig from "@/src/constants/EndpointConfig";
import apiUtils from "@/src/utils/APIUtils";
import { DeleteFileParam, UploadFilesParam, UploadImageParam } from "../models/typicalProjects.raw";

export default class TypicalProjectsServices {
    onUploadImageOfTypicalProjects(dataParams: UploadImageParam): Promise<any> {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('typical_project_id', dataParams.typical_project_id.toString());
            formData.append('image', dataParams.image);

            apiUtils.post(EndpointConfig.UPLOAD_IMAGE_OF_TYPICAL_PROJECTS, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onUploadFilesOfTypicalProjects(dataParams: UploadFilesParam): Promise<any> {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('typical_project_id', dataParams.typical_project_id.toString());
            dataParams.files.forEach((file: File, index: number) => {
                formData.append(`files[${index}]`, file);
            });

            apiUtils.post(EndpointConfig.UPLOAD_FILES_OF_TYPICAL_PROJECTS, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        })
    }

    onDeleteImageOfTypicalProjects(projectId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('typical_project_id', projectId.toString());

            apiUtils.post(EndpointConfig.DELETE_FILES_OF_TYPICAL_PROJECTS, formData)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onDeleteFileOfTypicalProjects(dataParams: DeleteFileParam): Promise<any> {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('typical_project_id', dataParams.typical_project_id.toString());
            dataParams.file_ids?.forEach(id => {
                formData.append('file_ids[]', id.toString());
            });

            apiUtils.post(EndpointConfig.DELETE_FILES_OF_TYPICAL_PROJECTS, formData)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        });
    }

    onDeleteProjects(dataParams: DeleteFileParam): Promise<any> {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('typical_project_id', dataParams.typical_project_id.toString());
            formData.append('type', "TYPICAL_FEATURE_PROJECT");

            apiUtils.post(EndpointConfig.DELETE_FILES_OF_TYPICAL_PROJECTS, formData)
                .then((apiRes) => resolve(apiRes.data))
                .catch(reject);
        })
    }
}