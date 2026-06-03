export interface CategoryResource {
    categoryId: number;
    cateServiceId: number;
    id: string;
    name: string;
    photo?: string;
    parent_id?: number;
    childrens?: CateServiceResource[];
    serviceId: number;
}

export interface CateServiceResource {
    cateServiceId: number;
    name: string;
    photo?: string;
    parentId?: number;
    childrens?: ServiceResource[];
    parent_id?: number;
    id: string
    serviceId: number;
}

export interface ServiceResource {
    serviceId: number;
    name: string;
    photo?: string;
    parentId?: number;
}
