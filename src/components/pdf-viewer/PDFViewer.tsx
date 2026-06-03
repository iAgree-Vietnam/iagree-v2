import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
type DocumentCallback = { numPages: number };
type PageProps = { pageNumber?: number; width?: number; scale?: number; className?: string; style?: React.CSSProperties; };
import _ from 'lodash';

// Use unpkg CDN for better reliability
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface RenderPageProps {
    index: number;
}

interface PDFViewerProps {
    fileUrl: string;
    pageProps?: PageProps,
    renderPage?: (props: RenderPageProps) => React.ReactNode,
}

export default function PDFViewer(props: PDFViewerProps) {
    const { fileUrl } = props;
    const [numPages, setNumPages] = useState<number>(0);
    const [error, setError] = useState<Error | null>(null);

    function onDocumentLoadSuccess({ numPages: nextNumPages }: DocumentCallback) {
        setError(null);
        setNumPages(nextNumPages);
    }

    function onDocumentLoadError(error: Error) {
        console.error('Error loading PDF:', error);
        setError(error);
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

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
                Failed to load PDF file. Please try again later.
            </div>
        );
    }

    return (
        <div>
            <div>
                <Document 
                    file={fileUrl} 
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            Loading PDF...
                        </div>
                    }
                >
                    {Array.from({ length: numPages }, (_, index) => {
                        const numPage = index + 1;
                        const renderPageProps = { index: numPage };

                        return (
                            <React.Fragment key={numPage.toString()}>
                                {renderPage(renderPageProps)}
                            </React.Fragment>
                        );
                    })}
                </Document>
            </div>
        </div>
    );
}
