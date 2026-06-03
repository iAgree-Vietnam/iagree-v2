import React from 'react';
import { Card, Image, Row, Typography } from 'antd';
import { useRouter } from 'next/router';
import { CategoryResource } from '@/src/data/category/models/category.types';
import Images from '@/src/constants/Images';
import TemplateRouteUtils from '@/src/data/template/utils/TemplateRouteUtils';

type TemplateCategoryItemProps = {
    data: CategoryResource;
};

function TemplateCategoryItem(props: TemplateCategoryItemProps) {
    const router = useRouter();
    const categoryResource = props.data;

    return (
        <Card
            hoverable
            className={'categoryCard'}
            onClick={() =>
                router.push(
                    TemplateRouteUtils.toListScreen({
                        categoryIds: [categoryResource.categoryId],
                    })
                )
            }
        >
            <Row align={'middle'} justify={'space-between'} wrap={false}>
                <Typography.Paragraph ellipsis={{ rows: 1 }} className={'categoryName'}>{categoryResource.name}</Typography.Paragraph>
                <div className={'categoryIcon'}>
                    <Image
                        preview={false}
                        src={categoryResource.photo}
                        alt={categoryResource.name}
                        fallback={Images.CATEGORY_ICON}
                    />
                </div>
            </Row>
        </Card>
    );
}

export default TemplateCategoryItem;
