import { GetServerSidePropsContext } from "next/types";
import CookieUtils from "./CookieUtils";
import _ from "lodash";
import Cookies from "js-cookie";
import Constants from "../constants/Constants";

type FetchCtx = GetServerSidePropsContext | null | undefined;

export default async function fetchUtil(
  context: FetchCtx,
  input: string,
  init?: RequestInit
): Promise<any> {
  const newHeaders = new Headers(init?.headers || {});

  let accessToken: string | null = null;

  if (context) {
    // SSR: lấy từ req.cookies
    accessToken = CookieUtils.getAccessTokenFromServerContext(context);
  } else if (typeof window !== "undefined") {
    // CSR: lấy giống AccountContext
    accessToken = Cookies.get(Constants.KEY_ACCESS_TOKEN) || null;
  }

  if (!_.isEmpty(accessToken)) {
    newHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const finalInit: RequestInit = {
    ...init,
    headers: newHeaders,
  };

  // Use local API routes (/api/v2) instead of old Laravel API
  const localBase = typeof window !== 'undefined'
    ? '/api/v2'  // CSR: relative URL
    : (process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/v2';

  const endpointUrl = [
    _.trimEnd(localBase, "/"),
    _.trimStart(input, "/"),
  ].join("/");

  const res = await fetch(endpointUrl, finalInit);
  const text = await res.text();

  if (!text) return null;

  try {
    
    return JSON.parse(text);
  } catch {
    return null;
  }
}
