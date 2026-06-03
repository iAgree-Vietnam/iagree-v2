export interface ContractResource {
    contractId: number;
    userId: number;
    userName: string | null;
    name: string;
    fileUrl: string;
    lastModifiedDate: string;
    releaseDate: string | null;
    signType: number;
    status: number;
    createdDate: string;
    updatedDate: string;
    signUsers: SignUserResource[];
}

export interface SignUserResource {
    uniqueId?: number;
    signId: number;
    userContractId: number;
    email: string;
    signName: string | null;
    imageUrl: string;
    identify: string;
    credentialId: string | null;
    address: string | null;
    lastModifiedDate: string;
    status: number;
    top?: number;
    left?: number;
    pageNumber?: number;
    appMysignDescription: string;
}

export interface FullContractResource extends ContractResource {

}


export interface SignatureOutputResource {
    uniqueId: string | undefined;
    signId: number;
    pageNumber: number;
    x: number;
    y: number;
    imageUrl: string;
    width?: number;
    height?: number;
}

export interface ContractUpdateResource extends FullContractResource {
    signatures: SignatureOutputResource[];
}

export interface ContractUpdateSignResource extends FullContractResource {
    signatures: SignatureOutputResource[];
}
export interface ContractFilterParams {
    statusId: number | null;
    search: string | null;
    page: number,
}

export interface ContractCheckMySignIdParams {
    identify: string;
}

export interface ContractMySignInfo {
    address: string;
    credentialId: string;
    signName: string;
}