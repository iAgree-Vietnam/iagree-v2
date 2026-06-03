import { message, Modal, Button, Space, Slider } from 'antd';
import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  visible: boolean;
  imageUrl: string;
  onCancel: () => void;
  onConfirm: (croppedImageFile: File) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  visible,
  imageUrl,
  onCancel,
  onConfirm,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5,
    });
  }, []);

  const handleCropComplete = useCallback((crop: PixelCrop) => {
    setCompletedCrop(crop);
  }, []);

  const getCroppedImg = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop, scale = 1, rotate = 0): Promise<File> => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const pixelRatio = window.devicePixelRatio;

      canvas.width = crop.width * scaleX * pixelRatio;
      canvas.height = crop.height * scaleY * pixelRatio;

      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = 'high';

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;

      const rotateRads = rotate * (Math.PI / 180);
      const centerX = image.naturalWidth / 2;
      const centerY = image.naturalHeight / 2;

      ctx.save();

      ctx.translate(-cropX, -cropY);
      ctx.translate(centerX, centerY);
      ctx.rotate(rotateRads);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);
      ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
      );

      ctx.restore();

      return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
          if (file) {
            resolve(new File([file], 'cropped-avatar.jpg', { type: 'image/jpeg' }));
          } else {
            reject(new Error('Canvas is empty'));
          }
        }, 'image/jpeg', 0.95);
      });
    },
    [],
  );

  const handleConfirm = useCallback(async () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      message.error('Vui lòng chọn vùng cắt ảnh');
      return;
    }

    try {
      const croppedImageFile = await getCroppedImg(
        imgRef.current,
        completedCrop,
        scale,
        rotate,
      );
      onConfirm(croppedImageFile);
    } catch (error) {
      console.error('Error cropping image:', error);
      message.error('Có lỗi xảy ra khi cắt ảnh');
    }
  }, [completedCrop, scale, rotate, getCroppedImg, onConfirm]);

  return (
    <Modal
      title="Chỉnh sửa ảnh đại diện"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="confirm" type="primary" onClick={handleConfirm}>
          Xác nhận
        </Button>,
      ]}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* Scale Slider Row */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '16px',
              width: '100%'
            }}>
              <span style={{ 
                minWidth: '80px',
                textAlign: 'left',
                fontSize: '14px'
              }}>
                Thu phóng:
              </span>
              <Slider
                value={scale}
                min={0.1}
                max={3}
                step={0.1}
                style={{ flex: 1 }}
                onChange={setScale}
              />
              <span style={{ 
                minWidth: '40px',
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {scale.toFixed(1)}x
              </span>
            </div>
            
            {/* Rotate Slider Row */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '16px',
              width: '100%'
            }}>
              <span style={{ 
                minWidth: '80px',
                textAlign: 'left',
                fontSize: '14px'
              }}>
                Xoay:
              </span>
              <Slider
                value={rotate}
                min={-180}
                max={180}
                step={1}
                style={{ flex: 1 }}
                onChange={setRotate}
              />
              <span style={{ 
                minWidth: '40px',
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {rotate}°
              </span>
            </div>
          </Space>
        </div>

        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={handleCropComplete}
            aspect={1} // Square crop for avatar
            circularCrop // Make it circular for avatar
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageUrl}
              style={{ 
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxWidth: '100%',
                maxHeight: 400
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        <canvas
          ref={previewCanvasRef}
          style={{
            display: 'none',
          }}
        />
      </div>
    </Modal>
  );
};