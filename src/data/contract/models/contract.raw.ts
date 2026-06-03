import { RcFile } from 'antd/es/upload/interface';

export interface ContractRawResource {
    id: number;
    user_id: number;
    user_name: string | null;
    name: string;
    file: string;
    last_modified: string;
    release_date: string | null;
    sign_type: number;
    status: number;
    created_at: string;
    updated_at: string;
    sign_users: RawSignUserResource[];
}

export interface RawSignUserResource {
    id: number;
    user_contract_id: number;
    email: string;
    sign_name: string | null;
    identify: string;
    credential_id: string | null;
    address: string | null;
    last_modified: string;
    status: number;
    image: string;
    top?: number;
    left?: number;
    page_number?: number;
    app_mysign_description: string;
}

export interface FullContractRawResource extends ContractRawResource {

}

export interface ContractSaveParams {
    name: string,
    attachments: RcFile[],
}
export interface ContractUpdatePDFParams {
    pdfFile: File,
    contractId: number,
}
