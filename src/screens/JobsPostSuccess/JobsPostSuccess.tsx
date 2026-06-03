"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Typography } from "antd";
import { isEmpty } from "lodash";

export default function PostJobSuccessScreen({ jobId = "" }) {
  const router = useRouter();
  const delayMs = 5000;

  const redirectUrl = useMemo(
    () => (!isEmpty(jobId) ? `${jobId}` : "/jobs/management/cong-viec-da-dang"),
    [jobId]
  );

  const [msLeft, setMsLeft] = useState(delayMs);

  useEffect(() => {
    if (delayMs <= 0) {
      router.push(redirectUrl);
      return;
    }
    const started = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - started;
      const left = Math.max(0, delayMs - elapsed);
      setMsLeft(left);
      if (left <= 0) {
        clearInterval(timer);
        router.push(redirectUrl);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [delayMs, redirectUrl, router]);

  const secondsLeft = Math.ceil(msLeft / 1000);

  // Inline styles
  const styles: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100dvh",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, #ffffff 0%, #f5f7fb 100%)",
      padding: 16,
    },
    card: {
      width: "100%",
      maxWidth: 640,
      borderRadius: 16,
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      border: "1px solid #eef1f6",
    },
    center: { textAlign: "center" },
    lottieBox: { width: "100%", margin: "0 auto 8px auto" },
    muted: { color: "#667085" },
    mono: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    },
  };

  return (
    <div style={styles.page}>
      <Card style={styles.card} bodyStyle={{ padding: 24 }}>
        <div style={styles.center}>
          <div style={styles.lottieBox} aria-hidden>
            {/* <DotLottieReact
              src={"EZJDQ0cksX"}
              autoplay
              loop={false}
              style={{ width: "100%", height: "100%" }}
            /> */}
            {/* <Image
              src="assets/img/post-job-success/job-success.gif"
              alt="Funny GIF"
              width={400}
              height={400}
              unoptimized 
              loading="eager"// cần thêm để giữ nguyên animation
            /> */}
            <img
              src="/assets/img/post-job-success/job-success.gif"
              alt="Funny GIF"
              width={400}
              height={400}
              loading="eager"
            />{" "}
          </div>

          <Typography.Title level={2} style={{ marginBottom: 8 }}>
            Đăng công việc thành công!
          </Typography.Title>
          <Typography.Paragraph
            style={{ ...styles.muted, margin: "8px auto 0", maxWidth: 560 }}
          >
            Công việc đã được đăng thành công, vui lòng chờ hệ thống kiểm tra và
            duyệt đăng.
          </Typography.Paragraph>
        </div>
      </Card>
    </div>
  );
}
