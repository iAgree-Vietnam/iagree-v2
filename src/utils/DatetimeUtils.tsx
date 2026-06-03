import moment, { Moment } from "moment";
import "moment/locale/vi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/vi"; // nếu bạn muốn tiếng Việt: "3 phút trước"
import { gt, toString, trim } from "lodash";

dayjs.extend(relativeTime);
dayjs.locale("vi"); // hoặc bỏ dòng này nếu muốn hiển thị tiếng Anh

class DatetimeUtils {
  LOCAL_DATE = "DD/MM/YYYY";
  LOCAL_TIME = "HH:mm:ss";
  LOCAL_DATE_WITH_DAY_NAME = "dddd, DD/MM/YYYY";
  LOCAL_DATE_WITHOUT_DAY = "MM/YYYY";
  LOCAL_DATE_TIME = "DD/MM/YYYY HH:mm:ss";
  LOCAL_DATE_TIME_WITH_MERIDIEM = "DD/MM/YYYY hh:mm A";
  BACKEND_DATE_TIME = "YYYY-MM-DD HH:mm:ss";
  BACKEND_DATE_TIME_V2 = "MM-YYYY";
  BACKEND_DATE_TIME_WITHOUT_HHMMSS = "YYYY-MM-DD";
  BACKEND_DATE_TIME_WITHOUT_HHMMSS_V2 = "DD-MM-YYYY";

  getMoment(mixedValue: string, format?: string | any): Moment | null {
    try {
      const momentDate = moment(mixedValue, format);

      momentDate.locale("vi");

      return momentDate.isValid() ? momentDate : null;
    } catch (e) {
      return null;
    }
  }

  parseBackendMonth = (v: any) => {
    if (!v) return null;
    // v có thể là string (do normalize) hoặc moment
    if (moment.isMoment(v)) return v.clone().startOf("month");
    const m = moment(v, datetimeUtils.BACKEND_DATE_TIME, true);
    return m.isValid() ? m.startOf("month") : null;
  };


  isTimeExceeds(maxHours: number, timeToCheck: Date | null | undefined) {
    // Chuyển số giờ thành mili giây
    const maxMillis = maxHours * 60 * 60 * 1000;

    // Lấy thời gian hiện tại (hoặc thời gian cụ thể) và so sánh
    const checkTime = timeToCheck ? dayjs(timeToCheck) : dayjs();

    // Lấy thời gian hiện tại và so sánh
    const now = dayjs();
    const diffMillis = now.diff(checkTime);

    // Kiểm tra nếu thời gian vượt quá số mili giây cho phép
    return gt(diffMillis, maxMillis);
  }

  public getDateFromNow(lastMessageTime: number) {
    const diffInDays = dayjs().diff(lastMessageTime, "day");
    const diffInMonths = dayjs().diff(lastMessageTime, "month");
    const diffInYears = dayjs().diff(lastMessageTime, "year");
    const diffInWeeks = dayjs().diff(lastMessageTime, "week");
    const diffInHours = dayjs().diff(lastMessageTime, "hour");
    const diffInMinutes = dayjs().diff(lastMessageTime, "minute");
    const diffInSeconds = dayjs().diff(lastMessageTime, "second");

    // Logic kiểm tra đơn vị lớn nhất
    switch (true) {
      case diffInYears >= 1:
        return `${diffInYears} năm trước`;
      case diffInMonths >= 1:
        return `${diffInMonths} tháng trước`;
      case diffInWeeks >= 1:
        return `${diffInWeeks} tuần trước`;
      case diffInDays >= 1:
        return `${diffInDays} ngày trước`;
      case diffInHours >= 1:
        return `${diffInHours} giờ trước`;
      case diffInMinutes >= 1:
        return `${diffInMinutes} phút trước`;
      case diffInSeconds >= 1:
        return `${diffInSeconds} giây trước`;
      default:
        return "Vừa xong";
    }
  }

  public normalizeToBackendDateTime00 = (input?: string | null) => {
    if (!input) return "";

    const s = trim(toString(input));
    if (!s) return "";

    // strict parse in priority order
    const m =
      moment(
        s,
        [
          this.BACKEND_DATE_TIME_V2,
          this.BACKEND_DATE_TIME_WITHOUT_HHMMSS,
          this.LOCAL_DATE_TIME,
        ],
        true
      ) || moment.invalid();

    if (!m.isValid()) return "";

    return m.startOf("day").format(this.BACKEND_DATE_TIME);
  };
}

const datetimeUtils = new DatetimeUtils();
export default datetimeUtils;
