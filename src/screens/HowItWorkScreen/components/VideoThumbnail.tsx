
import { Button } from "antd";
import styles from "./VideoThumbnail.module.css";
import { ArrowUpCircle } from "lucide-react";

interface VideoThumbnailProps {
  title: string;
  onPlay: () => void;
  logoSrc?: string;
  thumbnail?: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  title,
  onPlay,
  logoSrc,
  thumbnail,
}) => {
  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: thumbnail
          ? `url(${thumbnail})`
          : `url("/assets/img/introduce/about_bg_img.png")`,
        objectFit: "cover"
      }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <Button
          type="primary"
          shape="round"
          size="large"
          className={styles.playButton}
          icon={<ArrowUpCircle className={styles.anticon} />}
          onClick={onPlay}
        >
          MỞ
        </Button>
      </div>
      {logoSrc && (
        <div className={styles.logoWrapper}>
          <img src={logoSrc} alt="Logo" className={styles.logo} />
        </div>
      )}
      {!logoSrc && (
        <div className={styles.logoWrapper}>
          <div className={styles.defaultLogo}></div>
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
