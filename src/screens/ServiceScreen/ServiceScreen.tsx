import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Breadcrumb, Image, Typography, Button, Row, Space, Col } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

import RootLayout from '@/src/layouts/RootLayout';
import {
    CitizenIdStatus,
    PackageItem,
    PricingResource,
} from '@/src/data/pricing/models/pricing.types';
import PriceUtils from '@/src/utils/PriceUtils';
import PricingRouteUtils from '@/src/data/pricing/utils/PricingRouteUtils';
import { useAccountContext } from '@/src/contexts/AccountContext';
import Cookies from 'js-cookie';
import Constants from '@/src/constants/Constants';
// import { PricingParseUtils } from '@/src/data/pricing/utils/PricingParseUtil';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import ServiceItem from './ServiceItem';
import PrivacyPolicyRouteUtils from '@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils';
import { ButtonWithIcon } from '@/src/components/button';
import Slider from '@ant-design/react-slick';
import TemplateRouteUtils from '@/src/data/template/utils/TemplateRouteUtils';
import JobRouteUtils from '@/src/data/job/utils/JobRouteUtils';
import { PartnerRouteUtils } from '@/src/data/partner/utils/PartnerRouteUtils';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import ContractRouteUtils from '@/src/data/contract/utils/ContractRouteUtils';

function ServiceScreen(props: any) {
    const router = useRouter();
    const { isDesktop } = useBreakpoint();
    const { auth: userInfo, isLoggedIn } = useAccountContext();

    const pricingData = props.data as PricingResource;
    const statusCode = props.statusCode as CitizenIdStatus['status']['code'];

    const isPartner = useMemo(() => {
        return userInfo?.partner?.status === Constants.PARTNER.DA_DUYET;
    }, [userInfo]);

    const isRejectPartner = useMemo(
        () => userInfo?.partner?.status === Constants.PARTNER.TU_CHOI,
        [userInfo]
    );

    // const renderPackageName = useCallback(
    //     (
    //         packageName: string,
    //         fixedLabel: string,
    //         available: boolean,
    //         showFullPackageName: boolean
    //     ) => {
    //         const hasFixedLabel = packageName.startsWith(fixedLabel);
    //         return (
    //             <>
    //                 {(hasFixedLabel || showFullPackageName) && (
    //                     <Typography.Paragraph
    //                         className={'packageAccountLabel'}
    //                         type={'secondary'}
    //                     >
    //                         {fixedLabel}
    //                     </Typography.Paragraph>
    //                 )}
    //                 <Typography.Paragraph
    //                     className={`packageName ${available ? 'available' : null}`}
    //                     strong={true}
    //                 >
    //                     {hasFixedLabel && !showFullPackageName
    //                         ? packageName.replace(`${fixedLabel} `, '')
    //                         : packageName}
    //                 </Typography.Paragraph>
    //             </>
    //         );
    //     },
    //     []
    // );

    // const currentUserServiceIndex = pricingData.users.allPackages.findIndex(
    //     (item) => item.name === userInfo?.levelDisplay
    // );

    // const ONE_MILLION = 1000000;

    const userPackageData = pricingData.users.services.map((item) => ({
        name: item.name,
        key: item.serviceKeyName,
        ...item?.packages?.reduce(
            (prev, current) => ({
                ...prev,
                [current?.pivot?.packageId]: {
                    checked: true,
                    servicePackages: item.servicePackages.find(
                        (sP) => sP.packageId === current.pivot?.packageId
                    ),
                    serviceKeyName: item.serviceKeyName,
                },
            }),
            {}
        ),
    }));

    userPackageData.push({
        name: '',
        key: Constants.BUY_USER_PACKAGE_KEY_NAME,
        ...pricingData.users.allPackages.reduce(
            (pre, item) => ({
                ...pre,
                [item.packageId]: { buy: item.packageId, checked: true },
            }),
            {}
        ),
    });

    // const handleClickUserPackage = (item: PackageItem, index: number) => {
    //     if (item.price > 0 && index > currentUserServiceIndex) {
    //         if (!isLoggedIn) {
    //             Cookies.set(
    //                 Constants.ROUTE_PRE_LOGIN,
    //                 PricingRouteUtils.toPaymentUpgradeAccountUrl(item)
    //             );
    //             router.push('/login');
    //         } else {
    //             router.push(PricingRouteUtils.toPaymentUpgradeAccountUrl(item));
    //         }
    //     }
    // };

    const eSignPackageData: any[] = pricingData.signatures.services.map(
        (item) => ({
            name: item.name,
            key: item.serviceKeyName,
            ...item?.packages?.reduce(
                (prev, current) => ({
                    ...prev,
                    servicePackages: item.servicePackages.find(
                        (sP) => sP.packageId === current.pivot?.packageId
                    ),
                }),
                {}
            ),
        })
    );

    const eSignComboPackage: PackageItem[] = [];
    const staterPackage = pricingData.signatures.allPackages.find(
        (item) =>
            item.packageKeyName ===
            Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_STARTER
    );
    if (staterPackage) eSignComboPackage.push(staterPackage);
    const smartPackage = pricingData.signatures.allPackages.find(
        (item) =>
            item.packageKeyName === Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_SMART
    );
    if (smartPackage) eSignComboPackage.push(smartPackage);
    const proPackage = pricingData.signatures.allPackages.find(
        (item) =>
            item.packageKeyName === Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_PRO
    );
    if (proPackage) eSignComboPackage.push(proPackage);

    const eSignByOncePackage = pricingData.signatures.allPackages.find(
        (item) =>
            item.packageKeyName === Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_ONCE
    );

    // @ts-ignore
    // const eSignPackage =
    //     userInfo?.userPackages?.findLast(
    //         (item) =>
    //             item.type === Constants.PAYMENT.TYPE_TEXT.E_SIGNATURE &&
    //             item.keyName !== Constants.E_SIGNATURE_PACKAGE.E_SIGNATURE_BY_ONCE
    //     ) || PricingParseUtils.getESignatureDefault();

    // const currentESignServiceIndex = eSignComboPackage.findIndex(
    //     (item) => item.name === eSignPackage?.name
    // );

    const handleClickESignPackage = (item: PackageItem, index: number) => {
        // if (index > currentESignServiceIndex)
        if (!isLoggedIn) {
            Cookies.set(
                Constants.ROUTE_PRE_LOGIN,
                PricingRouteUtils.toPaymentESignatureUrl(item)
            );
            router.push('/login');
        } else {
            router.push(PricingRouteUtils.toPaymentESignatureUrl(item));
        }
    };

    const featureSlickSettings = {
        arrows: false,
        centerMode: !isDesktop ? true : false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const FeatureListWrapper = !isDesktop ? Slider : Row;

    return (
        <RootLayout>
            <Head>
                <title>Dịch vụ</title>
                <link
                    rel={'stylesheet'}
                    type={'text/css'}
                    charSet={'UTF-8'}
                    href={
                        'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css'
                    }
                />
                <link
                    rel={'stylesheet'}
                    type={'text/css'}
                    href={
                        'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css'
                    }
                />
            </Head>

            <section className={'pageHeaderWrapper'}>
                <div className="contentWrapper">
                    <div className={'pageHeaderContainer serviceHeaderContainer'}>
                        <h1 className={'pageHeaderTitle nm-typo'}>Dịch vụ</h1>
                    </div>
                </div>
            </section>

            <section className={'breadcrumbContainer'}>
                <div className="contentWrapper">
                    <Breadcrumb
                        items={[
                            {
                                title: (
                                    <>
                                        <IconSvgLocal name={'IC_HOME'} />
                                        <span>Trang chủ</span>
                                    </>
                                ),
                                href: '/',
                            },
                            { title: 'Dịch vụ' },
                        ]}
                    />
                </div>
            </section>

            <section className={'sectionContainer featureWrapper'}>
                <div className="contentWrapper">
                    <div className={'sectionTitleContainer'}>
                        <Typography.Title
                            className={'sectionTitle featureSectionTitle'}
                            level={2}
                        >
                            Giải pháp <span>kết nối toàn diện</span> trên một nền tảng duy
                            nhất
                        </Typography.Title>
                    </div>

                    <div className="sectionContentContainer">
                        <Row justify={'center'}>
                            <Image
                                preview={false}
                                src={'/assets/img/home/feature/logo.svg'}
                                alt={'iAgree'}
                                width={!isDesktop ? 181 : 318}
                                height={!isDesktop ? 45 : 80}
                            />
                        </Row>
                        <FeatureListWrapper {...featureSlickSettings} gutter={[40, 24]}>
                            <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                <div className={'featureItemContainer'}>
                                    <div className={'imageContainer'}>
                                        <Image
                                            preview={false}
                                            src={'/assets/img/home/feature/feature-1.png'}
                                            alt={'feature-1'}
                                        />
                                    </div>

                                    <div className="descContainer">
                                        <Typography.Title className={'featureTitle'} level={3}>
                                            Thư viện biểu mẫu đa dạng
                                        </Typography.Title>
                                        <Typography.Paragraph className={'featureTitleDescription'}>
                                            Kho biểu mẫu đa dạng trong các lĩnh vực: luật pháp, kế
                                            toán, tài chính,... được tổng hợp từ các chuyên gia hàng
                                            đầu, cộng đồng trong lĩnh vực,..
                                        </Typography.Paragraph>
                                    </div>

                                    <Row className="ctaContainer" justify={'center'}>
                                        <ButtonWithIcon
                                            icon={
                                                <IconSvgLocal
                                                    name={'IC_ARROW_RIGHT'}
                                                    width={26}
                                                    height={9}
                                                />
                                            }
                                            iconPosition={'end'}
                                            onClick={() => {
                                                if (!isLoggedIn) {
                                                    Cookies.set(
                                                        Constants.ROUTE_PRE_LOGIN,
                                                        TemplateRouteUtils.toTemplateManageUrl(
                                                            Constants.TEMPLATE.STATUS.ALL
                                                        )
                                                    );
                                                    router.push('/login');
                                                } else {
                                                    router.push(
                                                        TemplateRouteUtils.toTemplateManageUrl(
                                                            Constants.TEMPLATE.STATUS.ALL
                                                        )
                                                    );
                                                }
                                            }}
                                        >
                                            Tạo template ngay
                                        </ButtonWithIcon>
                                    </Row>
                                </div>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                <div className={'featureItemContainer down'}>
                                    <div className={'imageContainer'}>
                                        <Image
                                            preview={false}
                                            src={'/assets/img/home/feature/feature-2.png'}
                                            alt={'feature-2'}
                                        />
                                    </div>

                                    <div className="descContainer">
                                        <Typography.Title className={'featureTitle'} level={3}>
                                            Ký số điện tử online nhanh chóng, hợp pháp
                                        </Typography.Title>
                                        <Typography.Paragraph className={'featureTitleDescription'}>
                                            Đơn vị tiên phong tích hợp ký số trên một nền tảng, giúp
                                            bảo mật thông tin, ngăn chặn giả mạo, tiết kiệm thời gian,
                                            chi phí
                                        </Typography.Paragraph>
                                    </div>

                                    <Row className="ctaContainer" justify={'center'}>
                                        <ButtonWithIcon
                                            icon={
                                                <IconSvgLocal
                                                    name={'IC_ARROW_RIGHT'}
                                                    width={26}
                                                    height={9}
                                                />
                                            }
                                            iconPosition={'end'}
                                            onClick={() => {
                                                if (!isLoggedIn) {
                                                    Cookies.set(
                                                        Constants.ROUTE_PRE_LOGIN,
                                                        ContractRouteUtils.toUploadScreen()
                                                    );
                                                    router.push('/login');
                                                } else {
                                                    router.push(
                                                        ContractRouteUtils.toUploadScreen()
                                                    );
                                                }
                                            }}
                                        >
                                            Upload để ký số
                                        </ButtonWithIcon>
                                    </Row>
                                </div>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                <div className={'featureItemContainer down'}>
                                    <div className={'imageContainer'}>
                                        <Image
                                            preview={false}
                                            src={'/assets/img/home/feature/feature-3.png'}
                                            alt={'feature-3'}
                                        />
                                    </div>

                                    <div className="descContainer">
                                        <Typography.Title className={'featureTitle'} level={3}>
                                            Đăng yêu cầu tìm kiếm Đối tác cung cấp dịch vụ
                                        </Typography.Title>
                                        <Typography.Paragraph className={'featureTitleDescription'}>
                                            Đăng tải công việc của bạn để được xử lý nhanh chóng, hiệu
                                            quả thông qua đội ngũ Đối tác kinh nghiệm, uy tín của
                                            iAgree
                                        </Typography.Paragraph>
                                    </div>

                                    <Row className="ctaContainer" justify={'center'}>
                                        <ButtonWithIcon
                                            icon={
                                                <IconSvgLocal
                                                    name={'IC_ARROW_RIGHT'}
                                                    width={26}
                                                    height={9}
                                                />
                                            }
                                            iconPosition={'end'}
                                            onClick={() => {
                                                if (!isLoggedIn) {
                                                    Cookies.set(
                                                        Constants.ROUTE_PRE_LOGIN,
                                                        JobRouteUtils.toAddScreen()
                                                    );
                                                    router.push('/login');
                                                } else {
                                                    router.push(JobRouteUtils.toAddScreen());
                                                }
                                            }}
                                        >
                                            Đăng yêu cầu ngay
                                        </ButtonWithIcon>
                                    </Row>
                                </div>
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                <div className={'featureItemContainer'}>
                                    <div className={'imageContainer'}>
                                        <Image
                                            preview={false}
                                            src={'/assets/img/home/feature/feature-4.png'}
                                            alt={'feature-4'}
                                        />
                                    </div>
                                    {isPartner ? (
                                        <>
                                            <div className="descContainer">
                                                <Typography.Title className={'featureTitle'} level={3}>
                                                    Tìm công việc tự do hoàn hảo cho tương lai
                                                </Typography.Title>
                                                <Typography.Paragraph
                                                    className={'featureTitleDescription'}
                                                >
                                                    Làm việc với những người tài năng với mức giá phải
                                                    chăng nhất để nhận được nhiều nhất ngoài thời gian và
                                                    chi phí của bạn
                                                </Typography.Paragraph>
                                            </div>
                                            <Row className="ctaContainer" justify={'center'}>
                                                <ButtonWithIcon
                                                    icon={
                                                        <IconSvgLocal
                                                            name={'IC_ARROW_RIGHT'}
                                                            width={26}
                                                            height={9}
                                                        />
                                                    }
                                                    iconPosition={'end'}
                                                    onClick={() =>
                                                        router.push(JobRouteUtils.toJobsSearchScreen({}))
                                                    }
                                                >
                                                    Ứng tuyển ngay
                                                </ButtonWithIcon>
                                            </Row>
                                        </>
                                    ) : (
                                        <>
                                            <div className="descContainer">
                                                <Typography.Title className={'featureTitle'} level={3}>
                                                    Trở thành Đối tác cung cấp dịch vụ
                                                </Typography.Title>
                                                <Typography.Paragraph
                                                    className={'featureTitleDescription'}
                                                >
                                                    Đăng ký trở thành Đối tác của iAgree để tiếp cận với
                                                    những công việc phù hợp với năng lực và mục tiêu của
                                                    bạn
                                                </Typography.Paragraph>
                                            </div>
                                            <Row className="ctaContainer" justify={'center'}>
                                                <ButtonWithIcon
                                                    icon={
                                                        <IconSvgLocal
                                                            name={'IC_ARROW_RIGHT'}
                                                            width={26}
                                                            height={9}
                                                        />
                                                    }
                                                    iconPosition={'end'}
                                                    onClick={() => {
                                                        if (!isLoggedIn) {
                                                            Cookies.set(
                                                                Constants.ROUTE_PRE_LOGIN,
                                                                PartnerRouteUtils.toRegisterUrl()
                                                            );
                                                            router.push('/login');
                                                        } else {
                                                            if (isRejectPartner)
                                                                router.push(PartnerRouteUtils.toRegisterUrl());
                                                            else
                                                                router.push(PartnerRouteUtils.toProfileUrl());
                                                        }
                                                    }}
                                                >
                                                    Gia nhập ngay
                                                </ButtonWithIcon>
                                            </Row>
                                        </>
                                    )}
                                </div>
                            </Col>
                        </FeatureListWrapper>
                    </div>
                </div>
            </section>

            {/* {statusCode !== Constants.CITIZEN_ID_STATUS.SIGNED && (
                <section className={'sectionContainer'}>
                    <div className="contentWrapper">
                        <div className="sectionContentContainer">
                            {[
                                Constants.CITIZEN_ID_STATUS.NOT_LOGIN,
                                Constants.CITIZEN_ID_STATUS.NOT_VERIFY,
                            ].includes(statusCode) && (
                                    <Row
                                        justify={'space-between'}
                                        align={'middle'}
                                        className={'serviceBanner'}
                                    >
                                        <Typography.Title className={'nm-typo'} level={4}>
                                            Xác thực tài khoản ngay để được tặng 01 lượt ký miễn phí!
                                        </Typography.Title>
                                        <Button
                                            onClick={() =>
                                                router.push(PrivacyPolicyRouteUtils.toMySignSupport())
                                            }
                                            block={!isDesktop}
                                            style={{ marginTop: !isDesktop ? '16px' : 0 }}
                                        >
                                            Xem hướng dẫn xác thực
                                        </Button>
                                    </Row>
                                )}
                            {statusCode === Constants.CITIZEN_ID_STATUS.NOT_SIGNED && (
                                <Space size={'middle'} className={'serviceBanner d-flex'}>
                                    <CheckCircleFilled
                                        style={{ color: '#09993E', fontSize: '20px' }}
                                    />
                                    <Typography.Title className={'nm-typo'} level={4}>
                                        Bạn đã nhận được 01 lượt ký miễn phí khi xác thực tài khoản
                                        bằng MySignID
                                    </Typography.Title>
                                </Space>
                            )}
                        </div>
                    </div>
                </section>
            )} */}

            {eSignByOncePackage && (
                <section className={'sectionContainer'}>
                    <div className="contentWrapper">
                        <Typography.Title className={'sectionTitle'} level={3}>
                            Giá dịch vụ ký số lẻ
                        </Typography.Title>

                        <div className="sectionContentContainer">
                            <div
                                style={{
                                    borderRadius: '10px',
                                    border: '1px solid #D4D4D4',
                                    padding: !isDesktop ? '20px 16px' : '18px 40px',
                                }}
                            >
                                <Typography.Title
                                    className={'show-mb-block'}
                                    style={{ display: 'none', marginBottom: '10px' }}
                                    level={4}
                                >
                                    Giá lượt ký lẻ
                                </Typography.Title>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: !isDesktop ? 0 : '100px',
                                    }}
                                >
                                    <Typography.Title className={'nm-typo hidden-mb'} level={4}>
                                        Giá lượt ký lẻ
                                    </Typography.Title>
                                    <Typography.Title
                                        className={'nm-typo'}
                                        level={2}
                                        style={{
                                            color: '#09993E',
                                            marginTop: 0,
                                            fontSize: !isDesktop ? '22px' : '30px',
                                        }}
                                    >
                                        {PriceUtils.format(eSignByOncePackage.price)}
                                        <span
                                            style={{
                                                fontSize: !isDesktop ? '12px' : '14px',
                                                color: '#74767E',
                                                marginLeft: !isDesktop ? '0' : '12px',
                                            }}
                                        >
                                            đồng / lượt ký
                                        </span>
                                    </Typography.Title>
                                    <ButtonWithIcon
                                        icon={
                                            <IconSvgLocal
                                                name={'IC_ARROW_RIGHT'}
                                                width={26}
                                                height={9}
                                            />
                                        }
                                        iconPosition={'end'}
                                        onClick={() =>
                                            handleClickESignPackage(
                                                eSignByOncePackage,
                                                eSignComboPackage.length
                                            )
                                        }
                                    >
                                        Đăng ký ngay
                                    </ButtonWithIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {eSignComboPackage?.length > 0 && (
                <section className={'sectionContainer'}>
                    <div className="contentWrapper">
                        <Typography.Title className={'sectionTitle'} level={3}>
                            Bảng giá dịch vụ ký số theo gói
                        </Typography.Title>

                        <div
                            className="sectionContentContainer"
                            style={{
                                position: 'relative',
                                minHeight: '274px',
                                marginTop: '60px',
                            }}
                        >
                            <div
                                className={'criteriaContainer'}
                                style={{ backgroundColor: '#E6F5EC' }}
                            >
                                <Typography.Title className={'criteriaTitle nm-typo'} level={5}>
                                    Gói Combo
                                </Typography.Title>
                            </div>
                            <div className={'criteriaContainer'}>
                                <Typography.Title className={'criteriaTitle nm-typo'} level={5}>
                                    Giá bán gói (VNĐ)
                                </Typography.Title>
                            </div>
                            <div
                                className={'criteriaContainer'}
                                style={{ backgroundColor: '#F7F7F7' }}
                            >
                                <Typography.Title className={'criteriaTitle nm-typo'} level={5}>
                                    Lượt ký số
                                </Typography.Title>
                            </div>
                            <div className={'packageList'}>
                                {eSignComboPackage.map((item, index) => (
                                    <ServiceItem
                                        key={item.packageId}
                                        data={item}
                                        eSignPackageData={eSignPackageData}
                                        onRegister={() => handleClickESignPackage(item, index)}
                                        // hideRegister={index <= currentESignServiceIndex}
                                        hideRegister={false}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </RootLayout>
    );
}

export default ServiceScreen;
