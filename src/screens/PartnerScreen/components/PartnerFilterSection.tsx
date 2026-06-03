import React, { useCallback } from 'react';
import { Button, Col, Popover, Row, Space, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DatasResource } from '@/src/data/base/models/base.types';
import { CategoryResource } from '@/src/data/category/models/category.types';
import { TagResource } from '@/src/data/tag/models/tag.types';
import { ExperienceResource } from '@/src/data/experience/models/experience.types';
import { LocationResource } from '@/src/data/location/models/location.types';
import { PartnerFilterParams } from '@/src/data/partner/models/partner.types';
import { PartnerParserUtils } from '@/src/data/partner/utils/PartnerParserUtils';
import ArrayUtils from '@/src/utils/ArrayUtils';
import { ButtonWithIcon } from '@/src/components/button';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

type PartnerFilterSectionProps = {
    // categories: DatasResource<CategoryResource>;
    categories: CategoryResource[];
    locations: DatasResource<LocationResource>;
    experiences: DatasResource<ExperienceResource>;
    tags: DatasResource<TagResource>;

    filters: PartnerFilterParams;
    setFilters: React.Dispatch<React.SetStateAction<PartnerFilterParams>>;
};

function PartnerFilterSection(props: PartnerFilterSectionProps) {
    const { isDesktop } = useBreakpoint();

    const { categories,  experiences, filters, setFilters } =
        props;

    // const onClickTag = (tagResource: TagResource) => {
    //     const isChecked = filters.tagIds.includes(tagResource.tagId);
    //     if (isChecked) {
    //         setFilters((prevState) => ({
    //             ...prevState,
    //             tagIds: prevState.tagIds.filter((tagId) => tagId !== tagResource.tagId),
    //         }));
    //     } else {
    //         setFilters((prevState) => ({
    //             ...prevState,
    //             tagIds: [...prevState.tagIds, tagResource.tagId],
    //         }));
    //     }
    // };

    const toggleCategory = useCallback(
        (categoryId: number) => {
            setFilters((prevState) => ({
                ...prevState,
                categoryIds: ArrayUtils.addOrRemove(prevState.categoryIds, categoryId),
            }));
        },
        [setFilters]
    );

    return (
        <Row gutter={[32, 32]}>
            <Col span={24}>
                <Space
                    size={!isDesktop ? 12 : 'large'}
                    direction={!isDesktop ? 'vertical' : 'horizontal'}
                    className={'full-width'}
                >
                    <Popover
                        placement={'bottomLeft'}
                        trigger={'click'}
                        content={
                            <Space size={[0, 8]} wrap={true}>
                                {categories.map((itemInfo) => (
                                    <Tag.CheckableTag
                                        key={itemInfo.categoryId.toString()}
                                        checked={filters.categoryIds.includes(itemInfo.categoryId)}
                                        className={'app-checkable-tag'}
                                        onClick={() => toggleCategory(itemInfo.categoryId)}
                                    >
                                        {itemInfo.name}
                                    </Tag.CheckableTag>
                                ))}
                            </Space>
                        }
                        arrow={false}
                        overlayClassName={'filterPopover'}
                    >
                        <Button
                            type={'default'}
                            size={'large'}
                            icon={<DownOutlined style={{ fontSize: 12 }} />}
                            iconPosition={'end'}
                            block
                        >
                            Lĩnh vực
                        </Button>
                    </Popover>
                    {/* <Dropdown
                        menu={{
                            items: experiences.items.map((experienceResource) => ({
                                key: experienceResource.experienceId,
                                label: experienceResource.name,
                                onClick: () =>
                                    setFilters((prevState) => ({
                                        ...prevState,
                                        experienceId: experienceResource.experienceId,
                                    })),
                            })),
                            // activeKey: filters.experienceId?.toString(),
                        }}
                        trigger={['click']}
                    >
                        <Button
                            type={'default'}
                            size={'large'}
                            icon={<DownOutlined style={{ fontSize: 12 }} />}
                            iconPosition={'end'}
                            block
                        >
                            Kinh nghiệm
                        </Button>
                    </Dropdown> */}
                </Space>
            </Col>

            {!PartnerParserUtils.isFilterInitialState(filters) && (
                <Col span={24}>
                    <Space size={'middle'} wrap>
                        <ButtonWithIcon
                            type={'default'}
                            size={'middle'}
                            icon={<IconSvgLocal name={'IC_CLOSE'} width={26} height={8} />}
                            iconPosition={'end'}
                            onClick={() =>
                                setFilters((prevState) => ({
                                    ...prevState,
                                    ...PartnerParserUtils.getFilterInitialState(),
                                }))
                            }
                        >
                            Bỏ chọn tất cả
                        </ButtonWithIcon>
                        {filters?.categoryIds?.map((id) => {
                            return (
                                <Tag
                                    closable
                                    key={id}
                                    onClose={() => toggleCategory(id)}
                                    className={'filterSelectedTag'}
                                >
                                    {
                                        categories?.find(
                                            (category) => category.categoryId === id
                                        )?.name
                                    }
                                </Tag>
                            );
                        })}
                        {filters?.experienceId && (
                            <Tag
                                closable
                                onClose={() =>
                                    setFilters((prevState) => ({
                                        ...prevState,
                                        experienceId: null,
                                    }))
                                }
                                className={'filterSelectedTag'}
                            >
                                {
                                    experiences?.items?.find(
                                        (exp) => exp.experienceId === filters.experienceId
                                    )?.name
                                }
                            </Tag>
                        )}
                    </Space>
                </Col>
            )}
        </Row>
    );
}

export default PartnerFilterSection;
