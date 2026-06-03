import React, { useEffect, useState, useRef } from 'react';
import { SignatureOutputResource } from '@/src/data/contract/models/contract.types';
import { useDrag } from 'react-dnd';
import { Image } from 'antd';
import Constants from '@/src/constants/Constants';

interface SignatureImageCanvasProps {
    data: SignatureOutputResource;
    onResize: (id: string | undefined, width: number, height: number) => void;
}

function SignatureImageCanvas(props: SignatureImageCanvasProps) {

    const { data, onResize } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
    const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
    
    // Default sizes from Constants
    const defaultWidth = Constants.CONTRACT.SIGN_IMG_SIZE.WIDTH;
    const defaultHeight = Constants.CONTRACT.SIGN_IMG_SIZE.HEIGHT;

    // Store the aspect ratio as a constant
    const aspectRatio = defaultWidth / defaultHeight;
    
    // Initialize size state with data values, falling back to defaults
    const [size, setSize] = useState({
        width: data.width || defaultWidth,
        height: data.height || defaultHeight
    });

    // Create a callback to update the parent component when the signature is moved or resized
    const updateParentData = (newWidth: number, newHeight: number) => {
        if (data.uniqueId) {
            onResize(data.uniqueId, newWidth, newHeight);
        }
    };

    // Pass the CURRENT size with the dragged item and make sure it's preserved
    const [{ opacity }, dragRef] = useDrag(() => ({
        type: 'SIGN',
        item: () => {
            // Always ensure we're passing the current size at the moment of drag
            return {
                ...data,
                width: size.width,
                height: size.height
            };
        },
        end: (item, monitor) => {
            // When drag ends, ensure the size is updated in the parent
            const dropResult = monitor.getDropResult();
            if (dropResult && item) {
                // Explicitly ensure the parent component knows about the current size
                updateParentData(size.width, size.height);
            }
        },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.5 : 1,
        }),
    }), [data, size.width, size.height, updateParentData]);

    // Update local size state when props change
    useEffect(() => {
        // Only update if the data actually has width/height values
        // This prevents resetting to default when data changes but size values aren't provided
        if (data.width && data.height) {
            setSize({
                width: data.width,
                height: data.height
            });
        }
    }, [data.width, data.height]);

    const handleResizeStart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setInitialPos({ x: e.clientX, y: e.clientY });
        setInitialSize({ width: size.width, height: size.height });

        // Set resizing state to true
        setIsResizing(true);
    };
    
    const handleResizeMove = React.useCallback((e: MouseEvent) => {
        if (!isResizing) return;
        
        // Calculate new width and height based on mouse movement
        const deltaX = (e.clientX - initialPos.x) * 0.5;
        
        // Keep aspect ratio while resizing
        const newWidth = Math.max(
            defaultWidth * 0.5,  // Minimum width (half of default)
            Math.min(
                defaultWidth * 3, // Maximum width (3x default)
                initialSize.width + deltaX
            )
        );

        const newHeight = newWidth / aspectRatio;
        
        setSize({ width: newWidth, height: newHeight });
    }, [isResizing, initialPos.x, initialSize.width, defaultWidth, aspectRatio]);
    
    const handleResizeEnd = React.useCallback((e: MouseEvent) => {
        if (!isResizing) return;

        // Calculate final dimensions before removing event listeners
        const deltaX = (e.clientX - initialPos.x) * 0.5;

        const finalWidth = Math.max(
            defaultWidth * 0.5,
            Math.min(
                defaultWidth * 3,
                initialSize.width + deltaX
            )
        );
        
        const finalHeight = finalWidth / aspectRatio;

        // Reset resizing state
        setIsResizing(false);

        // Update local state first to prevent flickering
        setSize({
            width: finalWidth,
            height: finalHeight
        });
        
        // Notify parent component of the resize
        updateParentData(finalWidth, finalHeight);
    }, [isResizing, initialPos.x, initialSize.width, aspectRatio, defaultWidth, updateParentData]);

    // Function to handle global mouseup
    const globalMouseUpHandler = React.useCallback((e: MouseEvent) => {
        if (isResizing) {
            handleResizeEnd(e);
        }
    }, [isResizing, handleResizeEnd]);

    // Add and remove global event listeners
    useEffect(() => {
        // Only add the global mouseup listener when isResizing is true
        if (isResizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', globalMouseUpHandler);
        }
        
        // Clean up event listeners when component unmounts or isResizing changes
        return () => {
            document.removeEventListener('mousemove', handleResizeMove);
            document.removeEventListener('mouseup', globalMouseUpHandler);
        };
    }, [isResizing, handleResizeMove, globalMouseUpHandler]);

    return (
        <div
            //@ts-ignore
            ref={dragRef}
            style={{
                zIndex: 100,
                position: 'absolute',
                top: data.y,
                left: data.x,
                width: `${size.width}px`,
                height: `${size.height}px`,
                opacity,
            }}
        >
            <Image
                src={data.imageUrl}
                width={size.width}
                height={size.height}
                preview={false}
                fallback={'https://via.placeholder.com/200x100.png/a59090/a59090'}
                style={{ objectFit: 'contain' }}
            />

            {/* Resize handle - bottom right corner */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '14px',
                    height: '14px',
                    background: 'rgba(0, 123, 255, 0.7)',
                    border: '2px solid white',
                    borderRadius: '2px',
                    cursor: 'nwse-resize',
                    zIndex: 101
                }}
                onMouseDown={handleResizeStart}
            />
        </div>
    );
}

export default SignatureImageCanvas;