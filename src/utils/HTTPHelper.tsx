import NumberUtils from '@/src/utils/NumberUtils';
import _, { split } from 'lodash';

export class DecodeHTTPHelper {

    static convertInts(str: string) {
        const results = [];

        const parts = split((str || ''),',');
        for (const numId of parts) {
            if (!NumberUtils.isNumber(parseInt(numId))) continue;

            results.push(Number(numId));
        }

        return results;
    }

}

export default class HTTPHelper {

    static pushState(dataParams: any) {
        const url = new URL(window.location as any);
        for (const keyId of Object.keys(dataParams)) {
            const value = dataParams[keyId];
            if (_.isNull(value)) continue;
            if (_.isString(value) && _.isEmpty(value)) continue;
            if (_.isArray(value) && _.isEmpty(value)) continue;

            url.searchParams.set(keyId, value);
        }

        history.pushState({}, '', url);
    }

    static pushStateV2(dataParams: any) {
        // 1. Lấy URL gốc mà không có tham số nào
        const url = new URL(window.location.pathname, window.location.origin);

        // 2. Lặp qua state filter hiện tại và chỉ thêm những filter CÓ GIÁ TRỊ
        for (const key of Object.keys(dataParams)) {
            const value = dataParams[key];

            // Bỏ qua nếu giá trị là null, undefined, chuỗi rỗng, hoặc mảng rỗng
            if (value === null || value === undefined) continue;
            if (typeof value === 'string' && value.length === 0) continue;
            if (Array.isArray(value) && value.length === 0) continue;

            // Nếu filter hợp lệ, thêm nó vào URL
            url.searchParams.set(key, String(value));
        }

        // 3. Đẩy trạng thái mới vào history, thay thế hoàn toàn URL cũ
        // Điều này đảm bảo các tham số đã bị bỏ chọn sẽ biến mất khỏi URL
        history.pushState({}, '', url.toString());
    }
}
