import React from 'react';
import { Button, Image, message, Typography, Upload } from 'antd';
const { Dragger } = Upload;

import { CloseOutlined } from '@ant-design/icons';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import Constants from '@/src/constants/Constants';

interface AppIDUploadProps {
    onChange?: (file: File | null) => void;
    value?: string | File | null;
    disabled?: boolean;
}

function AppIDUpload({ onChange, value, disabled }: AppIDUploadProps) {
    let previewUrl: string | undefined;

    if (typeof window !== 'undefined' && value && typeof File !== 'undefined' && value instanceof File) {
        previewUrl = URL.createObjectURL(value);
    } else if (typeof value === 'string') {
        previewUrl = value;
    }

    const handleBeforeUpload = (file: File) => {
        // Check file size (5MB limit)
        const maxFileSize = Constants.MAX_FILE_SIZE;
        if (file.size > maxFileSize) {
            message.error(`Kích thước tệp không được vượt quá ${maxFileSize / 1024 / 1024}MB`);
            return false;
        }
        
        onChange?.(file);
        return false;
    };

    return previewUrl ? (
        <div className={'idUploadPreviewContainer'}>
            <Image
                src={previewUrl}
                alt={'CCCD/CMND'}
                preview={false}
                width={'100%'}
                className={'idUploadPreviewImg'}
            />
            <Button
                onClick={() => {
                    onChange?.(null);
                }}
                icon={<CloseOutlined />}
                shape={'circle'}
                size={'small'}
                type={'primary'}
                className={'idUploadPreviewCloseBtn'}
                disabled={disabled}
            />
        </div>
    ) : (
        <Dragger
            multiple={false}
            maxCount={1}
            accept={'image/*'}
            // beforeUpload={(file) => {
            //     onChange?.(file);
            //     return false;
            // }}
            beforeUpload={handleBeforeUpload}
            showUploadList={false}
            className={'idUploadDragger'}
            disabled={disabled}
        >
            <>
                <IconSvgLocal name={'IC_IMAGE_UPLOAD'} width={59} height={59} fill={'none'} />
                <Typography.Paragraph className={'idUploadDraggerDescription nm-typo'}>Kéo & thả tệp vào đây hoặc chọn tệp</Typography.Paragraph>
            </>
        </Dragger>
    );
}

export default AppIDUpload;
