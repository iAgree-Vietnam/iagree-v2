import React from 'react';
import Link from 'next/link';
import { Image, Typography, Space } from 'antd';

import PostRouteUtils from '@/src/data/post/utils/PostRouteUtils';
import { PostResource } from '@/src/data/post/models/post.types';

export type NewsSidebarItemResource = {
    imageUrl: string;
    title: string;
    publishDate?: string;
    postResource: PostResource;
}

type NewsSidebarItemProps = {
    data: NewsSidebarItemResource
}

function NewsSidebarItem(props: NewsSidebarItemProps) {

    const item = props.data;

    return (
        <Link href={PostRouteUtils.toDetailUrl(item.postResource)} className={'newsSidebarItemContainer full-width'}>
            <Space direction='vertical' className='full-width'>
                <Typography.Title level={3} ellipsis={{rows: 2}} className={'newsTitle'}>
                    {item.title}
                </Typography.Title>
                <Typography.Paragraph type={'secondary'} className={'newsDateTextSidebar'}>
                    {item?.publishDate}
                </Typography.Paragraph>
            </Space>
            <div>
                <Image preview={false} src={item.imageUrl} alt={item.title} className={'newsSidebarImg'}/>
            </div>
        </Link>
    );
}

export default NewsSidebarItem;
