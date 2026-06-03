import { Button, ButtonProps } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router';

export default function BackButton(props: ButtonProps) {
  const router = useRouter();

  return (
    <Button
      size={'small'}
      onClick={() => router.back()}
      type={'text'}
      icon={<ArrowLeftOutlined />}
      {...props}
    >
      Quay lại
    </Button>
  );
}
