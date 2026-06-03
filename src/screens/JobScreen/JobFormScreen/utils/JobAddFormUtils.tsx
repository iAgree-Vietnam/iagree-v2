// JobAddFormUtils.ts
import Constants from "@/src/constants/Constants";

export default class JobAddFormUtils {
  static getActiveStepIndex(stepName: string) {
    let stepIndex = 0; // Default to 0
    switch (stepName) {
      case Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW: {
        stepIndex = 0;
        break;
      }
      case Constants.JOB_ADD_FORM.TAB.JOB_ADD_SCOPE_AND_BUDGET: {
        stepIndex = 1;
        break;
      }
      case Constants.JOB_ADD_FORM.TAB.JOB_ADD_CONFIRM_AND_REGISTER: {
        stepIndex = 2;
        break;
      }
      case Constants.JOB_ADD_FORM.TAB.JOB_ADD_REGISTERED_OPTIONS: {
        stepIndex = 3;
        break;
      }
      default:
        // console.warn(`Unknown stepName: ${stepName}. Defaulting to index 0.`);
        stepIndex = 0;
        break;
    }
    return stepIndex;
  }

  static getActiveStepName(stepIndex: number) {
    let activeStepName = Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW;

    switch (stepIndex) {
      case 0: {
        activeStepName = Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW;
        break;
      }
      case 1: {
        activeStepName = Constants.JOB_ADD_FORM.TAB.JOB_ADD_SCOPE_AND_BUDGET;
        break;
      }
      case 2: {
        activeStepName =
          Constants.JOB_ADD_FORM.TAB.JOB_ADD_CONFIRM_AND_REGISTER;
        break;
      }
      case 3: {
        activeStepName = Constants.JOB_ADD_FORM.TAB.JOB_ADD_REGISTERED_OPTIONS;
        break;
      }
      default:
        // Handle unexpected index, maybe log an error or return a default
        // console.warn(
        //   `Unknown stepIndex: ${stepIndex}. Defaulting to JOB_ADD_OVERVIEW.`
        // );
        activeStepName = Constants.JOB_ADD_FORM.TAB.JOB_ADD_OVERVIEW;
        break;
    }
    return activeStepName;
  }
}

// src/utils/fileHelpers.ts
import { ImageIcon, Video, File, FileText } from "lucide-react";
 // Required for JSX

/**
 * Định dạng kích thước file từ bytes sang KB, MB, GB.
 * @param bytes Kích thước file (số byte).
 * @returns Chuỗi định dạng kích thước file.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Trả về icon phù hợp với loại file.
 * @param type Loại MIME của file (ví dụ: "image/png", "application/pdf").
 * @param size Kích thước icon (mặc định 20).
 * @returns React element (icon).
 */
export const getFileIcon = (type: string, size = 20) => {
  if (type.startsWith("image/")) {
    return <ImageIcon size={size} style={{ color: "#52c41a" }} />;
  } else if (type.startsWith("video/")) {
    return <Video size={size} style={{ color: "#722ed1" }} />;
  } else if (type === "application/pdf") {
    return <FileText size={size} style={{ color: "#ff4d4f" }} />;
  } else if (type.includes("word") || type === "text/plain") {
    return <FileText size={size} style={{ color: "#1890ff" }} />;
  } else {
    return <File size={size} style={{ color: "#8c8c8c" }} />;
  }
};

/**
 * Trả về màu chủ đạo dựa trên loại file.
 * @param fileType Loại MIME của file.
 * @returns Mã màu hex.
 */
export const getFileMainColor = (fileType: string | undefined): string => {
  if (!fileType) return "#95a5a6";
  if (fileType.startsWith("image/")) return "#3498db";
  if (fileType.startsWith("video/")) return "#9b59b6";
  if (fileType.includes("pdf")) return "#e74c3c";
  if (fileType.includes("word") || fileType.includes("document"))
    return "#2980b9";
  if (fileType.includes("excel") || fileType.includes("spreadsheet"))
    return "#27ae60";
  return "#95a5a6";
};

/**
 * Định dạng thời lượng từ giây sang chuỗi "MM:SS".
 * @param seconds Thời lượng (số giây).
 * @returns Chuỗi định dạng thời lượng.
 */
export const formatDuration = (seconds: number | undefined): string => {
  if (seconds === undefined || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};