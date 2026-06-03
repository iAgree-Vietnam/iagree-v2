import React, { useMemo, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Page } from 'react-pdf';
import { PageProps } from 'react-pdf/src/Page';
import { Typography } from 'antd';
import { SignatureOutputResource, SignUserResource } from '@/src/data/contract/models/contract.types';
import SignatureImageCanvas from '@/src/screens/ContractScreen/modals/components/SignatureImageCanvas';

export type DropParams = {
    pageNumber: number;
    item: SignUserResource,
    monitor: any,
    coordinates: {
        x: number,
        y: number,
    },
    // pageHeight: number,
}

type DroppablePageProps = {
    pageProps: PageProps;
    signatures: SignatureOutputResource[];
    onDrop: (dropParams: DropParams) => void;
    onSignatureResize: (id: string | undefined, width: number, height: number) => void;
};

export const DroppablePage = (props: DroppablePageProps) => {

    const { pageProps, signatures, onDrop, onSignatureResize } = props;
    const pageWrapperRef = useRef<HTMLDivElement>(null);

    const pageSignatures = useMemo(() => signatures.filter((item) => item.pageNumber === pageProps.pageNumber), [signatures]);

    const [dropProps, drop] = useDrop(() => ({
        accept: 'SIGN',
        collect: (monitor) => ({ isOver: monitor.isOver() }),
        drop: (item, monitor) => {
            const elementRect = monitor.getSourceClientOffset();
            const pageWrapperRect = pageWrapperRef.current?.getBoundingClientRect();

            const xRelative = Number(elementRect?.x) - Number(pageWrapperRect?.x);
            const yRelative = Number(elementRect?.y) - Number(pageWrapperRect?.y);

            const dropParams = {
                pageNumber: pageProps.pageNumber as number,
                item: item as SignUserResource,
                monitor,
                coordinates: {
                    x: xRelative,
                    y: yRelative,
                },
                // pageHeight: Number(pageWrapperRect?.height),
            };

            onDrop(dropParams);
        },
    }));

    return (
        <div ref={pageWrapperRef}>
            {/* @ts-ignore */}
            <div ref={drop} style={{ position: 'relative' }}>
                <Page
                    pageNumber={pageProps.pageNumber}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    {...pageProps}
                >
                    <div className={'dropablePlaceholderContainer'}>
                        {dropProps.isOver && (
                            <div className={'dropablePlaceholder'}>
                                <Typography.Text>Thả để thêm chữ ký</Typography.Text>
                            </div>
                        )}
                    </div>

                    <>
                        {pageSignatures.map((signatureOutputResource) => {
                            return (
                                <SignatureImageCanvas
                                    key={[signatureOutputResource.pageNumber, signatureOutputResource.uniqueId].join('_')}
                                    data={signatureOutputResource}
                                    onResize={onSignatureResize}
                                />
                            );
                        })}
                    </>
                </Page>
            </div>


        </div>
    );
};
