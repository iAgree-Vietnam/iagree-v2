export interface RawBannersResource {
    items: RawBannerItem[];
    total: number;
}

export interface RawBannerItem {
    id: number;
    type: string;
    name: string;
    description: string;
    photo: string;
    status: number;
    created_at: string;
    updated_at: string;
}
