import React from 'react';
import { Typography } from 'antd';
import {
    ESignPackageDataItem,
    PackageItem,
} from '@/src/data/pricing/models/pricing.types';
import PriceUtils from '@/src/utils/PriceUtils';
import { ButtonWithIcon } from '@/src/components/button';
import { IconSvgLocal } from '@/src/components/icon-svg-local';

type PricingItemProps = {
    data: PackageItem;
    eSignPackageData: ESignPackageDataItem[];
    onRegister: () => void;
    hideRegister: boolean;
};

function ServiceItem(props: PricingItemProps) {
    const { data, onRegister, eSignPackageData, hideRegister } = props;

    const serviceInfo = eSignPackageData.find(
        (item) => item.key === data.packageKeyName
    );

    return (
        <div className={'pricingItemContainer'}>
            <Typography.Paragraph
                className={'pricingItemName text-center full-width'}
            >
                {data.name}
            </Typography.Paragraph>
            <Typography.Paragraph className={'pricingItemPrice'}>
                {PriceUtils.format(data.price)}
            </Typography.Paragraph>
            <Typography.Paragraph className={'pricingItemUnit'}>
                {serviceInfo?.servicePackages.amount} {data.unit}
            </Typography.Paragraph>
            {!hideRegister && (
                <ButtonWithIcon
                    icon={<IconSvgLocal name={'IC_ARROW_RIGHT'} width={26} height={9} />}
                    iconPosition={'end'}
                    onClick={onRegister}
                    style={{ margin: '0 30px' }}
                >
                    Đăng ký ngay
                </ButtonWithIcon>
            )}
        </div>
    );
}

export default ServiceItem;
