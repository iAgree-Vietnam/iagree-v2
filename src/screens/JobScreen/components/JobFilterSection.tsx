import React, { useCallback, useMemo } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Col, Popover, Row, Space, Tag } from 'antd';
import { DatasResource } from '@/src/data/base/models/base.types';
import { CategoryResource, CateServiceResource, ServiceResource } from '@/src/data/category/models/category.types';
import { ExperienceResource } from '@/src/data/experience/models/experience.types';
import { TimeResource } from '@/src/data/time/models/time.types';
import { JobsFilterParams } from '@/src/data/job/models/job.types';
import { JobParseUtils } from '@/src/data/job/utils/JobParseUtils';
import ArrayUtils from '@/src/utils/ArrayUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { ButtonWithIcon } from '@/src/components/button';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import { SkillResource } from '@/src/data/skill/models/skill.types';

type JobFilterSectionProps = {
    // categories: DatasResource<CategoryResource>;
    categories: CategoryResource[];
    // serviceCategories: CateServiceResource[];
    // skills: SkillResource[];
    // services: ServiceResource[];
    experiences: DatasResource<ExperienceResource>;
    times: DatasResource<TimeResource>;
    filters: JobsFilterParams;
    setFilters: React.Dispatch<React.SetStateAction<JobsFilterParams>>;
};

const JobFilterSection = (props: JobFilterSectionProps) => {
    const { categories, experiences, times, filters, setFilters } = props;

    const { isDesktop } = useBreakpoint();

    // Compute skillsAvailable based on selected categoryIds
    // const skillsAvailable: SkillResource[] = useMemo(() => {
    //     // Find all skills for selected categories
    //     return selectboxResource.skills
    //     .filter(skill => filters.categoryIds.includes(skill.categoryProjectId));
    // }, [filters.categoryIds, skills]);

    const toggleCategory = useCallback(
        (categoryId: number) => {
            setFilters((prevState) => ({
                ...prevState,
                categoryIds: ArrayUtils.addOrRemove(prevState.categoryIds, categoryId),
            }));
        },
        [setFilters]
    );

    const toggleTime = useCallback(
        (timeId: number) => {
            setFilters((prevState) => ({
                ...prevState,
                timeIds: ArrayUtils.addOrRemove(prevState.timeIds, timeId),
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

                    {/* <Popover
                        placement="bottomLeft"
                        trigger="click"
                        content={
                        <Space size={[0, 8]} wrap>
                            {filters.categoryIds.length === 0 ? (
                                <span>Vui lòng chọn Lĩnh vực</span>
                            ) : skillsAvailable.length === 0 ? (
                                <span>Không có dữ liệu</span>
                            ) : (
                                skillsAvailable.map((sk) => (
                                    <Tag.CheckableTag
                                    key={sk.skillId}
                                    checked={filters.skillIds.includes(sk.skillId)}
                                    className="app-checkable-tag"
                                    onClick={() => toggleSkill(sk.skillId)}
                                    >
                                    {sk.name}
                                    </Tag.CheckableTag>
                                ))
                            )}
                        </Space>
                        }
                        arrow={false}
                        overlayClassName="filterPopover"
                    >
                        <Button type="default" size="large" block>
                        Kỹ năng {skillCount > 0 && <span>({skillCount})</span>}{" "}
                        <DownOutlined style={{ fontSize: 12, marginLeft: 8 }} />
                        </Button>
                    </Popover> */}

                    {/* Danh mục Dịch vụ */}
                    {/* <Popover
                        placement="bottomLeft"
                        trigger="click"
                        content={
                        <Space size={[0, 8]} wrap>
                            {filters.categoryIds.length === 0 ? (
                            <span>Vui lòng chọn lĩnh vực</span>
                            ) : serviceCategoriesAvailable.length === 0 ? (
                            <span>Không có dữ liệu</span>
                            ) : (
                            serviceCategoriesAvailable?.map((sc) => (
                                <Tag.CheckableTag
                                key={sc.cateServiceId}
                                checked={filters.serviceCategoryIds.includes(sc.cateServiceId)}
                                className="app-checkable-tag"
                                onClick={() => toggleServiceCategory(sc.cateServiceId)}
                                >
                                {sc.name}
                                </Tag.CheckableTag>
                            ))
                            )}
                        </Space>
                        }
                        arrow={false}
                        overlayClassName="filterPopover"
                    >
                        <Button type="default" size="large" block>
                        Danh mục Dịch vụ{" "}
                        {serviceCategoryCount > 0 && (
                            <span>({serviceCategoryCount})</span>
                        )}{" "}
                        <DownOutlined style={{ fontSize: 12, marginLeft: 8 }} />
                        </Button>
                    </Popover> */}

                    {/* Dịch vụ */}
                    {/* <Popover
                        placement="bottomLeft"
                        trigger="click"
                        content={
                        <Space size={[0, 8]} wrap>
                            {filters.serviceCategoryIds.length === 0 ? (
                            <span>Vui lòng chọn Danh mục Dịch vụ</span>
                            ) : servicesAvailable.length === 0 ? (
                            <span>Không có dữ liệu</span>
                            ) : (
                            servicesAvailable.map((sd) => (
                                <Tag.CheckableTag
                                key={sd.serviceId}
                                checked={filters.serviceIds.includes(
                                    sd.serviceId
                                )}
                                className="app-checkable-tag"
                                onClick={() => toggleServiceDetail(sd.serviceId)}
                                >
                                {sd.name}
                                </Tag.CheckableTag>
                            ))
                            )}
                        </Space>
                        }
                        arrow={false}
                        overlayClassName="filterPopover"
                    >
                        <Button type="default" size="large" block>
                        Dịch vụ{" "}
                        {servicesCount > 0 && <span>({servicesCount})</span>}{" "}
                        <DownOutlined style={{ fontSize: 12, marginLeft: 8 }} />
                        </Button>
                    </Popover> */}

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
                            activeKey: filters.experienceId?.toString(),
                        }}
                        trigger={['click']}
                    >
                        <Button
                            type={'default'}
                            size={'large'}
                            icon={<DownOutlined style={{ fontSize: 12 }} />}
                            iconPosition={'end'}
                        >
                            Kinh nghiệm
                        </Button>
                    </Dropdown> */}
                    {/* <Popover
                        placement={'bottomLeft'}
                        trigger={'click'}
                        content={
                            <Space size={[0, 8]} wrap={true}>
                                {times.items.map((itemInfo) => (
                                    <Tag.CheckableTag
                                        key={itemInfo.timeId.toString()}
                                        checked={filters.timeIds.includes(itemInfo.timeId)}
                                        className={'app-checkable-tag'}
                                        onClick={() => toggleTime(itemInfo.timeId)}
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
                            Thời gian thực hiện
                        </Button>
                    </Popover> */}
                </Space>
            </Col>
            {!JobParseUtils.isFilterInitialState(filters) && (
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
                                    ...JobParseUtils.getFilterInitialState(),
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
                        {/* {filters?.experienceId && (
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
                        )} */}
                        {/* {filters?.timeIds?.map((id) => {
                            return (
                                <Tag
                                    closable
                                    key={id}
                                    onClose={() => toggleTime(id)}
                                    className={'filterSelectedTag'}
                                >
                                    {times?.items?.find((time) => time.timeId === id)?.name}
                                </Tag>
                            );
                        })} */}
                    </Space>
                </Col>
            )}
        </Row>
    );
};

export default JobFilterSection;
