import React from 'react';
import { Button, Row, Typography } from 'antd';
import { HeartOutlined, HeartFilled, LoadingOutlined } from '@ant-design/icons';
import { TemplateResource } from '@/src/data/template/models/template.types';
import PriceUtils from '@/src/utils/PriceUtils';
import useTemplateReaction from '@/src/screens/TemplateScreen/hooks/useTemplateReaction';
import { IconSvgLocal } from '../icon-svg-local';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

type TemplateItemProps = {
    data: TemplateResource;
    onPreview: (templateResource: TemplateResource) => void;
    onReactionSuccess?: () => void;
};

function TemplateItem(props: TemplateItemProps) {
    const { isDesktop } = useBreakpoint();
    const templateResource = props.data;
    const reactionMutation = useTemplateReaction({});
    const isFree = templateResource.price === 0;
    const isPurchased = templateResource.isPurchased;

    return (
        <div
            className={'templateItemContainer'}
            onClick={() => props.onPreview(templateResource)}
        >
            <div className={'descContainer'}>
                <Typography.Title
                    title={templateResource.name}
                    className={'templateTitle'}
                    level={4}
                >
                    {templateResource.name}
                </Typography.Title>

                <Typography.Paragraph className={'templateSalaryText'}>
                    {isPurchased ? (
                        'Đã mua'
                    ) : (
                        <>
                            {isFree ? 'Miễn phí' : PriceUtils.display(templateResource.price)}
                        </>
                    )}
                </Typography.Paragraph>
            </div>

            <Row
                className={'templateCtaContainer'}
                justify={'space-between'}
                align={'bottom'}
            >
                <Button
                    type={'text'}
                    className={'btnFavorite'}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        reactionMutation.mutate({
                            templateId: templateResource.templateId,
                        });
                    }}
                    disabled={reactionMutation.isLoading}
                >
                    {!reactionMutation.isLoading ? (
                        <>
                            {templateResource.isLiked ? (
                                <HeartFilled style={{ color: '#09993E', fontSize: 24 }} />
                            ) : (
                                <HeartOutlined style={{ fontSize: 24, color: '#979797' }} />
                            )}
                        </>
                    ) : (
                        <LoadingOutlined style={{ color: '#979797', fontSize: 24 }} />
                    )}
                </Button>
                <div className={'iconDocx'}>
                    <IconSvgLocal
                        name={'IC_DOCX'}
                        fill={'none'}
                        width={!isDesktop ? 50 : 60}
                        height={!isDesktop ? 50 : 60}
                    />
                </div>
            </Row>
        </div>
    );
}

export default TemplateItem;
