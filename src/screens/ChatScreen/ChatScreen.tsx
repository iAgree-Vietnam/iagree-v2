import React, { useState, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Breadcrumb, Button, Col, Input, List, Modal, Row, Space, Typography, Form, Upload } from 'antd';
import { StarFilled, UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

import RootLayout from '@/src/layouts/RootLayout';
import { ProfileContainer } from '@/src/components/ProfileContainer';
import useFetchNotification from '@/src/hooks/query/useFetchNotification';
import { NotificationItem } from '@/src/components/notifications/NotificationItem';
import { NotificationFilterParams } from '@/src/data/notification/models/notification.types';
import { useDeleteNotification } from '@/src/screens/ProfileScreen/hooks/useDeleteNotification';
import DialogUtils from '@/src/utils/DialogUtils';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
// import { useUpdateNotification } from './hooks/useUpdateNotification';
import Constants from '@/src/constants/Constants';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';
import Link from 'next/link';
import ClientConfirmContractModal, { ClientConfirmContractModalizeHelperVisible } from './modals/ClientConfirmContract';
import { useAccountContext } from '@/src/contexts/AccountContext';

interface Message {
    id: number;
    side: 'left' | 'right';
    text: string;
    // partnerId: number | null;
    userId: number | null;
}

interface Job {
    id: number;
    name: string;
    price: number;
    description: string;
    suggestion: string;
    suggestPrice: number;
    startDate: string;
    endDate: string;
}

interface Partner {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface Chat {
    id: number;
    job: Job;
    partner: Partner;
    user: User;
    messages: Message[];
}

export function ChatScreen() {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    
    const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
        form.setFieldValue('files', newFileList);
    };

    const handleSend = () => {
        const values = form.getFieldsValue();
        form.resetFields();
        setFileList([]);
    };

    const suffix = (
        <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false}
            maxCount={5}
            showUploadList={false}
            multiple={true}
        >
            <PaperClipOutlined 
                style={{
                    fontSize: 16,
                    color: '#09993E',
                    cursor: 'pointer'
                }}
            />
        </Upload>
    );

    const chats: Chat[] = [
        {
            id: 1, 
            job: {
                id: 123,
                name: 'Test Job 1',
                price: 150,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                suggestion: 'Suggestion',
                suggestPrice: 100,
                startDate: '18/06/2025',
                endDate: '30/06/2025',
            },
            partner: {
                id: 123,
                name: 'Partner 1',
            },
            user: {
                id: 145,
                name: 'Client 1',
            },
            messages: [
                {
                    id: 1,
                    side: 'left',
                    text: 'Message 1 of Job 1',
                    // partnerId: null,
                    userId: 145
                },
                {
                    id: 2,
                    side: 'right',
                    text: 'Message 2 of Job 1',
                    // partnerId: 123,
                    userId: 123
                },
                {
                    id: 3,
                    side: 'left',
                    text: 'Message 3 of Job 1',
                    // partnerId: 123,
                    userId: 123
                },
            ]
        },
        // {
        //     id: 7, 
        //     job: {
        //         id: 12,
        //         name: 'Test Job 7',
        //         price: 250,
        //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestPrice: 200
        //     },
        //     partner: {
        //         id: 56,
        //         name: 'Partner 7',
        //     },
        //     user: {
        //         id: 59,
        //         name: 'Client 2',
        //     },
        //     messages: [
        //         {
        //             id: 1,
        //             side: 'left',
        //             text: 'Message 1 of Job 1'
        //         },
        //         {
        //             id: 2,
        //             side: 'right',
        //             text: 'Message 2 of Job 1'
        //         },
        //         {
        //             id: 3,
        //             side: 'left',
        //             text: 'Message 3 of Job 1'
        //         },
        //     ]
        // },
        {
            id: 8, 
            job: {
                id: 230,
                name: 'Test Job 8',
                price: 350,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                suggestion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                suggestPrice: 300,
                startDate: '25/06/2025',
                endDate: '08/07/2025',
            },
            partner: {
                id: 8,
                name: 'Partner 8',
            },
            user: {
                id: 145,
                name: 'Client 1',
            },
            messages: [
                {
                    id: 1,
                    side: 'right',
                    text: 'Message 1 of Job 2',
                    // partnerId: 8,
                    userId: 789
                },
                {
                    id: 2,
                    side: 'left',
                    text: 'Message 2 of Job 2',
                    // partnerId: null,
                    userId: 145
                },
                {
                    id: 3,
                    side: 'right',
                    text: 'Message 3 of Job 2',
                    // partnerId: null,
                    userId: 145
                },
            ]
        },
        // {
        //     id: 9, 
        //     job: {
        //         id: 13,
        //         name: 'Test Job 9',
        //         price: 450,
        //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestPrice: 400
        //     },
        //     partner: {
        //         id: 123,
        //         name: 'Partner 1',
        //     },
        //     user: {
        //         id: 57,
        //         name: 'Client 4',
        //     },
        //     messages: [
        //         {
        //             id: 1,
        //             side: 'left',
        //             text: 'Message 1 of Job 1'
        //         },
        //         {
        //             id: 2,
        //             side: 'right',
        //             text: 'Message 2 of Job 1'
        //         },
        //         {
        //             id: 3,
        //             side: 'left',
        //             text: 'Message 3 of Job 1'
        //         },
        //     ]
        // },
        // {
        //     id: 10, 
        //     job: {
        //         id: 923,
        //         name: 'Test Job 10',
        //         price: 550,
        //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestPrice: 500
        //     },
        //     partner: {
        //         id: 178,
        //         name: 'Partner 2',
        //     },
        //     user: {
        //         id: 55,
        //         name: 'Client 1',
        //     },
        //     messages: [
        //         {
        //             id: 1,
        //             side: 'right',
        //             text: 'Message 1 of Job 2'
        //         },
        //         {
        //             id: 2,
        //             side: 'left',
        //             text: 'Message 2 of Job 2'
        //         },
        //         {
        //             id: 3,
        //             side: 'right',
        //             text: 'Message 3 of Job 2'
        //         },
        //     ]
        // },
        // {
        //     id: 11, 
        //     job: {
        //         id: 569,
        //         name: 'Test Job 11',
        //         price: 650,
        //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestPrice: 600
        //     },
        //     partner: {
        //         id: 123,
        //         name: 'Partner 1',
        //     },
        //     user: {
        //         id: 55,
        //         name: 'Client 1',
        //     },
        //     messages: [
        //         {
        //             id: 1,
        //             side: 'left',
        //             text: 'Message 1 of Job 1'
        //         },
        //         {
        //             id: 2,
        //             side: 'right',
        //             text: 'Message 2 of Job 1'
        //         },
        //         {
        //             id: 3,
        //             side: 'left',
        //             text: 'Message 3 of Job 1'
        //         },
        //     ]
        // },
        // {
        //     id: 12, 
        //     job: {
        //         id: 896,
        //         name: 'Test Job 12',
        //         price: 750,
        //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestPrice: 700
        //     },
        //     partner: {
        //         id: 178,
        //         name: 'Partner 2',
        //     },
        //     user: {
        //         id: 55,
        //         name: 'Client 1',
        //     },
        //     messages: [
        //         {
        //             id: 1,
        //             side: 'right',
        //             text: 'Message 1 of Job 2'
        //         },
        //         {
        //             id: 2,
        //             side: 'left',
        //             text: 'Message 2 of Job 2'
        //         },
        //         {
        //             id: 3,
        //             side: 'right',
        //             text: 'Message 3 of Job 2'
        //         },
        //     ]
        // },
        // {
        //     id: 13, 
        //     job: {
        //         id: 123,
        //         name: 'Test Job 13',
        //         price: 850,
        //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestPrice: 800
        //     },
        //     partner: {
        //         id: 123,
        //         name: 'Partner 1',
        //     },
        //     user: {
        //         id: 55,
        //         name: 'Client 1',
        //     },
        //     messages: [
        //         {
        //             id: 1,
        //             side: 'left',
        //             text: 'Message 1 of Job 1'
        //         },
        //         {
        //             id: 2,
        //             side: 'right',
        //             text: 'Message 2 of Job 1'
        //         },
        //         {
        //             id: 3,
        //             side: 'left',
        //             text: 'Message 3 of Job 1'
        //         },
        //     ]
        // },
        {
            id: 14, 
            job: {
                id: 923,
                name: 'Test Job 14',
                price: 950,
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                suggestion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                suggestPrice: 900,
                startDate: '02/07/2025',
                endDate: '30/07/2025',
            },
            partner: {
                id: 68,
                name: 'Partner 2',
            },
            user: {
                id: 145,
                name: 'Client 1',
            },
            messages: [
                {
                    id: 1,
                    side: 'right',
                    text: 'Message 1 of Job 2',
                    // partnerId: 178,
                    userId: 786
                },
                {
                    id: 2,
                    side: 'left',
                    text: 'Message 2 of Job 2',
                    // partnerId: 178,
                    userId: 786
                },
                {
                    id: 3,
                    side: 'right',
                    text: 'Message 3 of Job 2',
                    // partnerId: 178,
                    userId: 786
                },
            ]
        },
        // {
        //     id: 15, 
        //     job: {
        //         id: 123,
        //         name: 'Test Job 1',
        //         price: 1050,
        //         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        //         suggestPrice: 1000
        //     },
        //     partner: {
        //         id: 123,
        //         name: 'Partner 1',
        //     },
        //     user: {
        //         id: 45,
        //         name: 'Client 9',
        //     },
        //     messages: [
        //         {
        //             id: 1,
        //             side: 'right',
        //             text: 'Message 1 of Job 2'
        //         },
        //         {
        //             id: 2,
        //             side: 'left',
        //             text: 'Message 2 of Job 2'
        //         },
        //         {
        //             id: 3,
        //             side: 'right',
        //             text: 'Message 3 of Job 2'
        //         },
        //         {
        //             id: 1,
        //             side: 'right',
        //             text: 'Message 1 of Job 2'
        //         },
        //         {
        //             id: 2,
        //             side: 'left',
        //             text: 'Message 2 of Job 2'
        //         },
        //         {
        //             id: 3,
        //             side: 'right',
        //             text: 'Message 3 of Job 2'
        //         },
        //         {
        //             id: 1,
        //             side: 'right',
        //             text: 'Message 1 of Job 2'
        //         },
        //         {
        //             id: 2,
        //             side: 'left',
        //             text: 'Message 2 of Job 2'
        //         },
        //         {
        //             id: 3,
        //             side: 'right',
        //             text: 'Message 3 of Job 2'
        //         },
        //         {
        //             id: 1,
        //             side: 'right',
        //             text: 'Message 1 of Job 2'
        //         },
        //         {
        //             id: 2,
        //             side: 'left',
        //             text: 'Message 2 of Job 2'
        //         },
        //         {
        //             id: 3,
        //             side: 'right',
        //             text: 'Message 3 of Job 2'
        //         },
        //         {
        //             id: 1,
        //             side: 'right',
        //             text: 'Message 1 of Job 2'
        //         },
        //         {
        //             id: 2,
        //             side: 'left',
        //             text: 'Message 2 of Job 2'
        //         },
        //         {
        //             id: 3,
        //             side: 'right',
        //             text: 'Message 3 of Job 2'
        //         },
        //     ]
        // },
    ];

    // const chats: Chat[] = [];

    const { auth: userInfo } = useAccountContext();
    const filteredChats = chats.filter(chat => chat.user.id === userInfo?.userId);

    const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id);
    const selectedChat = filteredChats.find(chat => chat.id === selectedChatId);

    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const scrollToLast = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }

    const contractEditModalRef = useRef<ClientConfirmContractModalizeHelperVisible>(null);

    useEffect(() => {
        scrollToLast();
    }, [selectedChat?.messages, userInfo]);

    return (
        <RootLayout>
            <Head>
                <title>Tin nhắn</title>
            </Head>

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
                    { title: 'Tin nhắn' },
                    ]}
                />
                </div>
            </section>

            <section className={'sectionContainer'}>
                <div className="contentWrapper">
                    <div className="sectionContentContainer">
                        {filteredChats.length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '40px 20px',
                                background: '#f5f5f5',
                                borderRadius: '8px',
                                margin: '20px 0'
                            }}>
                                <Typography.Title level={4} style={{ marginBottom: '16px' }}>
                                    Chưa có tin nhắn nào
                                </Typography.Title>
                                <Typography.Text type="secondary">
                                    Bạn chưa có cuộc trò chuyện nào. Hãy bắt đầu một cuộc trò chuyện mới.
                                </Typography.Text>
                            </div>
                        ) : (
                            <Row style={{ height: '100%' }}>
                                <Col span={6} style={{ height: '100%', minHeight: 500, maxHeight: 750 }}>
                                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div className={'chat-sidebar-header'}>
                                            <h2>Tất cả tin nhắn</h2>
                                        </div>

                                        <div className={'list-chat'}>
                                            {
                                                filteredChats?.map(chat => (
                                                    <button 
                                                        key={chat.id}
                                                        className={'chat-job'}
                                                        onClick={() => setSelectedChatId(chat.id)}
                                                    >
                                                        {chat.job.name}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </Col>

                                <Col span={12} style={{ height: '100%', minHeight: 500, maxHeight: 750 }}>
                                    <div className={'chat-wrapper'} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <div className={'chat-sidebar-header'}>
                                            <h2>
                                                {
                                                    selectedChat?.partner.id === userInfo?.partner?.id ?
                                                        `${selectedChat?.id} - ${selectedChat?.job.name} - ${selectedChat?.user.name}` :
                                                        `${selectedChat?.id} - ${selectedChat?.job.name} - ${selectedChat?.partner.name}`
                                                }
                                                {/* {selectedChat?.id} - {selectedChat?.job.name} - {selectedChat?.partner.name} */}
                                            </h2>
                                        </div>

                                        <div className="chat-content">
                                            <div className="chat-messages" ref={chatMessagesRef}>
                                                {
                                                    selectedChat?.messages.map((msg, idx) => (
                                                        <div 
                                                            key={idx}
                                                            // className={`message message-${msg.side}`
                                                            className={`message message-${msg.userId === userInfo?.userId ? 'right':'left'}`}
                                                        >
                                                            {msg.text}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>

                                        <div>
                                            <Form form={form} onFinish={handleSend}>
                                                <Form.Item name="message" style={{ marginBottom: 0 }}>
                                                    <Space.Compact style={{ width: '100%' }}>
                                                        <Input 
                                                            placeholder='Aa' 
                                                            suffix={suffix}
                                                        />
                                                        <Button type="primary" htmlType="submit">Gửi</Button>
                                                    </Space.Compact>
                                                </Form.Item>
                                                {fileList.length > 0 && (
                                                    <div style={{ marginTop: 5, padding: '8px 12px', background: '#f5f5f5', borderRadius: 8 }}>
                                                        <Form.Item name="files">
                                                            <Upload
                                                                fileList={fileList}
                                                                onChange={handleFileChange}
                                                                beforeUpload={() => false}
                                                                maxCount={5}
                                                                multiple={true}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                )}
                                            </Form>
                                        </div>
                                    </div>
                                </Col>

                                <Col span={6} style={{ height: '100%', minHeight: 500, maxHeight: 750 }}>
                                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', lineHeight: 2 }}>
                                        {
                                            selectedChat?.partner.id === userInfo?.partner?.id ?
                                            (
                                                <><div>
                                                    <h2>
                                                        {selectedChat?.user.name}
                                                    </h2>
                                                    {/* <p><b>Vị trí công việc</b></p>
                                                    <div>
                                                        <StarFilled style={{ fontSize: '20px', color: '#09993E' }} />
                                                    </div> */}
                                                    {/* <Link href={PartnerRouteUtils.toDetailUrl(partnerResource)}>XEM HỒ SƠ ĐỐI TÁC</Link> */}
                                                    {/* {selectedChat?.partner.id != userInfo?.partner.id ? */}
                                                        {/* <Link href={'#'}>XEM HỒ SƠ ĐỐI TÁC</Link> : */}
                                                        {/* <Link href={'#'}>XEM THÔNG TIN CÔNG VIỆC</Link>
                                                    } */}
                                                </div>
        
                                                <div 
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: 8,
                                                        padding: 12,
                                                        margin: '16px 0'
                                                    }}
                                                >
                                                    <div>
                                                        <b>
                                                            {selectedChat?.job.name}
                                                        </b>
                                                    </div>
                                                    <div>
                                                        Thời gian: {selectedChat?.job.startDate} - {selectedChat?.job.endDate}
                                                    </div>
                                                    {/* <b>THÔNG TIN CÔNG VIỆC</b> */}
                                                    <div style={{ fontSize: 14, color: '#555', height: 100, overflowY: 'auto' }}>
                                                        {selectedChat?.job.description}
                                                    </div>
                                                </div>
                                                <div 
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: 8,
                                                        padding: 12,
                                                        marginBottom: 16
                                                    }}
                                                >
                                                    <b>GIÁ ĐỀ XUẤT:</b> {selectedChat?.job.suggestPrice}
                                                </div>
                                                <div 
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: 8,
                                                        padding: 12,
                                                        marginBottom: 16
                                                    }}
                                                >
                                                    <b>ĐỀ XUẤT:</b>
                                                    <div style={{ fontSize: 14, color: '#555', height: 100, overflowY: 'auto' }}>
                                                        {selectedChat?.job.suggestion}
                                                    </div>
                                                </div>
                                                <div>
                                                    {/* {selectedChat?.partner.id === userInfo?.partner.id ?
                                                        (
                                                            <Button className={'agree-btn'} style={{ marginLeft: 5 }}>Xem đề xuất</Button>
                                                        ) : ( */}
                                                            <><Button className={'disagree-btn'}>Từ chối</Button>
                                                            <Button 
                                                                className={'agree-btn'} 
                                                                onClick={() =>
                                                                    contractEditModalRef.current?.open({
                                                                        ...selectedChat!,
                                                                        job: {
                                                                            ...selectedChat!.job,
                                                                            suggest_price: selectedChat!.job.suggestPrice
                                                                        }
                                                                    })
                                                                }
                                                            >Xác nhận</Button>
                                                            <ClientConfirmContractModal ref={contractEditModalRef} /></>
                                                        {/* )
                                                    } */}
                                                </div></>
                                            ) : (
                                                <><div>
                                                    <h2>
                                                        {selectedChat?.partner.name}
                                                    </h2>
                                                    <p><b>Vị trí công việc</b></p>
                                                    <div>
                                                        <StarFilled style={{ fontSize: '20px', color: '#09993E' }} />
                                                    </div>
                                                    {/* <Link href={PartnerRouteUtils.toDetailUrl(partnerResource)}>XEM HỒ SƠ ĐỐI TÁC</Link> */}
                                                    {/* {selectedChat?.partner.id != userInfo?.partner.id ? */}
                                                        <Link href={'#'}>XEM HỒ SƠ ĐỐI TÁC</Link> :
                                                        {/* <Link href={'#'}>XEM THÔNG TIN CÔNG VIỆC</Link>
                                                    } */}
                                                </div>
        
                                                <div 
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: 8,
                                                        padding: 12,
                                                        margin: '16px 0'
                                                    }}
                                                >
                                                    <div>
                                                        <b>
                                                            {selectedChat?.job.name}
                                                        </b>
                                                    </div>
                                                    {/* <b>THÔNG TIN CÔNG VIỆC</b> */}
                                                    <div style={{ fontSize: 14, color: '#555', height: 100, overflowY: 'auto' }}>
                                                        {selectedChat?.job.description}
                                                    </div>
                                                </div>
                                                <div 
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: 8,
                                                        padding: 12,
                                                        marginBottom: 16
                                                    }}
                                                >
                                                    <b>GIÁ ĐỐI TÁC ĐỀ XUẤT:</b> {selectedChat?.job.suggestPrice}
                                                </div>
                                                <div 
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        borderRadius: 8,
                                                        padding: 12,
                                                        marginBottom: 16
                                                    }}
                                                >
                                                    <b>ĐỐI TÁC ĐỀ XUẤT:</b>
                                                    <div style={{ fontSize: 14, color: '#555', height: 100, overflowY: 'auto' }}>
                                                        {selectedChat?.job.suggestion}
                                                    </div>
                                                </div>
                                                <div>
                                                    {/* {selectedChat?.partner.id === userInfo?.partner.id ?
                                                        (
                                                            <Button className={'agree-btn'} style={{ marginLeft: 5 }}>Xem đề xuất</Button>
                                                        ) : ( */}
                                                            <><Button className={'disagree-btn'}>Từ chối</Button>
                                                            <Button 
                                                                className={'agree-btn'} 
                                                                onClick={() =>
                                                                    contractEditModalRef.current?.open({
                                                                        ...selectedChat!,
                                                                        job: {
                                                                            ...selectedChat!.job,
                                                                            suggest_price: selectedChat!.job.suggestPrice
                                                                        }
                                                                    })
                                                                }
                                                            >Xác nhận</Button>
                                                            <ClientConfirmContractModal ref={contractEditModalRef} /></>
                                                        {/* )
                                                    } */}
                                                </div></>
                                            )
                                        }

                                        {/* <div>
                                            <h2>
                                                {
                                                    selectedChat?.partner.id === userInfo?.partner.id ? 
                                                        selectedChat?.user.name :
                                                        selectedChat?.partner.name
                                                }
                                                {selectedChat?.partner.name}
                                            </h2>
                                            <p><b>Vị trí công việc</b></p>
                                            <div>
                                                <StarFilled style={{ fontSize: '20px', color: '#09993E' }} />
                                            </div>
                                            <Link href={PartnerRouteUtils.toDetailUrl(partnerResource)}>XEM HỒ SƠ ĐỐI TÁC</Link>
                                            <Link href={'#'}>XEM HỒ SƠ ĐỐI TÁC</Link>
                                        </div>

                                        <div 
                                            style={{
                                                border: '1px solid #ccc',
                                                borderRadius: 8,
                                                padding: 12,
                                                margin: '16px 0'
                                            }}
                                        >
                                            <div>
                                                <b>
                                                    {selectedChat?.job.name}
                                                </b>
                                            </div>
                                            <b>THÔNG TIN CÔNG VIỆC</b>
                                            <div style={{ fontSize: 14, color: '#555', height: 100, overflowY: 'auto' }}>
                                                {selectedChat?.job.description}
                                            </div>
                                        </div>
                                        <div 
                                            style={{
                                                border: '1px solid #ccc',
                                                borderRadius: 8,
                                                padding: 12,
                                                marginBottom: 16
                                            }}
                                        >
                                            <b>GIÁ ĐỐI TÁC ĐỀ XUẤT:</b> {selectedChat?.job.suggestPrice}
                                        </div>
                                        <div 
                                            style={{
                                                border: '1px solid #ccc',
                                                borderRadius: 8,
                                                padding: 12,
                                                marginBottom: 16
                                            }}
                                        >
                                            <b>ĐỐI TÁC ĐỀ XUẤT:</b>
                                            <div style={{ fontSize: 14, color: '#555', height: 100, overflowY: 'auto' }}>
                                                {selectedChat?.job.suggestion}
                                            </div>
                                        </div>
                                        <div>
                                            {selectedChat?.partner.id === userInfo?.partner.id ?
                                                (
                                                    <Button className={'agree-btn'} style={{ marginLeft: 5 }}>Xem đề xuất</Button>
                                                ) : (
                                                    <><Button className={'disagree-btn'}>Từ chối</Button>
                                                    <Button 
                                                        className={'agree-btn'} 
                                                        onClick={() =>
                                                            contractEditModalRef.current?.open(
                                                                selectedChat!
                                                            )
                                                        }
                                                    >Xác nhận</Button>
                                                    <ClientConfirmContractModal ref={contractEditModalRef} /></>
                                                )
                                            }
                                        </div> */}
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </div>
                </div>
            </section>
        </RootLayout>
    );
}
