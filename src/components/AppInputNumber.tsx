import React from 'react';
import { InputNumber } from 'antd';
import { InputNumberProps } from 'antd/es/input-number';

function AppInputNumber(props: InputNumberProps) {
    return (
        <InputNumber
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => (value || '').replace(/\$\s?|(,*)/g, '')}
            className={'full-width'}
            {...props}
        />
    );
}

export default AppInputNumber;
