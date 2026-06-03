import React from 'react';
import { Typography, Image } from 'antd';
import { PostResource } from '../../data/post/models/post.types';
import Link from 'next/link';
import PostRouteUtils from '../../data/post/utils/PostRouteUtils';
import Images from '@/src/constants/Images';

type NewsItemProps = {
    data: PostResource,
}

function NewsItem(props: NewsItemProps) {

    const postResource = props.data;

    return (
        <Link href={PostRouteUtils.toDetailUrl(postResource)} className={'newsItemContainer'}>
            <div className={'imageContainer'}>
                <Image
                    preview={false}
                    src={postResource.photo}
                    fallback={Images.NEWS_DEFAULT}
                    alt={postResource.title}
                    className={'newsImg'}
                />
            </div>

            <div className={'descContainer'}>
                <Typography.Paragraph className={'newsDate'}>{postResource.createdDate}</Typography.Paragraph>
                <Typography.Paragraph
                    className={'newsTitle'}
                    strong={true}
                    ellipsis={{ rows: 2 }}
                >
                    {postResource.title}
                </Typography.Paragraph>

                <Typography.Paragraph
                    ellipsis={{ rows: 2 }}
                >
                    <div className={'newsDesc'} dangerouslySetInnerHTML={{ __html: postResource.shortDescription }} />
                </Typography.Paragraph>
            </div>
        </Link>
    );
}

export default NewsItem;
