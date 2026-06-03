export interface RawCategoryResource {
    id: string;
    name: string;
    photo?: string;
    childrens?: RawCateServiceResource[];
    categoryId: number;
    cateServiceId: number;
    
    serviceId: number;
}

export interface RawCateServiceResource {
    id: string;
    name: string;
    parent_id?: number;
    photo?: string;
    childrens?: RawServiceResource[];
    categoryId: number;
    cateServiceId: number;
    serviceId: number;
}

export interface RawServiceResource {
    id: string;
    name: string;
    parent_id?: number;
    photo?: string;
    categoryId: number;
    cateServiceId: number;
    
    serviceId: number;
}
