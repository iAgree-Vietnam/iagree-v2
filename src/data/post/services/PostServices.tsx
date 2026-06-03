import apiUtils from '@/src/utils/APIUtils';
import EndpointConfig from '@/src/constants/EndpointConfig';
import { PostParseUtils } from '@/src/data/post/utils/PostParseUtils';
import { PostInitResource } from '@/src/data/post/models/post.types';

export default class PostServices {
  get(params: any): Promise<PostInitResource> {
    return new Promise((resolve, reject) => {
      apiUtils
        .get(EndpointConfig.POST_INIT, { params })
        .then((apiRes) => resolve(PostParseUtils.init(apiRes.data)))
        .catch(reject);
    });
  }
}
