import { Button, ButtonProps } from 'antd';
import React from 'react';

interface ButtonWithIconProps extends ButtonProps { }

export const ButtonWithIcon = ({ className, ...props }: ButtonWithIconProps) => {
    return (
        <Button
            className={`btnWithIcon ${className || ''}`}
            {...props}
            icon={
                <div className={'btnIconWrapper'}>
                    <div className={'btnIconContainer'}>
                        <div className={'icon'}>{props.icon}</div>
                        <div className={'icon'}>{props.icon}</div>
                    </div>
                </div>
            }
        />
    );
};
