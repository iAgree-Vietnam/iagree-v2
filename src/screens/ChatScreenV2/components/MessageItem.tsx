"use client";

import { forwardRef, memo, useMemo, useState } from "react";
import {
  FileText,
  ImageIcon,
  Video,
  File,
  Download,
  Reply, // icon reply
} from "lucide-react";
import { Button, Typography, Tooltip, Tag, Modal, Avatar } from "antd";
import {
  ChatRoomInfoResource,
  MessageItemsResource,
} from "@/src/data/message/models/message.types";
import moment from "moment";
import { useAccountContext } from "@/src/contexts/AccountContext";
import Images from "@/src/constants/Images";
import { ModalPreviewUrl } from "./ModalPreviewUrl";

/* ===================== Types ===================== */
interface MessageAttachment {
  id?: string;
  name?: string;
  size?: number;
  type?: string;
  url?: string;
  message_id?: string;
  file_name?: string;
  file_name_original?: string;
  file_path?: string;
}

interface MessageItemProps {
  chat: ChatRoomInfoResource;
  message: MessageItemsResource;
  isCurrentUser: boolean;
  partnerName: string | undefined;
  isInOverlay?: boolean;
  onOverlayMessageClick?: (messageId: string) => void;
  onReply?: (message: MessageItemsResource, userName: string) => void;
  currentUserId: number;
  onScrollToMessage?: (messageId: string) => void;
  avatar?: string;
  getDetailReply: (messId: string) => void;
  selectedChatFromList: any;
}

/* ===================== Helpers ===================== */
const fmtSize = (bytes?: number) => {
  if (!bytes || bytes <= 0) return "";
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const getExt = (nameOrUrl?: string) => {
  if (!nameOrUrl) return "";
  const q = nameOrUrl.split("?")[0].split("#")[0];
  const parts = q.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
};

const isPreviewImgExt = (ext?: string) =>
  ["png", "jpg", "jpeg"].includes((ext || "").toLowerCase());

const isImageExtAny = (ext?: string) =>
  ["png", "jpg", "jpeg", "gif", "webp", "bmp"].includes(
    (ext || "").toLowerCase()
  );

const isVideoExt = (ext?: string) =>
  ["mp4", "webm", "ogg"].includes((ext || "").toLowerCase());

const OFFICE_EXTS = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"];

const getKind = (mime?: string, ext?: string) => {
  if (mime?.startsWith("image/") || isImageExtAny(ext)) return "image";
  if (mime?.startsWith("video/") || isVideoExt(ext)) return "video";
  if (mime?.includes("pdf") || ext === "pdf") return "pdf";
  if (OFFICE_EXTS.includes(ext || "")) return "office";
  if (["txt", "rtf", "odt", "md"].includes(ext || "")) return "doc";
  if (["csv"].includes(ext || "")) return "sheet";
  return "file";
};

const getIcon = (kind: string, size = 22) => {
  switch (kind) {
    case "image":
      return <ImageIcon size={size} style={{ color: "#52c41a" }} />;
    case "video":
      return <Video size={size} style={{ color: "#722ed1" }} />;
    case "pdf":
      return <FileText size={size} style={{ color: "#ff4d4f" }} />;
    case "office":
    case "doc":
      return <FileText size={size} style={{ color: "#1677ff" }} />;
    case "sheet":
      return <FileText size={size} style={{ color: "#13c2c2" }} />;
    default:
      return <File size={size} style={{ color: "#8c8c8c" }} />;
  }
};

const normalizeAttachments = (rawList: any): MessageAttachment[] => {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((raw) => {
    const rawUrl = raw?.file_path ?? raw?.url ?? "";
    const name =
      raw?.file_name_original ??
      raw?.name ??
      raw?.file_name ??
      (rawUrl.split("/").pop() || "Tệp đính kèm");
    const ext = getExt(name || rawUrl);
    const type = raw?.type ?? (ext ? `application/${ext}` : undefined);

    return {
      id: raw?.id ?? raw?.message_id ?? rawUrl,
      name,
      size: raw?.size,
      type,
      url: rawUrl,
      message_id: raw?.message_id,
      file_name: raw?.file_name,
      file_name_original: raw?.file_name_original,
      file_path: raw?.file_path ?? rawUrl,
    } as MessageAttachment;
  });
};

const ensureAbsolute = (u?: string) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return u;
};

// ===== helpers download =====
const inferFileName = (att: MessageAttachment) => {
  const n =
    att.name ||
    att.file_name_original ||
    att.file_name ||
    att.url ||
    att.file_path ||
    "download";
  return String(n).split("?")[0].split("#")[0].split("/").pop() || "download";
};

const downloadUrl = async (url: string, filename?: string) => {
  try {
    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const obj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = obj;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(obj);
  } catch (e) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

const downloadAttachment = (att: MessageAttachment) => {
  const abs = ensureAbsolute(att.url || att.file_path);
  downloadUrl(abs, inferFileName(att));
};

/* ===================== Component ===================== */
export const MessageItem1 = forwardRef<HTMLDivElement, MessageItemProps>(
  (
    {
      chat,
      message,
      isCurrentUser,
      partnerName,
      isInOverlay = false,
      onOverlayMessageClick,
      onReply,
      currentUserId,
      onScrollToMessage,
      avatar,
      getDetailReply,
      selectedChatFromList,
    },
    ref
  ) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [previewTitle, setPreviewTitle] = useState<string>("Xem ảnh");

    // === state cho time: hover -> show, click -> toggle show ===
    const [tsOpen, setTsOpen] = useState(false); // click để giữ hiện
    const [hovered, setHovered] = useState(false); // hover để hiện tạm

    const attachments = useMemo(
      () => normalizeAttachments((message as any)?.attachments),
      [message]
    );
    const images = attachments.filter((a) =>
      ["image"].includes(getKind(a.type, getExt(a.name || a.url)))
    );
    const nonImages = attachments.filter(
      (a) => !["image"].includes(getKind(a.type, getExt(a.name || a.url)))
    );

    const content: string = (message as any)?.content ?? "";
    const hasContent = typeof content === "string" && content.trim().length > 0;

    const openImageOrBlank = (att: MessageAttachment) => {
      const ext = getExt(att.name || att.url);
      const abs = ensureAbsolute(att.url || att.file_path);
      if (isPreviewImgExt(ext)) {
        setPreviewTitle(att.name || "Xem ảnh");
        setPreviewUrl(abs);
        setPreviewOpen(true);
      } else {
        window.open(abs, "_blank", "noopener,noreferrer");
      }
    };

    const openFileBlank = (att: MessageAttachment) => {
      const abs = ensureAbsolute(att.url || att.file_path);
      window.open(abs, "_blank", "noopener,noreferrer");
    };

    /* ------------------ Attachment UI ------------------ */
    const ImageGrid = ({ list }: { list: MessageAttachment[] }) => {
      const max = 4;
      const show = list.slice(0, max);
      const extra = list.length - max;
      return (
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(show.length, 2)}, 1fr)`,
              gap: 6,
              maxWidth: 420,
            }}
          >
            {show.map((att, idx) => {
              const href = ensureAbsolute(att.url || att.file_path);
              const title = att.name || "Ảnh";
              return (
                <div
                  key={String(att.id ?? href)}
                  onClick={() => openImageOrBlank(att)}
                  style={{
                    position: "relative",
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "1px solid #eaeaea",
                    cursor: "pointer",
                  }}
                  title={title}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={href}
                    alt={title}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                  {/* Nút tải */}
                  <Button
                    size="small"
                    icon={<Download size={14} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadAttachment(att);
                    }}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "rgba(255,255,255,.9)",
                      borderRadius: 999,
                    }}
                  />
                  {idx === max - 1 && extra > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,.45)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      +{extra}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const FileCard = ({ att }: { att: MessageAttachment }) => {
      const ext = getExt(att.name || att.url);
      const kind = getKind(att.type, ext);
      const title = att.name || "Tệp đính kèm";

      const truncateFileName = (fileName: string, maxLength: number = 20) => {
        if (fileName.length <= maxLength) return fileName;

        const lastDotIndex = fileName.lastIndexOf(".");

        if (lastDotIndex === -1) {
          return fileName.substring(0, maxLength) + "...";
        }

        const nameWithoutExt = fileName.substring(0, lastDotIndex);
        const extension = fileName.substring(lastDotIndex);

        if (nameWithoutExt.length > maxLength - 3) {
          return nameWithoutExt.substring(0, maxLength - 3) + "..." + extension;
        }

        return fileName;
      };

      const displayTitle = truncateFileName(title);

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            backgroundColor: "#fafafa",
            borderRadius: 12,
            border: "1px solid #eee",
            marginBottom: 8,
            cursor: "pointer",
          }}
          title={title}
          onClick={() => openFileBlank(att)}
        >
          <div
            style={{
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
            }}
          >
            {getIcon(kind, 20)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Typography.Text
              style={{
                fontSize: 14,
                fontWeight: 600,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayTitle}
            </Typography.Text>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Tag color="default">{ext ? ext.toUpperCase() : "FILE"}</Tag>
              {!!att.size && (
                <Typography.Text style={{ fontSize: 12, color: "#666" }}>
                  {fmtSize(att.size)}
                </Typography.Text>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                openFileBlank(att);
              }}
            >
              Mở
            </Button>
            <Button
              size="small"
              icon={<Download size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                downloadAttachment(att);
              }}
            />
          </div>
        </div>
      );
    };

    const AttachmentsView = () => {
      if (attachments.length === 0) return null;
      return (
        <>
          {images.length > 0 && <ImageGrid list={images} />}
          {nonImages.length > 0 && (
            <div style={{ marginTop: images.length ? 10 : 8, maxWidth: 480 }}>
              {nonImages.map((att) => (
                <FileCard key={String(att.id ?? att.url)} att={att} />
              ))}
            </div>
          )}
        </>
      );
    };

    // ======== Replied Box (hiển thị tin gốc) ========
    const RepliedBox = () => {
      const replied: any =
        (message as any)?.replyMessage ||
        (message as any)?.reply_of ||
        (message as any)?.repliedMessage ||
        null;

      if (!replied) return null;

      const repliedUser =
        replied?.sender?.name ||
        replied?.user?.name ||
        (replied?.senderId === currentUserId
          ? "Bạn"
          : partnerName || "Người dùng");

      const repliedText =
        (typeof replied?.content === "string" && replied?.content.trim()) ||
        (Array.isArray(replied?.attachments) && replied.attachments.length > 0
          ? "(Tệp đính kèm)"
          : "(Không có nội dung)");

      return (
        <div
          style={{
            marginBottom: 8,
            padding: "8px 10px",
            borderLeft: `3px solid ${isCurrentUser ? "#bae7ff" : "#91d5ff"}`,
            background: isCurrentUser ? "#f5faff" : "#f0faff",
            borderRadius: 8,
            cursor: onScrollToMessage && replied?.id ? "pointer" : "default",
          }}
          title="Xem tin nhắn gốc"
          onClick={(e) => {
            e.stopPropagation();
            if (onScrollToMessage && replied?.id) onScrollToMessage(replied.id);
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#8c8c8c",
              marginBottom: 4,
              fontWeight: 600,
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            Đang trả lời {repliedUser}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#595959",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 360,
            }}
          >
            {repliedText}
          </div>
        </div>
      );
    };

    const timeText = moment(
      (message as any)?.sendingAt ?? (message as any)?.createdAt
    ).format("HH:mm DD/MM/YYYY");
    const { auth: fullProfileResource } = useAccountContext();

    const avat =
      fullProfileResource?.partner?.id === chat?.infoDetail?.partnerId
        ? selectedChatFromList?.infoDetail?.clientAvatar
        : selectedChatFromList?.infoDetail?.partnerAvatar;

    // hiển thị time khi hover OR khi đã click mở
    const showTime = hovered || tsOpen;

    return (
      <>
        <div
          ref={ref}
          style={{
            display: "flex",
            justifyContent: isCurrentUser ? "flex-end" : "flex-start",
            alignItems: "flex-start",
            gap: "8px",
            cursor: isInOverlay ? "pointer" : "default",
            padding: isInOverlay ? "12px" : "0",
            borderRadius: isInOverlay ? "6px" : "0",
            backgroundColor: isInOverlay
              ? "rgba(255, 255, 255, 0.8)"
              : "transparent",
            border: isInOverlay ? "1px solid #e8e8e8" : "none",
            transition: "all 0.2s ease",
            position: "relative",
          }}
          onClick={
            isInOverlay && onOverlayMessageClick
              ? () => onOverlayMessageClick((message?.id as any) ?? "")
              : undefined
          }
          onMouseEnter={
            isInOverlay
              ? (e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.95)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)";
                }
              : undefined
          }
          onMouseLeave={
            isInOverlay
              ? (e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.8)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              : undefined
          }
        >
          {!isCurrentUser && (
            <div style={{ position: "relative" }}>
              <Avatar
                src={avat || Images.ACCOUNT_DEFAULT}
                size={32}
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#666",
                  flexShrink: 0,
                  fontWeight: "bold",
                }}
              >
                {partnerName ? partnerName.charAt(0).toUpperCase() : null}
              </Avatar>
            </div>
          )}

          <div
            // Click vùng message chỉ toggle time; KHÔNG gọi onReply ở đây
            onClick={() => setTsOpen((v) => !v)}
            style={{
              maxWidth: isInOverlay ? "80%" : "70%",
              position: "relative",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Bubble */}
            <div
              style={{
                backgroundColor: isCurrentUser ? "#09993E" : "#f0f0f0",
                color: isCurrentUser ? "#fff" : "#333",
                padding: "12px 16px",
                borderRadius: 10,
              }}
            >
              {/* ✅ Hiển thị reply-to nếu có */}
              <RepliedBox />

              <AttachmentsView />
              {hasContent && (
                <div
                  style={{
                    marginTop: 8,
                    wordBreak: "break-word",
                    whiteSpace: "pre-line"
                  }}
                >
                  {content}
                </div>
              )}
            </div>

            {/* Nút Reply (chỉ hiện khi hover) */}
            <Button
              size="small"
              icon={<Reply size={14} />}
              style={{
                position: "absolute",
                top: 4,
                right: isCurrentUser ? "calc(100% + 8px)" : undefined,
                left: !isCurrentUser ? "calc(100% + 8px)" : undefined,
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateY(0)" : "translateY(-2px)",
                transition: "all 0.5s ease",
                padding: "2px 8px",
                borderRadius: 999,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onReply) {
                  const userName = isCurrentUser ? "bạn" : partnerName;
                  onReply(message, userName!);
                }
                // nếu muốn load thread ngay sau khi bấm Reply:
                getDetailReply?.(message.id);
              }}
              title="Reply"
            />

            {/* TimeText: opacity điều khiển bởi hover/click */}
            <Tooltip title={timeText}>
              <div
                style={{
                  opacity: showTime ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  fontSize: 12,
                  color: "#999",
                  marginTop: 4,
                  userSelect: "none",
                }}
              >
                {timeText}
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Modal preview ảnh */}
        <ModalPreviewUrl
          previewOpen={previewOpen}
          setPreviewOpen={setPreviewOpen}
          previewUrl={previewUrl}
          previewTitle={previewTitle}
          getIcon={getIcon}
          downloadUrl={downloadUrl}
        />
      </>
    );
  }
);

MessageItem1.displayName = "MessageItem";
export const MessageItem = memo(MessageItem1);
