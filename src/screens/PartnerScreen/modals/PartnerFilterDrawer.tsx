/* eslint-disable import/no-unused-modules */
import React, { useCallback, useImperativeHandle, useState } from 'react';
import { Drawer } from 'antd';

 type PartnerFilterDrawerReturn = {
    open: () => void,
    close: () => void,
}

const PartnerFilterDrawer = React.forwardRef((props, ref) => {

    const [isVisible, setIsVisible] = useState<any>(false);

    const open = useCallback(() => setIsVisible(true), [setIsVisible]);
    const close = useCallback(() => setIsVisible(false), [setIsVisible]);

    useImperativeHandle(ref, useCallback(() => ({open, close}), [open, close]));

    return (
        <Drawer
            width={'85%'}
            title={'Lựa chọn'}
            // visible={isVisible as any}
            onClose={close}
            placement={'left'}
        >
            {/*<PartnerFilterSection/>*/}
        </Drawer>
    );
});

PartnerFilterDrawer.displayName = 'PartnerFilterDrawer';

export default PartnerFilterDrawer;
