import StringUtils from '../../../utils/StringUtils';
import { PostResource } from '../models/post.types';

export default class PostRouteUtils {

    static toScreen() {
        return '/news';
    }

    static toDetailUrl(postResource: PostResource) {
        return `/news/${StringUtils.slugify(postResource.title)}.${postResource.postId}`;
    }

}
