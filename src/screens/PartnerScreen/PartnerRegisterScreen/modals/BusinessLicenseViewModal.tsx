import React from 'react';
import { Modal, Button } from 'antd';

interface BusinessLicenseViewModalProps {
    isVisible: boolean;
    onClose: () => void;
    businessLicenseFile: File | null;
}

function BusinessLicenseViewModal({ isVisible, onClose, businessLicenseFile }: BusinessLicenseViewModalProps) {
    return (
        <Modal
            title="Giấy phép kinh doanh"
            open={isVisible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
            width={800}
        >
            {businessLicenseFile && (
                <div>
                    <p><strong>Tên tệp:</strong> {businessLicenseFile.name}</p>
                    <div style={{ marginTop: 16 }}>
                        <iframe
                            src={URL.createObjectURL(businessLicenseFile)}
                            width="100%"
                            height="500px"
                            style={{ border: '1px solid #d9d9d9' }}
                        />
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default BusinessLicenseViewModal; 