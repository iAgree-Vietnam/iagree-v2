import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { JobDetailInitResource } from "../data/job/models/job.types";
import { isEmpty } from "lodash";
dayjs.extend(customParseFormat);

// Giả định hàm isEmpty (cần phải được định nghĩa trong môi trường của bạn)

export class JobCancellationValidator {
  /**
   * @type {JobCancellationValidator | null}
   * Thuộc tính tĩnh lưu trữ instance duy nhất.
   */
  // isClient: boolean;
  isPartner: boolean = false;

  /**
   * Constructor được gọi khi tạo instance mới.
   * @param {object} fullJobResource - Đối tượng job chứa tất cả dữ liệu, bao gồm createdDateString.
   */
  fullJobResource?: JobDetailInitResource;
  createdDate?: string;
  format?: string;
  constructor(fullJobResource?: JobDetailInitResource, isPartner?: boolean) {
    // [Quy ước private] Ngăn không cho tạo instance trực tiếp bên ngoài
    if (fullJobResource) {
      this.fullJobResource = fullJobResource;
      // Lấy createdDateString từ fullJobResource để lưu vào thuộc tính riêng
      this.createdDate = fullJobResource?.createdDate;
      this.format = "DD/MM/YYYY HH:mm:ss";
    }
    if (isPartner) {
      this.isPartner = isPartner || false;
    }
  }

  /**
   * Phương thức tĩnh để lấy instance duy nhất của class (gI = Get Instance).
   *
   * @param {object} fullJobResource - Dữ liệu Job mới nhất.
   * @returns {JobCancellationValidator} Instance Singleton của class.
   */

  // --- LOGIC KIỂM TRA ---

  /**
   * @returns {boolean} TRUE nếu job CHƯA quá 24 giờ.
   */
  checkTimeRestriction() {
    // Đã sửa lỗi: Dùng this.createdDate thay vì this.ful
    const createdDate = dayjs(this.createdDate, this.format);
    const twentyFourHoursAgo = dayjs().subtract(24, "hour");
    return (
      !this.isPartner &&
      !this.checkBidsAbsence() &&
      !createdDate.isBefore(twentyFourHoursAgo)
    );
  }

  /**
   * @returns {boolean} TRUE nếu job KHÔNG có bids.
   */
  checkBidsAbsence() {
    return !this.isPartner && isEmpty(this.fullJobResource?.userProjectBids);
  }

  /**
   * Thực hiện kiểm tra theo các bước (Step).
   * @returns {number} Số Step cao nhất đã kích hoạt điều kiện CANCEL (2, 1).
   * Trả về 0 nếu TẤT CẢ các bước đều hợp lệ.
   */
  validate() {
    switch (true) {
      case this.checkTimeRestriction():
        return 2;
      case this.checkBidsAbsence():
        return 1;
      default:
        return -1;
    }
  }
}
