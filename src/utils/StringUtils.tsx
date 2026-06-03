import _, { kebabCase } from "lodash";
import { RawUserReviewAttachmentsResource } from "../data/partner/models/partner.raw";
import {
  EyeOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileImageOutlined,
  FileOutlined,
  LinkOutlined,
} from "@ant-design/icons";

export default class StringUtils {
  static removeVietnameseTones(str: string) {
    return str
      .normalize("NFD") // tách chữ + dấu
      .replace(/[\u0300-\u036f]/g, "") // xóa toàn bộ dấu thanh
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }

  static toPostmanArrayParam (ids?: Array<number | string> | null){
    if (!ids || ids.length === 0) return null;
    return `[${ids.join(",")}]`;
  };
  

  static normalizeText(str: string) {
    return this.removeVietnameseTones(str)
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  static getExt  (nameOrUrl?: string) {
    if (!nameOrUrl) return "";
    const clean = nameOrUrl.split("?")[0].split("#")[0];
    const part = clean.split(".").pop() || "";
    return part.toLowerCase();
  };
  
  static isImageExt = (ext: string) =>
    ["png", "jpg", "jpeg", "webp", "svg"].includes(ext);
  
  static isPdfExt(ext: string) {return ext === "pdf"};
  static isWordExt(ext: string) {return ["doc", "docx"].includes(ext)};
  
  static pickUrl(a: RawUserReviewAttachmentsResource){
    return a.file_url || a.file || ""
  }
  
  static getFileIcon = (ext: string) => {
    if (this.isPdfExt(ext)) return <FilePdfOutlined />;
    if (this.isWordExt(ext)) return <FileWordOutlined />;
    if (this.isImageExt(ext)) return <FileImageOutlined />;
    return <FileOutlined />;
  };

  static isSoftMatch(source: string, query: string) {
    const s = this.normalizeText(source);
    const q = this.normalizeText(query);

    // tách các từ trong query, yêu cầu tất cả đều xuất hiện (giống WHERE name ILIKE '%a%' AND name ILIKE '%b%')
    return q.split(" ").every((part) => s.includes(part));
  }
  static slugify(str: string) {
    const slug = String(str)
      .normalize("NFKD") // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .replace(/đ/g, "d") // replace đ to d
      .replace(/Đ/g, "D") // replace Đ to D
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-");

    const trimmedSlug = _.trim(slug, "-");

    // const base64 = Buffer.from(trimmedSlug).toString('base64'); // standard base64
    // const base64Url = base64
    const base64Url = trimmedSlug
      .replace(/\+/g, "-") // make it URL-safe
      .replace(/\//g, "_")
      .replace(/=+$/, ""); // remove padding

    return base64Url;
  }

  static toSlug(str: string) {
    return kebabCase(_.trim(str));
  }

  static normalizeDownloadFilename(str: string) {
    const newFilename = String(str)
      .normalize("NFKD") // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .replace(/đ/g, "d") // replace đ to d
      .replace(/Đ/g, "D") // replace Đ to D
      .trim() // trim leading or trailing whitespace
      .replace(/[^A-za-z0-9 -]/g, ""); // remove non-alphanumeric characters

    return newFilename;
  }

  static stripTags(content: string) {
    return content.replace(/(<([^>]+)>)/gi, "");
  }

  /*
   * Decode base64 value, returns string
   * @Params: string
   */
  static decodeValue(value: string) {
    if (!value || typeof window === "undefined") return null;

    const valueToString = value.toString();

    return window.atob(decodeURIComponent(valueToString));
  }

  /*
   * Encode string, returns base64 value
   * @Params: string
   */
  static encodeValue(value: string) {
    if (!value) return null;

    const valueToString = value.toString();

    return encodeURIComponent(Buffer.from(valueToString).toString("base64"));
  }

  static uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  static isJsonString(str: string) {
    if (!_.isString(str)) {
      return false; // not even a string
    }
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
}
