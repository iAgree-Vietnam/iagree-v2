import { compact } from "lodash";
import { FullJobResource } from "../data/job/models/job.types";
import { FullJobResourceV2 } from "../data/job/models/v2/job.types";

export default class ArrayUtils {
  static addOrRemove(array: any[], item: any) {
    const exists = array.includes(item);
    if (exists) return array.filter((c) => c !== item);

    const result = array;
    result.push(item);
    return result;
  }

  // static sortByDateDesc = <T extends Record<string, any>>(
  //   list: T[] = [],
  //   field: keyof T
  // ): T[] => {
  //   return [...list].sort((a, b) => {
  //     const dateA = new Date(a[field] as string).getTime();
  //     const dateB = new Date(b[field] as string).getTime();
  //     return dateB - dateA;
  //   });
  // };
  static sortByDateDesc = <T extends Record<string, any>>(
    list: T[] = [],
    field: keyof T =  "created_at",
    order: 'asc' | 'desc' = 'desc' // Mặc định là desc (mới nhất -> cũ nhất)
  ): T[] => {
    // console.log("list", list);
    
    return compact([...list]).sort((a, b) => {
      const parseDate = (dateStr: any) => {
        if (!dateStr || typeof dateStr !== 'string') return 0;

        // Xử lý chuỗi "28/09/2025 11:45:20" thành chuẩn ISO
        const [date, time] = dateStr.split(" ");
        const [day, month, year] = date.split("/");
        
        // Tạo timestamp từ định dạng YYYY-MM-DDTHH:mm:ss
        const timestamp = new Date(`${year}-${month}-${day}T${time || '00:00:00'}`).getTime();
        return isNaN(timestamp) ? 0 : timestamp;
      };

      const dateA = parseDate(a?.[field]);
      const dateB = parseDate(b?.[field]);

      // Nếu order là 'asc': dateA - dateB (Cũ -> Mới)
      // Nếu order là 'desc': dateB - dateA (Mới -> Cũ)
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  static addOrRemoveV2(array: any[], item: any): any[] {
    const exists = array.includes(item);
    if (exists) {
      return array.filter((c) => c !== item);
    }
    return [...array, item];
  }

  static mergeUniqueByFieldName(array: any[], toAdd: any[], fieldName: string) {
    const idMap = new Map(array.map((item) => [item[fieldName], item]));

    const filteredToAdd = toAdd.filter((item) => !idMap.has(item[fieldName]));

    return [...array, ...filteredToAdd];
  }

  static arrayRange(start: number, stop: number, step = 1) {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
    );
  }

  static areEqual<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  // utils/sortJobs.ts

  static sortJobsByDateAndStatus(jobs: FullJobResourceV2[]): FullJobResourceV2[] {
    const today = new Date();

    const parseDate = (str?: string | null): Date | null => {
      if (!str) return null;
      // Nếu format kiểu "29/10/2025"
      const parts = str.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`);
      }
      // Nếu là ISO string
      const date = new Date(str);
      return isNaN(date.getTime()) ? null : date;
    };

    return [...jobs].sort((a, b) => {
      const aEnd = parseDate(a.postingEndDate);
      const bEnd = parseDate(b.postingEndDate);

      const aValid =
        (a.status === 1 || a.status === 4) && !!aEnd && aEnd > today;
      const bValid =
        (b.status === 1 || b.status === 4) && !!bEnd && bEnd > today;

      if (aValid && !bValid) return -1;
      if (!aValid && bValid) return 1;
      return 0;
    });
  }

  static sortJobsByDateAndStatusV2(jobs: FullJobResourceV2[]): FullJobResourceV2[] {
    const today = new Date();

    const parseDate = (str?: string | null): Date | null => {
      if (!str) return null;
      // Nếu format kiểu "29/10/2025"
      const parts = str.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(`${year}-${month}-${day}`);
      }
      // Nếu là ISO string
      const date = new Date(str);
      return isNaN(date.getTime()) ? null : date;
    };

    return [...jobs].sort((a, b) => {
      const aEnd = parseDate(a.postingEndDate);
      const bEnd = parseDate(b.postingEndDate);

      const aValid =
        (a.status === 1 || a.status === 4) && !!aEnd && aEnd > today;
      const bValid =
        (b.status === 1 || b.status === 4) && !!bEnd && bEnd > today;

      if (aValid && !bValid) return -1;
      if (!aValid && bValid) return 1;
      return 0;
    });
  }
}
