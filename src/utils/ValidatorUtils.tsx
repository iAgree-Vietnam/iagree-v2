export default class ValidatorUtils {
  static passwordValidator(_: any, value: string) {
    // Kiểm tra mật khẩu có ít nhất 8 ký tự
    if (value.length < 8)
      return Promise.reject("Mật khẩu cần có ít nhất 8 ký tự");

    const validateMessage =
      "Mật khẩu cần có ít nhất 1 ký tự in hoa, in thuờng, ký tự số, ký đặc biệt";

    // Kiểm tra mật khẩu có ít nhất 1 ký tự in hoa
    if (!/[A-Z]/.test(value)) return Promise.reject(validateMessage);

    // Kiểm tra mật khẩu có ít nhất 1 ký tự in thường
    if (!/[a-z]/.test(value)) return Promise.reject(validateMessage);

    // Kiểm tra mật khẩu có ít nhất 1 ký tự số
    if (!/\d/.test(value)) return Promise.reject(validateMessage);

    // Kiểm tra mật khẩu có ít nhất 1 ký tự đặc biệt (chẳng hạn !, @, #, $, %, etc.)
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(value))
      return Promise.reject(validateMessage);

    return Promise.resolve();
  }

  static removeEmptyFields(obj: any): any {
    if (Array.isArray(obj)) {
      return obj
        .map((v) => ValidatorUtils.removeEmptyFields(v))
        .filter((v) => v !== null && v !== undefined && v !== '');
    } else if (obj && typeof obj === "object") {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        const cleaned = ValidatorUtils.removeEmptyFields(value);
        if (cleaned !== null && cleaned !== undefined && cleaned !== '') {
          acc[key] = cleaned;
        }
        return acc;
      }, {} as any);
    }
    return obj;
  } 
}
