import React from 'react';
import { SignUserResource } from '@/src/data/contract/models/contract.types';
import {
    Button,
    Card,
    Col,
    Descriptions,
    Image,
    List,
    Row,
    Space,
    Tooltip,
    Typography,
} from 'antd';
import dialogUtils from '@/src/utils/DialogUtils';
import datetimeUtils from '@/src/utils/DatetimeUtils';
import { useDrag } from 'react-dnd';
import { RedoOutlined } from '@ant-design/icons';
import Constants from '@/src/constants/Constants';
import _ from 'lodash';
import Images from '@/src/constants/Images';

interface SignUserItemProps {
    index: number;
    data: SignUserResource;
    onDelete: ((signUserResourcee: SignUserResource) => void) | null;
    onResendSignRequest: (signUserResourcee: SignUserResource) => void;
    // onCheckStatus: (signUserResourcee: SignUserResource) => void,
}

function SignUserItem(props: SignUserItemProps) {
    const signUserResource = props.data;

    const [{ opacity }, dragRef] = useDrag(
        () => ({
            type: 'SIGN',
            item: signUserResource,
            collect: (monitor) => ({
                opacity: monitor.isDragging() ? 0.5 : 1,
            }),
        }),
        []
    );

    return (
        <List.Item>
            <Card
                size={'small'}
                title={
                    <Typography.Title level={4} className={'nm-typo'}>
                        Người ký số {props.index + 1}
                    </Typography.Title>
                }
                className={'signItemContainer'}
                extra={
                    <Space size={'small'}>
                        {props.data.status === Constants.CONTRACT.SIGN_STATUS.EXTENSION && (
                            <Tooltip placement="topLeft" title={'Gửi yêu cầu ký trên MySign'}>
                                <Button
                                    size={'small'}
                                    type={'text'}
                                    danger={true}
                                    onClick={() => props.onResendSignRequest(signUserResource)}
                                >
                                    <RedoOutlined />
                                    Ký lại
                                </Button>
                            </Tooltip>
                        )}
                        {_.isFunction(props.onDelete) && (
                            <Button
                                size={'small'}
                                type={'text'}
                                danger={true}
                                onClick={() =>
                                    dialogUtils
                                        .showConfirmDialog('Bạn có chắc muốn xóa ?')
                                        .then(() => props.onDelete?.(signUserResource))
                                }
                            >
                                Xóa
                            </Button>
                        )}
                    </Space>
                }
            >
                <div className={'gradientView'}>
                    <Typography.Title
                        level={5}
                        style={{ fontSize: '18px', marginBottom: '15px' }}
                    >
                        {signUserResource.signName || 'Tên chưa xác định'}
                    </Typography.Title>
                    <Space size={5} direction={'vertical'} className={'d-flex'}>
                        <Row gutter={11} align={'top'} wrap={false}>
                            <Col flex={'72px'}>
                                <Typography.Paragraph
                                    style={{
                                        fontSize: '12px',
                                        marginBottom: 0,
                                        color: '#74767E',
                                    }}
                                >
                                    MySign ID
                                </Typography.Paragraph>
                            </Col>
                            <Col flex={'auto'}>
                                <Typography.Paragraph
                                    style={{ fontSize: '12px', marginBottom: 0 }}
                                >
                                    {signUserResource.identify}
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                        <Row gutter={11} align={'top'} wrap={false}>
                            <Col flex={'72px'}>
                                <Typography.Paragraph
                                    style={{
                                        fontSize: '12px',
                                        marginBottom: 0,
                                        color: '#74767E',
                                    }}
                                >
                                    Email
                                </Typography.Paragraph>
                            </Col>
                            <Col flex={'auto'}>
                                <Typography.Paragraph
                                    style={{ fontSize: '12px', marginBottom: 0 }}
                                >
                                    {signUserResource.email}
                                </Typography.Paragraph>
                            </Col>
                        </Row>
                    </Space>
                </div>
                {signUserResource.imageUrl && (
                    <div
                        //@ts-ignore
                        ref={dragRef}
                        style={{
                            opacity,
                            border: '1px solid #D4D4D4',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            marginTop: '20px',
                        }}
                    >
                        <Image
                            draggable={true}
                            src={signUserResource.imageUrl}
                            width={'100%'}
                            height={Constants.CONTRACT.SIGN_IMG_SIZE.HEIGHT}
                            preview={false}
                            fallback={Images.TEMPLATE_DEFAULT}
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                )}
                <Typography.Paragraph
                    style={{
                        fontSize: '12px',
                        marginBottom: 0,
                        marginTop: '20px',
                        color: '#74767E',
                    }}
                >
                    Tạo lúc{' '}
                    {datetimeUtils
                        .getMoment(signUserResource.lastModifiedDate)
                        ?.format(datetimeUtils.LOCAL_DATE_TIME)}
                </Typography.Paragraph>
            </Card>
        </List.Item>
    );
}

export default SignUserItem;
