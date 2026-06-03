import { GetServerSidePropsContext } from "next/types";
import Constants from "../constants/Constants";
import _ from "lodash";

type ServerCtx = GetServerSidePropsContext | null | undefined;

export default class CookieUtils {
  static hasAccessToken(context?: ServerCtx) {
    const accessToken = this.getAccessTokenFromServerContext(context);
    return !_.isEmpty(accessToken);
  }

  static getAccessTokenFromServerContext(context?: ServerCtx): string | null {
    if (!context) return null;
    return _.get(context, `req.cookies.${Constants.KEY_ACCESS_TOKEN}`, null);
  }

  static getVerifyEmailFromServerContext(context?: ServerCtx): string | null {
    if (!context) return null;
    return _.get(context, `req.cookies.${Constants.KEY_VERIFY_EMAIL}`, null);
  }
}
