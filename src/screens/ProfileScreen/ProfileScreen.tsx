import React, { useMemo, useState } from "react";
import Head from "next/head";
import { Breadcrumb, message } from "antd";

import RootLayout from "@/src/layouts/RootLayout";
import { ProfileContainer } from "@/src/components/ProfileContainer";
import { useAccountContext } from "@/src/contexts/AccountContext";
import {
  ProfileForm,
  ProfileFormData,
} from "@/src/screens/ProfileScreen/ProfileForm";
import moment from "moment";

import {
  CompanyProfileForm,
  CompanyProfileFormData,
} from "@/src/screens/ProfileScreen/CompanyProfileForm";
import { useMutationProfile } from "@/src/screens/ProfileScreen/hooks/useMutationProfile";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import { useMutationCitizenId } from "./hooks/useMutationCitizenId";
import { useQueryClient } from "@tanstack/react-query";
import { ReferralCode } from "@/src/components/RefferalCode";
import { toString } from "lodash";
import Constants from "@/src/constants/Constants";
import { ReferralLink } from "@/src/components/RefferalLink";

export function ProfileScreen() {
  const { auth: userInfo } = useAccountContext();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutationProfile();
  const { mutateAsync: mutateCitizenIdAsync } = useMutationCitizenId();
  const fullProfileResource = userInfo;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isPartner = useMemo(() => {
    return fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;
  }, [fullProfileResource]);

  const onSubmitProfile = async (formData: ProfileFormData) => {
    const form = new FormData();
    form.append("name", formData?.fullName || "");
    form.append("sex", formData?.sex.toString());
    form.append("phone", formData?.phoneNumber ?? "");
    if (!fullProfileResource?.citizenId) {
      form.append("citizen_id", formData.citizenId ?? "");
    }
    form.append("card_number", formData?.cardNumber ?? "");
    form.append("tax_code", formData?.taxCode ?? "");

    // @ts-ignore
    !!formData?.bithday &&
      form.append("bithday", moment(formData?.bithday).format("YYYY-MM-DD"));
    !!formData?.avatarFile && form.append("avatar", formData?.avatarFile);
    !!formData?.frontCardFile &&
      form.append("front_card", formData?.frontCardFile);
    !!formData?.backCardFile &&
      form.append("back_card", formData?.backCardFile);

    try {
      setIsLoading(true);
      await mutateAsync(form);

      if (formData?.citizenId !== userInfo?.citizenId) {
        await mutateCitizenIdAsync(formData?.citizenId as string);
      }

      await queryClient.invalidateQueries(["AUTH_FETCH_PROFILE"]);
      message
        .success("Cập nhật thông tin tài khoản thành công")
        .then(() => null);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCompanyProfile = async (formData: CompanyProfileFormData) => {
    const form = new FormData();
    form.append("name", formData?.fullName || "");
    form.append("name_rep", formData?.nameRep ?? "");
    form.append("tax_code", formData?.taxCode ?? "");
    form.append("phone", formData?.phoneNumber ?? "");
    form.append("card_number", formData?.cardNumber ?? "");

    !!formData?.avatarFile && form.append("avatar", formData?.avatarFile);
    !!formData?.frontCardFile &&
      form.append("front_card", formData?.frontCardFile);
    !!formData?.backCardFile &&
      form.append("back_card", formData?.backCardFile);
    !!formData?.businessLicenseFile &&
      form.append("business_license", formData?.businessLicenseFile);
    if (formData?.documentsFile && formData?.documentsFile.length > 0) {
      formData?.documentsFile.forEach((file, idx) => {
        form.append(`documents[${idx}]`, file);
      });
    }

    try {
      setIsLoading(true);
      await mutateAsync(form);

      if (formData.citizenId !== userInfo?.citizenId) {
        await mutateCitizenIdAsync(formData.citizenId as string);
      }

      await queryClient.invalidateQueries(["AUTH_FETCH_PROFILE"]);
      message
        .success("Cập nhật thông tin tài khoản thành công")
        .then(() => null);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const title =
    userInfo?.accountType === "PERSONAL"
      ? "Thông tin cá nhân"
      : "Thông tin doanh nghiệp";

  return (
    <RootLayout>
      <Head>
        <title>{title}</title>
      </Head>

      <section className={"breadcrumbContainer"}>
        <div className="contentWrapper">
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <IconSvgLocal name={"IC_HOME"} />
                    <span>Trang chủ</span>
                  </>
                ),
                href: "/",
              },
              { title: title },
            ]}
          />
        </div>
      </section>
      <ProfileContainer>
        <h1 className={"pageHeaderTitle"}>{title}</h1>
        {toString(fullProfileResource?.referral_code) && (
          <div
            style={{
              marginBottom: 20,
            }}
          >
            {isPartner && (
              <ReferralLink
                code={toString(fullProfileResource?.referral_code)}
                title="Mã giới thiệu"
              />
            )}
          </div>
        )}
        {userInfo?.accountType === "PERSONAL" ? (
          <ProfileForm
            formData={userInfo as ProfileFormData}
            onSubmit={onSubmitProfile}
            isSubmitting={isLoading}
          />
        ) : (
          <>
            <CompanyProfileForm
              formData={userInfo as CompanyProfileFormData}
              onSubmit={onSubmitCompanyProfile}
              isSubmitting={isLoading}
            />
          </>
        )}
      </ProfileContainer>
    </RootLayout>
  );
}
