import React, { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { DocumentCallback } from 'react-pdf/src/shared/types';
import { PageProps } from 'react-pdf/src/Page';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import _ from 'lodash';
import Slider from '@ant-design/react-slick';
import { Button, Row, Space, Typography } from 'antd';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface RenderPageProps {
    index: number;
}

interface PDFViewerSliderProps {
    fileUrl: string;
    pageProps?: PageProps;
    renderPage?: (props: RenderPageProps) => React.ReactNode;
}

const PDFViewerSlider = (props: PDFViewerSliderProps) => {
    const pageSlider = useRef<Slider>(null);

    const { fileUrl } = props;
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(0);

    const pageSlickSettings = {
        arrows: false,
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (current: number) => setCurrentPage(current),
    };

    function onDocumentLoadSuccess({ numPages: nextNumPages }: DocumentCallback) {
        setNumPages(nextNumPages);
    }

    function renderPage(renderPageProps: RenderPageProps) {
        if (_.isFunction(props.renderPage)) {
            return props.renderPage(renderPageProps);
        }

        return (
            <Page
                pageNumber={renderPageProps.index}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                width={850}
                {...props.pageProps}
            />
        );
    }

    return (
        <div>
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                {Boolean(numPages) &&
                    <div className={'sliderPage'}>
                        <Slider ref={pageSlider} {...pageSlickSettings}>
                            {Array.from({ length: numPages }, (_, index) => {
                                const numPage = index + 1;
                                const renderPageProps = { index: numPage };

                                return (
                                    <React.Fragment key={numPage.toString()}>
                                        {renderPage(renderPageProps)}
                                    </React.Fragment>
                                );
                            })}
                        </Slider>
                    </div>
                }
            </Document>
            {Boolean(numPages) &&
                <Row justify={'center'}>
                    <Space size={48}>
                        <Button
                            onClick={() => {
                                pageSlider.current?.slickPrev();
                            }}
                            shape={'circle'}
                        >
                            <LeftOutlined />
                        </Button>
                        <Typography.Paragraph className={'nm-typo'} style={{ fontSize: '16px' }}>
                            Trang {currentPage + 1}
                        </Typography.Paragraph>
                        <Button
                            onClick={() => {
                                pageSlider.current?.slickNext();
                            }}
                            shape={'circle'}
                        >
                            <RightOutlined />
                        </Button>
                    </Space>
                </Row>
            }
        </div>
    );
};

export default PDFViewerSlider;
