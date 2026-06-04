// src/contexts/AccountContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import _ from "lodash";

import Constants from "../constants/Constants";
import { FullProfileResource } from "../data/auth/models/types";
import { SettingResource } from "../data/setting/models/setting.types";
import BackendAuthServices from "../data/auth/services/BackendAuthServices";
import SettingServices from "../data/setting/services/SettingServices";
import { HomeInitResource } from "../data/home/models/home.types";
import { UserParserUtils } from "../data/user/utils/UserParserUtils";

export interface AccountContextShape {
  accessToken: string | null;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;

  auth: Partial<FullProfileResource> | null;
  isLoggedIn: boolean;

  setting: SettingResource | null;

  loading: boolean;          // loading auth
  loadingSetting: boolean;   // loading setting

  refreshAccount: () => Promise<void>;
  logout: () => void;
}

const AccountContext = createContext<AccountContextShape | null>(null);

export const AccountProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState(
    Cookies.get(Constants.KEY_ACCESS_TOKEN) || null
  );

  const [auth, setAuth] = useState<Partial<FullProfileResource> | null>();
  const [setting, setSetting] = useState<SettingResource | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingSetting, setLoadingSetting] = useState(true);

  // 🟢 Fetch user
  const refreshAccount = async () => {
    setLoading(true);
    try {
      if (!accessToken) {
        setAuth(null);
      } else {
        const user = await new BackendAuthServices().getFullInfo();
        setAuth(user)
      }
    } catch (err) {
      setAuth(null);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Fetch setting 1 LẦN DUY NHẤT KHI APP MOUNT
  useEffect(() => {
    const fetchSetting = async () => {
      setLoadingSetting(true);
      try {
        const res = await new SettingServices().get({}) as HomeInitResource;
        if (res?.setting) setSetting(res.setting);
      } catch (err) {
        console.error("Fetch setting error:", err);
      } finally {
        setLoadingSetting(false);
      }
    };

    fetchSetting(); // chỉ chạy 1 lần (empty deps)
  }, []);

  // 🟢 Fetch profile khi accessToken đổi
  useEffect(() => {
    if (accessToken) {
      refreshAccount();
    } else {
      setAuth(null);
      setLoading(false);
    }
  }, [accessToken]);

  // 🟥 Logout CLEAR auth, giữ nguyên setting
  const logout = () => {
    Cookies.remove(Constants.KEY_ACCESS_TOKEN);
    setAccessToken(null);
    setAuth(null);
  };

  return (
    <AccountContext.Provider
      value={{
        accessToken,
        setAccessToken,
        auth: auth || null,
        isLoggedIn: !!auth,
        setting,
        loading,
        loadingSetting,
        refreshAccount,
        logout,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccountContext must be used within AccountProvider");
  return ctx;
};
