import { RawPostItem, RawPostsResource, RawPostDetails } from '../models/post.raw';
import { PostInitResource, PostResource, PostDetailsResource } from '../models/post.types';
import datetimeUtils from '@/src/utils/DatetimeUtils';

export const PostParseUtils = {

    init(rawPostsResource: RawPostsResource): PostInitResource {
        return {
            items: rawPostsResource.posts.items.map(PostParseUtils.item),
            total: rawPostsResource.posts.total,
        };
    },

    item(dataItem: RawPostItem): PostResource {
        return {
            postId: dataItem.id,
            title: dataItem.title,
            shortDescription: dataItem.short_description,
            description: dataItem.description,
            photo: dataItem.photo,
            isMedia: Boolean(dataItem.is_media),
            publishDate: dataItem.publish_date,
            status: dataItem.status,
            createdDate: dataItem.created_at ? datetimeUtils.getMoment(dataItem.created_at)?.format(datetimeUtils.LOCAL_DATE) || '': '',
            updatedDate: dataItem.updated_at ? datetimeUtils.getMoment(dataItem.updated_at)?.format(datetimeUtils.LOCAL_DATE) || '': '',
        };
    },

    details(rawPostDetails: RawPostDetails): PostDetailsResource {
        return {
            post: PostParseUtils.item(rawPostDetails.post),
            top: rawPostDetails.top.map(PostParseUtils.item),
        };
    },

};
