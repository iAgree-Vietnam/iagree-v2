import _ from "lodash";

export default class URLUtils {
  static canonicalUrl(relativeUrl: any) {
    return [
      _.trimEnd(process.env.BASE_URL, "/"),
      _.trimStart(relativeUrl, "/"),
    ].join("/");
  }

  static bindUrl(originalUrl: string, dataParams: any): string {
    const makeToken = (inx: any) => `{{###~${inx}~###}}`;

    const tokens = Object.keys(dataParams).map((key, inx) => ({
      key,
      val: dataParams[key],
      token: makeToken(inx),
    }));

    const tokenizedStr = tokens.reduce(
      (carry, entry) => carry.replace(entry.key, entry.token),
      originalUrl
    );
    return tokens.reduce(
      (carry, entry) => carry.replace(entry.token, entry.val),
      tokenizedStr
    );
  }

  static isUrl(str: string) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }
}
