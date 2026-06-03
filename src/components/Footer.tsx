import React, { useCallback, useMemo } from 'react';
import { Col, Layout, Menu, Row, Space, Image } from 'antd';
import {
    FacebookFilled,
    InstagramFilled,
    LinkedinFilled,
    TwitterSquareFilled,
} from '@ant-design/icons';
import Link from 'next/link';
import TemplateRouteUtils from '../data/template/utils/TemplateRouteUtils';
import { PartnerRouteUtils } from '../data/partner/utils/PartnerRouteUtils';
import JobRouteUtils from '../data/job/utils/JobRouteUtils';
import AuthJobRouteUtils from '../data/auth/utils/AuthJobRouteUtils';
import Constants from '../constants/Constants';
import DocumentRouteUtils from '@/src/data/document/utils/DocumentRouteUtils';
import { useAccountContext } from '../contexts/AccountContext';
import TermOfUseRouteUtils from '../data/term-of-use/utils/TermOfUseRouteUtils';
import AboutUsRouteUtils from '../data/aboutus/utils/AboutUsRouteUtils';
import PrivacyPolicyRouteUtils from '../data/privacy-policy/utils/PrivacyPolicyRouteUtils';
import PostRouteUtils from '../data/post/utils/PostRouteUtils';
import ContractRouteUtils from '../data/contract/utils/ContractRouteUtils';
import { useBreakpoint } from '../hooks/useBreakpoint';
import Cookies from 'js-cookie';
import router from 'next/router';

const Footer = (props: any) => {
    const accountContext = useAccountContext();
    const { isDesktop } = useBreakpoint();
    const { setting, auth: fullProfileResource } = accountContext;

    const normalizeSettingItem = useCallback((s?: string) => {
        if (!s) return '';
        const regex = new RegExp(['&nbsp;', '<p>', '</p>', '<br>'].join('|'), 'gi');
        return s.replace(regex, '');
    }, []);

    const isLoggedIn = useMemo(
        () => Boolean(fullProfileResource),
        [fullProfileResource]
    );

    const generalMenu = [
        {
            key: 'ABOUT_US',
            label: <Link href={AboutUsRouteUtils.toScreen()}>Về chúng tôi</Link>,
        },
        {
            key: 'CONTACT',
            label: (
                <Link href={`mailto:${normalizeSettingItem(setting?.email)}`}>
                    Liên hệ
                </Link>
            ),
        },
        {
            key: 'NEWS',
            label: <Link href={PostRouteUtils.toScreen()}>Tin tức</Link>,
        },
        // {
        //     key: 'MYSIGN_SUPPORT',
        //     label: (
        //         <Link href={PrivacyPolicyRouteUtils.toMySignSupport()}>
        //             Hướng dẫn sử dụng MySign
        //         </Link>
        //     ),
        // },
        {
            key: 'FEEDBACK_FROM_SOCIAL_ORGANIZATION',
            label: (
                <Link href={PrivacyPolicyRouteUtils.toFeedbackFromOrganization()}>
                    Tiếp nhận phản ánh của tổ chức xã hội
                </Link>
            ),
        },
        // {
        //     key: 'CO_CHE_GIAI_QUYET_TRANH_CHAP',
        //     label: (
        //         <Link href={PrivacyPolicyRouteUtils.toDisputeResolutionMechanismScreen()}>
        //             Cơ chế giải quyết tranh chấp
        //         </Link>
        //     )
        // },
        // {
        //     key: 'CHINH_SACH_HUY_GIAO_DICH_HOAN_TIEN',
        //     label: (
        //         <Link href={PrivacyPolicyRouteUtils.toCancelTransactionPolicyScreen()}>
        //             Chính sách hủy giao dịch hoàn tiền
        //         </Link>
        //     )
        // }
    ];

    const jobMenu = [
        {
            key: 'JOB_SEARCH',
            label: <Link href={JobRouteUtils.toJobsSearchScreen({})}>Tìm kiếm công việc</Link>,
        },
        {
            key: 'JOB_LIST',
            label:
                <Link
                    href={JobRouteUtils.toAddScreen()}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                            Cookies.set(Constants.ROUTE_PRE_LOGIN, JobRouteUtils.toAddScreen());
                            router.push('/login');
                        } else {
                            router.push(JobRouteUtils.toAddScreen());
                        }
                    }}
                >
                    Đăng công việc
                </Link>,
        },
        {
            key: 'JOB_APPLY_LIST',
            label: (
                <Link
                    href={
                        fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET
                            ? AuthJobRouteUtils.toApplyUrl()
                            : PartnerRouteUtils.toProfileUrl()
                    }
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                            Cookies.set(
                                Constants.ROUTE_PRE_LOGIN,
                                fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET
                                    ? AuthJobRouteUtils.toApplyUrl()
                                    : PartnerRouteUtils.toProfileUrl()
                            );
                            router.push('/login');
                        } else {
                            router.push(
                                fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET
                                    ? AuthJobRouteUtils.toApplyUrl()
                                    : PartnerRouteUtils.toProfileUrl()
                            );
                        }
                    }}
                >
                    Quản lý công việc ứng tuyển
                </Link>
            ),
        },
        {
            key: 'JOB_MINE_LIST',
            label: (
                <Link
                    href={AuthJobRouteUtils.toManagementUrl()}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                            Cookies.set(Constants.ROUTE_PRE_LOGIN, AuthJobRouteUtils.toManagementUrl());
                            router.push('/login');
                        } else {
                            router.push(AuthJobRouteUtils.toManagementUrl());
                        }
                    }}
                >
                    Quản lý công việc đăng tuyển
                </Link>
            ),
        },
    ];

    const templateMenu = [
        {
            key: 'TEMPLATE_LIST',
            label: (
                <Link href={TemplateRouteUtils.toScreen({})}>Tìm kiếm biểu mẫu</Link>
            ),
        },
        {
            key: 'TEMPLATE_MANAGE',
            label: (
                <Link
                    href={TemplateRouteUtils.toTemplateManageUrl(
                        Constants.TEMPLATE.STATUS.MINE
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                            Cookies.set(Constants.ROUTE_PRE_LOGIN, TemplateRouteUtils.toTemplateManageUrl(
                                Constants.TEMPLATE.STATUS.MINE
                            ));
                            router.push('/login');
                        } else {
                            router.push(TemplateRouteUtils.toTemplateManageUrl(
                                Constants.TEMPLATE.STATUS.MINE
                            ));
                        }
                    }}
                >
                    Quản lý biểu mẫu
                </Link>
            ),
        },
        // {
        //     key: 'DOCUMENT_LIST',
        //     label: (
        //         <Link href={DocumentRouteUtils.toScreen({})}>Quản lý văn bản</Link>
        //     ),
        // },
        {
            key: 'CONTRACT_LIST',
            label: (
                <Link
                    href={ContractRouteUtils.toScreen({})}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                            Cookies.set(Constants.ROUTE_PRE_LOGIN, ContractRouteUtils.toScreen({}));
                            router.push('/login');
                        } else {
                            router.push(ContractRouteUtils.toScreen({}));
                        }
                    }}
                >
                    Quản lý tài liệu
                </Link>
            ),
        },
    ];

    const partnerMenu = [
        {
            key: 'PARTNER_SEARCH',
            label: (
                <Link href={PartnerRouteUtils.toPartnersSearchScreen()}>Tìm kiếm Đối tác</Link>
            ),
        },
        {
            key: 'MY_PROFILE',
            label: (
                <Link
                    href={PartnerRouteUtils.toProfileUrl()}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isLoggedIn) {
                            Cookies.set(Constants.ROUTE_PRE_LOGIN, PartnerRouteUtils.toProfileUrl());
                            router.push('/login');
                        } else {
                            router.push(PartnerRouteUtils.toProfileUrl());
                        }
                    }}
                >
                    Thông tin của tôi
                </Link>
            ),
        },
    ];

    const policyMenu = [
        {
            key: 'PRIVACY_POLICY',
            label: (
                <Link href={PrivacyPolicyRouteUtils.toScreen()}>
                    Chính sách bảo mật
                </Link>
            ),
        },
        {
            key: 'TERM_OF_USE',
            label: (
                <Link href={TermOfUseRouteUtils.toScreen()}>Điều khoản dịch vụ</Link>
            ),
        },
        // {
        //     key: 'PAYMENT_POLICY',
        //     label: (
        //         <Link href={PrivacyPolicyRouteUtils.toPaymentPolicyScreen()}>
        //             Chính sách thanh toán
        //         </Link>
        //     ),
        // },
        {
            key: 'PAYMENT_POLICY',
            label: (
                <Link href={PrivacyPolicyRouteUtils.toPaymentPolicyScreen()}>
                    Thanh toán, hoàn tiền và phí nền tảng
                </Link>
            ),
        },
        // {
        //     key: 'REFUND_POLICY',
        //     label: (
        //         <Link href={PrivacyPolicyRouteUtils.toRefundPolicyScreen()}>
        //             Chính sách hoàn trả
        //         </Link>
        //     ),
        // },
        {
            key: 'OPERATION_POLICY',
            label: (
                <Link href={PrivacyPolicyRouteUtils.toOperationScreen()}>
                    Quy chế hoạt động
                </Link>
            ),
        },
        {
            key: 'COMPLAIN_RESOLVE_POLICY',
            label: (
                <Link href={PrivacyPolicyRouteUtils.toComplainResolveScreen()}>
                    Cơ chế giải quyết tranh chấp và khiếu nại
                </Link>
            ),
        },
        {
            key: 'CONTACT_POLICY',
            label: (
                <Link href={PrivacyPolicyRouteUtils.toContactPolicyScreen()}>
                    Chính sách gửi thông báo và liên hệ
                </Link>
            ),
        },
        {
            key: 'COPYRIGHT_POLICY',
            label: (
                <Link href={PrivacyPolicyRouteUtils.toCopyrightPolicyScreen()}>
                    Chính sách nội dung và bản quyền
                </Link>
            ),
        },
        {
            key: 'USER_VIOLATION_POLICY',
            label: (
                <Link href={PrivacyPolicyRouteUtils.toUserViolationPolicyScreen()}>
                    Chính sách xử lý vi phạm của người dùng
                </Link>
            ),
        },
        {
            key: 'MANAGE_AND_USE_CHANCES_POLICY',
            label: (
                <Link href={PrivacyPolicyRouteUtils.toManageAndUseChancesPolicyScreen()}>
                    Chính sách quản lý và sử dụng Cơ Hội
                </Link>
            ),
        }
    ];

    return (
        <Layout.Footer>
            <div className={'footerWrapper'}>
                <div className={'footerMainContainer'}>
                    <div className="contentWrapper">
                        <Row gutter={[40, 16]} justify={'space-between'}>
                            <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={6}>
                                <div className={'footerLogo'}>
                                    <img
                                        alt={'IAGREE logo'}
                                        src={'/assets/img/logo.svg'}
                                        className={'footerLogoImg'}
                                    />
                                </div>

                                {setting?.officeAddress && (
                                    <div className={'footerInfoContainer'}>
                                        <div className={'footerInfoLabel'}>
                                            <strong
                                                dangerouslySetInnerHTML={{
                                                    __html: setting?.officeName || '',
                                                }}
                                            />
                                        </div>

                                        <div className={'footerInfoContainer'}>
                                            <div className={'footerInfoLabel'}>
                                                Đăng ký kinh doanh số:
                                            </div>
                                            <div className={'footerInfoValue'}>
                                                <strong
                                                    dangerouslySetInnerHTML={{
                                                        __html: setting?.taxCode || '',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className={'footerInfoLabel'}>Địa chỉ trụ sở:</div>
                                        <div className={'footerInfoValue'}>
                                            <strong
                                                dangerouslySetInnerHTML={{
                                                    __html: setting?.officeAddress || '',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className={'footerInfoContainer'}>
                                    <Space size={'large'} align={'start'}>
                                        {setting?.hotlineNumber && (
                                            <div>
                                                <div className={'footerInfoLabel'}>Hotline hỗ trợ</div>
                                                <div className={'footerInfoValue'}>
                                                    <strong
                                                        dangerouslySetInnerHTML={{
                                                            __html: setting?.hotlineNumber || '',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {setting?.email && (
                                            <div>
                                                <div className={'footerInfoLabel'}>Mail liên hệ:</div>
                                                <div className={'footerInfoValue'}>
                                                    <strong
                                                        dangerouslySetInnerHTML={{
                                                            __html: setting?.email || '',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Space>
                                </div>
                                <div style={{ marginTop: '0', marginBottom: "0" }}>
                                    <Link
                                        target="_blank"
                                        href={'http://online.gov.vn/Website/chi-tiet-132417'}
                                    >
                                        <img style={{ maxWidth: 150 }} alt='' title='' src={'/assets/img/logoCCDV.png'} />
                                    </Link>
                                </div>
                            </Col>

                            <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={18}
                                xl={18}
                                xxl={18}
                                className={'footerLinksWrapper'}
                            >
                                {!isDesktop ? (
                                    <div>
                                        <Menu
                                            className={'footerMenuContainer'}
                                            mode={'inline'}
                                            items={[
                                                {
                                                    key: 'GENERAL_INFO',
                                                    label: (
                                                        <h3 className={'footerTitle'}>Thông tin chung</h3>
                                                    ),
                                                    children: generalMenu,
                                                },
                                                {
                                                    key: 'JOB_INFO',
                                                    label: <h3 className={'footerTitle'}>Công việc</h3>,
                                                    children: jobMenu,
                                                },
                                                {
                                                    key: 'TEMPLATE_INFO',
                                                    label: (
                                                        <h3 className={'footerTitle'}>
                                                            Biểu mẫu & Tài liệu
                                                        </h3>
                                                    ),
                                                    children: templateMenu,
                                                },
                                                {
                                                    key: 'PARTNER_INFO',
                                                    label: <h3 className={'footerTitle'}>Đối tác</h3>,
                                                    children: partnerMenu,
                                                },
                                                {
                                                    key: 'POLICY_INFO',
                                                    label: <h3 className={'footerTitle'}>Chính sách</h3>,
                                                    children: policyMenu,
                                                },
                                            ]}
                                        />
                                    </div>
                                ) : (
                                    <Row justify={'space-between'}>
                                        <Col xs={12} sm={12} flex={1}>
                                            <h3 className={'footerTitle'}>Thông tin chung</h3>

                                            <Menu
                                                className={'footerMenuContainer'}
                                                mode={'vertical'}
                                                items={generalMenu}
                                            />
                                        </Col>

                                        <Col xs={12} sm={12} flex={1}>
                                            <h3 className={'footerTitle'}>Công việc</h3>

                                            <Menu
                                                className={'footerMenuContainer'}
                                                mode={'vertical'}
                                                items={jobMenu}
                                            />
                                        </Col>

                                        <Col xs={12} sm={12} flex={1}>
                                            <h3 className={'footerTitle'}>Biểu mẫu & Tài liệu</h3>

                                            <Menu
                                                className={'footerMenuContainer'}
                                                mode={'vertical'}
                                                items={templateMenu}
                                            />
                                        </Col>

                                        <Col xs={12} sm={12} flex={1}>
                                            <h3 className={'footerTitle'}>Đối tác</h3>

                                            <Menu
                                                className={'footerMenuContainer'}
                                                mode={'vertical'}
                                                items={partnerMenu}
                                            />
                                        </Col>

                                        <Col xs={12} sm={12} flex={1}>
                                            <h3 className={'footerTitle'}>Chính sách</h3>

                                            <Menu
                                                className={'footerMenuContainer'}
                                                mode={'vertical'}
                                                items={policyMenu}
                                            />
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className="copyrightWrapper">
                    <div className="contentWrapper">
                        <Space size={'middle'}>
                            {setting?.facebookUrl && (
                                <Link
                                    href={normalizeSettingItem(setting.facebookUrl)}
                                    target="_blank"
                                >
                                    <FacebookFilled style={{ fontSize: 24 }} />
                                </Link>
                            )}

                            {setting?.twitterUrl && (
                                <Link
                                    href={normalizeSettingItem(setting.twitterUrl)}
                                    target="_blank"
                                >
                                    <TwitterSquareFilled style={{ fontSize: 24 }} />
                                </Link>
                            )}

                            {setting?.instagramUrl && (
                                <Link
                                    href={normalizeSettingItem(setting.instagramUrl)}
                                    target="_blank"
                                >
                                    <InstagramFilled style={{ fontSize: 24 }} />
                                </Link>
                            )}

                            {setting?.linkedinUrl && (
                                <Link
                                    href={normalizeSettingItem(setting.linkedinUrl)}
                                    target="_blank"
                                >
                                    <LinkedinFilled style={{ fontSize: 24 }} />
                                </Link>
                            )}
                        </Space>

                        <div className={'copyrightText'}>
                            © A&D 2025. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </Layout.Footer>
    );
};

export default Footer;