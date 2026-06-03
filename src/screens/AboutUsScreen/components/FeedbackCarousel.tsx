import React, { useRef, useState } from 'react';
import Slider from '@ant-design/react-slick';
import { Avatar, Button, Space, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { IconSvgLocal } from '@/src/components/icon-svg-local';
import { useBreakpoint } from '@/src/hooks/useBreakpoint';

export const FeedbackCarousel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const slider = useRef<Slider>(null);
    const { isDesktop, isMobile } = useBreakpoint();

    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        centerMode: true,
        centerPadding: isDesktop ? '0' : isMobile ? '40px': '160px',
        slidesToShow: !isDesktop ? 1 : 3,
        speed: 500,
        beforeChange: (_: number, next: number) => setActiveIndex(next),
    };

    const testimonials = [
        {
            name: 'Nguyễn Minh Quân',
            description:
                'Tôi rất hài lòng với trải nghiệm lần này, công việc mới thực sự phù hợp với định hướng và khả năng của tôi.',
            img: '/assets/img/about-us/men-1.png',
        },
        {
            name: 'Trần Khánh Linh',
            description:
                'Một trải nghiệm thật tuyệt với, tôi đã có công việc phù hợp với bản thân',
            img: '/assets/img/about-us/women-1.png',
        },
        {
            name: 'Phạm Gia Bảo',
            description:
                'Tôi cảm thấy biết ơn vì đã có cơ hội khám phá bản thân và tìm thấy công việc phù hợp hơn bao giờ hết.',
            img: '/assets/img/about-us/men-2.png',
        },
        {
            name: 'Lê Nhật Lệ',
            description:
                'Một hành trình tuyệt vời! Cuối cùng tôi cũng tìm được công việc khiến mình cảm thấy hứng thú và có giá trị.',
            img: '/assets/img/about-us/women-2.png',
        },
    ];

    return (
        <div style={{ position: 'relative' }}>
            <Space
                className={'hidden-mb'}
                style={{ position: 'absolute', top: '-86px', right: '10px' }}
            >
                <Button
                    onClick={() => {
                        slider.current?.slickPrev();
                    }}
                    shape={'circle'}
                >
                    <LeftOutlined />
                </Button>

                <Button
                    onClick={() => {
                        slider.current?.slickNext();
                    }}
                    shape={'circle'}
                >
                    <RightOutlined />
                </Button>
            </Space>
            <Slider {...settings} ref={slider} className={'aboutUsFeedbackSlider'}>
                {testimonials.map((item, index) => (
                    <div
                        key={index}
                        className={`aboutUsFeedbackSliderItem ${index === activeIndex ? 'active' : ''
                            }`}
                    >
                        <div className={'aboutUsFeedbackSliderCard'}>
                            <div className={'customerContainer'}>
                                <IconSvgLocal
                                    name={'IC_QUOTE'}
                                    fill={'#09993E'}
                                    width={48}
                                    height={48}
                                    className={'quoteIcon'}
                                />

                                <Avatar
                                    size={index === activeIndex ? 128 : 100}
                                    src={item.img}
                                    className={'customerAvatar'}
                                    alt={item.name}
                                />
                                <Typography.Paragraph strong={true} className={'customerName'}>
                                    {item.name}
                                </Typography.Paragraph>
                                <Typography.Paragraph className={'quoteText'}>
                                    {item.description}
                                </Typography.Paragraph>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};
