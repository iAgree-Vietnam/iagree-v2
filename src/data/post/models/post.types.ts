export interface PostResource {
    postId: number;
    title: string;
    shortDescription: string;
    description: string;
    photo: string;
    isMedia: boolean;
    publishDate: string;
    status: number;
    createdDate: string;
    updatedDate: string;
}

export interface PostDetailsResource {
    post: PostResource;
    top: PostResource[];
}

export interface PostInitResource {
    items: PostResource[],
    total: number;
}

export interface PostFilterParams {
    page: number,
}