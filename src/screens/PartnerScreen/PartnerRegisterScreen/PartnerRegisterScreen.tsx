import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Typography,
  Breadcrumb,
  Steps,
  Checkbox,
} from "antd";
import type { RcFile } from "antd/es/upload/interface";
import Head from "next/head";
import _ from "lodash";

import RootLayout from "@/src/layouts/RootLayout";
import { usePartnerSelectBox } from "@/src/screens/PartnerScreen/hooks/usePartnerSelectBox";
import {
  PartnerRegisterParams,
} from "@/src/data/partner/models/partner.types";
import {
  PartnerDocument,
} from "@/src/screens/PartnerScreen/components/PartnerDocuments";
import { usePartnerRegister } from "@/src/screens/PartnerScreen/hooks/usePartnerRegister";
import { useAccountContext } from "@/src/contexts/AccountContext";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import Constants from "@/src/constants/Constants";
import { IconSvgLocal } from "@/src/components/icon-svg-local";
import Link from "next/link";
import { useRouter } from "next/router";
import PrivacyPolicyRouteUtils from "@/src/data/privacy-policy/utils/PrivacyPolicyRouteUtils";
import { useMutationCitizenId } from "../../ProfileScreen/hooks/useMutationCitizenId";
import PartnerRegisterSuccessModal from "../components/PartnerRegisterSuccessModal";
import { ModalizeHelperVisible } from "@/src/data/base/models/base.types";
import usePartnerRegisterStep from "./hooks/usePartnerResgisterStep";
import PartnerRegisterUtils from "./utils/PartnerRegisterUtils";
import PartnerRegisterInfo from "./parts/PartnerRegisterInfo";
import PartnerCompanyRegisterInfo from "./parts/PartnerCompanyRegisterInfo";
import { FullProfileResource } from "@/src/data/auth/models/types";
import PartnerRegisterVerify from "./parts/PartnerRegisterVerify";
import PartnerCompanyRegisterVerify from "./parts/PartnerCompanyRegisterVerify";
import PartnerRegisterPayment from "./parts/PartnerRegisterPayment";
import PartnerRegisterConfirm from "./parts/PartnerRegisterConfirm";
import PartnerCompanyRegisterConfirm from "./parts/PartnerCompanyRegisterConfirm";
import TermOfUseRouteUtils from "@/src/data/term-of-use/utils/TermOfUseRouteUtils";

export interface PartnerRegisterProps {
  auth: Partial<FullProfileResource>;
  setStepName: (stepName: string) => void;
  businessLicenseFile?: File | null;
  setBusinessLicenseFile?: (file: File | null) => void;
  frontCardFile?: File | null;
  setFrontCardFile?: (file: File | null) => void;
}

export function PartnerRegisterScreen(props: any) {
  const router = useRouter();
  const { auth: fullProfileResource } = useAccountContext();
  
  useEffect(() => {
    if (fullProfileResource && fullProfileResource.partner) {
      if ((fullProfileResource.partner.status === Constants.PARTNER.DA_DUYET)
          || (fullProfileResource.partner.status === Constants.PARTNER.CHO_DUYET)
      ) {
        router.push(PartnerRouteUtils.toProfileUrl());
        return;
      }
    }
  }, [fullProfileResource, router])

  const pageTitle = "Đăng ký trở thành đối tác";

  const [form] = Form.useForm();
  const { setFieldValue } = form;

  const partnerRegisterSuccessModalRef = useRef<ModalizeHelperVisible>(null);

  const { mutateAsync, isLoading: isSubmitting } = usePartnerRegister({
    onSuccess: () => partnerRegisterSuccessModalRef.current?.open(),
  });
  const { mutateAsync: mutateCitizenIdAsync } = useMutationCitizenId();

  const selectBoxQuery = usePartnerSelectBox();
  // const selectBoxResource: PartnerSelectBoxResource = selectBoxQuery.data;

  const [documentList, setDocumentList] = useState<PartnerDocument[]>([]);
  const [businessLicenseFile, setBusinessLicenseFile] = useState<File | null>(
    null
  );

  const getBase64 = useCallback(
    (file: RcFile) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      }),
    []
  );

  const removeDocument = useCallback(
    (index: number) => {
      const newDocumentList = documentList.slice();
      newDocumentList.splice(index, 1);
      setDocumentList(newDocumentList);
    },
    [documentList]
  );

  const handleChangeDescription = useCallback(
    (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const newDocumentList = documentList.slice();
      documentList[index].description = event.target.value;
      setDocumentList(newDocumentList);
    },
    [documentList]
  );

  useEffect(() => {
    setFieldValue("attachments", documentList);
  }, [documentList, setFieldValue]);

  const { auth: userInfo } = useAccountContext();

  useEffect(() => {
    if (userInfo?.partner?.status === Constants.PARTNER.DA_DUYET) {
      router.replace(PartnerRouteUtils.toProfileUrl());
      return;
    }
  }, [userInfo, router]);

  const isUpdateStep = useRef(false);

  const {
    stepIndex,
    onChangeStepIndex,
    stepName,
    setStepName,
    setCurrentStepIndex,
    steps,
  } = usePartnerRegisterStep();

  useEffect(() => {
    // let stepName = Constants.PARTNER.TAB.REGISTER_INFO;
    let stepIndex = 0;

    const stepName = PartnerRegisterUtils.getActiveStepName(stepIndex);
    stepIndex = PartnerRegisterUtils.getActiveStepIndex(stepName);

    setStepName(stepName);
    setCurrentStepIndex(stepIndex);
    isUpdateStep.current = true;
  }, [isUpdateStep]);

  const handlePrevStep = async () => {
    try {
      const nextStepIndex = stepIndex - 1;
      if (nextStepIndex >= 0) {
        const nextStepName =
          PartnerRegisterUtils.getActiveStepName(nextStepIndex);
        setStepName(nextStepName);
        setCurrentStepIndex(nextStepIndex);
      }
    } catch (error) {}
  };

  const handleNextStep = async () => {
    try {
      const nextStepIndex = stepIndex + 1;
      if (nextStepIndex < 4) {
        const nextStepName =
          PartnerRegisterUtils.getActiveStepName(nextStepIndex);
        setStepName(nextStepName);
        setCurrentStepIndex(nextStepIndex);
      }
    } catch (error) {}
  };

  const handleValidation = async () => {
    try {
      await form.validateFields();
      handleNextStep();
    } catch (error) {}
  };



  function renderView() {
    return (
      <div className={"contentWrapper"}>
        <Form
          name={"jobForm"}
          form={form}
          initialValues={{
            categoryProjectIds: [],
            locationId: null,
            experienceId: null,
            tagIds: [],
            languageIds: [],
            workHistories: [],
            position: "",
            description: "",
            citizenId: "",
            phoneNumber: userInfo?.phoneNumber || null,
            categoryServiceIds: [],
            serviceIds: [],
          }}
          onFinish={async (values) => {
            const formData = new FormData();
            // formData.append('category_project_id', values.categoryId);
            if (values?.languageIds && values.languageIds?.length > 0) {
              values?.languageIds?.forEach((langId: number, idx: number) => {
                formData.append(`languages[${idx}]`, langId.toString());
              });
            }
            formData.append("location_id", values?.locationId);
            formData.append("position", values?.position);
            formData.append("front_card", values.frontCard);
            formData.append("back_card", values?.backCard);
            formData.append("tax_code", values?.taxCode);
            formData.append("name_rep", values?.nameRep);
            formData.append("business_license", values?.businessLicense);
            formData.append(
              "bank_id",
              values.bankId !== undefined && values.bankId !== null
                ? values.bankId
                : ""
            );
            formData.append(
              "account_number",
              values?.accountNumber !== undefined &&
                values?.accountNumber !== null
                ? values?.accountNumber
                : ""
            );
            formData.append("card_number", values?.cardNumber);
            formData.append("portrait_card", values?.portraitCard);
            formData.append(
              "qr_code",
              values?.qrCode !== undefined && values?.qrCode !== null
                ? values?.qrCode
                : ""
            );
            if (values.skillIds && values.skillIds.length > 0) {
              values.skillIds.forEach((skillId: number, idx: number) => {
                formData.append(`main_skills[${idx}]`, skillId.toString());
              });
            }
            values.categoryProjectIds.forEach((id: number) => {
              formData.append("category_project_ids[]", id.toString());
            });
            values.categoryServiceIds.forEach((id: number) => {
              formData.append("category_service_ids[]", id.toString());
            });
            values.serviceIds.forEach((id: number) => {
              formData.append("service_ids[]", id.toString());
            });

           

            try {
              // if (values.citizenId !== userInfo?.citizenId) {
              //   await mutateCitizenIdAsync(values.citizenId as string);
              // }

              await mutateAsync(formData as unknown as PartnerRegisterParams);

              // await mutateAsync({
              //   // attachments: documentList.map((item) => ({
              //   //   name: item.name,
              //   //   description: item.description,
              //   //   file: item.file,
              //   // })),
              //   category_project_id: values.categoryId,
              //   languages: values.languageIds,
              //   location_id: values.locationId,
              //   position: values.position,
              //   // tags: values.tagIds,
              //   // work_experience_id: values.experienceId,
              //   // citizen_photo_front: values.citizen_photo_front,
              //   // citizen_photo_back: values.citizen_photo_back,
              //   front_card: values.front_card,
              //   back_card: values.back_card,
              //   // workHistories: values.workHistories,
              //   // description: values.description,
              //   // phone_number: values.phoneNumber,
              //   tax_code: values.taxCode,
              //   name_rep: values.nameRep,
              //   business_license: values.businessLicense,
              //   bank_id: values.bankId,
              //   card_number: values.cardNumber,
              //   portrait_card: values.portrait_card,
              //   account_number: values.accountNumber,
              //   qr_code: values.qrCode,
              //   main_skills: values.skillIds,
              // });
            } catch (error) {}
          }}
          layout={"vertical"}
          className={"jobFormContainer"}
        >
          <div className={"jobFormTitleContainer"}>
            <Typography.Title className={"jobFormTitle"} level={3}>
              {pageTitle}
            </Typography.Title>
          </div>

          <div
            className={"jobStepControlContainer"}
            style={{ marginBottom: 15 }}
          >
            <Steps
              current={stepIndex}
              onChange={onChangeStepIndex}
              size={"small"}
              labelPlacement="vertical"
              items={steps as any}
              className={"jobSteps"}
              key={"title"}
            />
          </div>

          {stepName === Constants.PARTNER.TAB.REGISTER_INFO &&
            fullProfileResource?.accountType === "PERSONAL" && (
              <div className="formGroupContainer active">
                <PartnerRegisterInfo
                  form={form}
                  auth={fullProfileResource}
                  setStepName={setStepName}
                />
              </div>
            )}

          {stepName === Constants.PARTNER.TAB.REGISTER_INFO &&
            fullProfileResource?.accountType === "BUSINESS" && (
              <div className="formGroupContainer active">
                <PartnerCompanyRegisterInfo
                  form={form}
                  auth={fullProfileResource}
                  setStepName={setStepName}
                />
              </div>
            )}

          {stepName === Constants.PARTNER.TAB.REGISTER_VERIFY &&
            fullProfileResource?.accountType === "PERSONAL" && (
              <div className="formGroupContainer active">
                <PartnerRegisterVerify
                  auth={fullProfileResource}
                  setStepName={setStepName}
                />
              </div>
            )}

          {stepName === Constants.PARTNER.TAB.REGISTER_VERIFY &&
            fullProfileResource?.accountType === "BUSINESS" && (
              <div className="formGroupContainer active">
                <PartnerCompanyRegisterVerify
                  auth={fullProfileResource}
                  setStepName={setStepName}
                  businessLicenseFile={businessLicenseFile}
                  setBusinessLicenseFile={setBusinessLicenseFile}
                />
              </div>
            )}

          {stepName === Constants.PARTNER.TAB.REGISTER_PAYMENT &&
            fullProfileResource && (
              <div className="formGroupContainer active">
                <PartnerRegisterPayment
                  auth={fullProfileResource}
                  setStepName={setStepName}
                />
              </div>
            )}

          {stepName === Constants.PARTNER.TAB.REGISTER_CONFIRM &&
            fullProfileResource?.accountType === "PERSONAL" && (
              <div className="formGroupContainer active">
                <PartnerRegisterConfirm
                  auth={fullProfileResource}
                  setStepName={setStepName}
                  form={form}
                />
              </div>
            )}

          {stepName === Constants.PARTNER.TAB.REGISTER_CONFIRM &&
            fullProfileResource?.accountType === "BUSINESS" && (
              <div className="formGroupContainer active">
                <PartnerCompanyRegisterConfirm
                  auth={fullProfileResource}
                  setStepName={setStepName}
                  businessLicenseFile={businessLicenseFile}
                  setBusinessLicenseFile={setBusinessLicenseFile}
                  form={form}
                />
              </div>
            )}

          <div className={"formGroupContainer"}>
            <div className={"formGroupContentContainer"}>
              {/* <Row gutter={[20, 0]}>
                    <Col xs={24}> */}
              <Form.Item
                name={"acceptCondition"}
                valuePropName="checked"
                rules={
                  stepIndex === 3
                    ? [
                        {
                          validator: async (_, checked) => {
                            if (!checked) {
                              return Promise.reject(
                                new Error(
                                  "Bạn cần đồng ý với điều khoản dịch vụ và chính sách bảo mật của iAgree"
                                )
                              );
                            }
                          },
                        },
                      ]
                    : []
                }
              >
                <Checkbox name={"acceptCondition"}>
                  Tôi đã đọc và đồng ý với{" "}
                  <Link
                    target={"_blank"}
                    href={TermOfUseRouteUtils.toScreen()}
                    className={"termAndConditionLinkText link"}
                  >
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link
                    target={"_blank"}
                    href={PrivacyPolicyRouteUtils.toScreen()}
                    className={"termAndConditionLinkText link"}
                  >
                    Chính sách bảo mật
                  </Link>{" "}
                  của iAgree
                </Checkbox>
              </Form.Item>
              {/* </Col>
                </Row> */}
            </div>
          </div>

          {stepIndex === 0 ? (
            <Row
              gutter={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Col xs={24} lg={12}>
                <Button
                  size={"large"}
                  block
                  type={"primary"}
                  onClick={() => {
                    handleValidation();
                  }}
                >
                  {"Tiếp theo"}
                </Button>
              </Col>
            </Row>
          ) : (
            <>
              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <Button
                    size={"large"}
                    block
                    onClick={() => {
                      handlePrevStep();
                    }}
                  >
                    {"Quay lại"}
                  </Button>
                </Col>

                <Col xs={24} lg={12}>
                  {stepIndex === 3 ? (
                    <Button
                      size={"large"}
                      block
                      type={"primary"}
                      onClick={() => {
                        form.submit();
                        // handleSubmit();
                      }}
                    >
                      {"Hoàn tất"}
                    </Button>
                  ) : (
                    <Button
                      size={"large"}
                      block
                      type={"primary"}
                      onClick={() => {
                        handleValidation();
                      }}
                    >
                      {"Tiếp theo"}
                    </Button>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Form>
      </div>
    );
  }

  return (
    <RootLayout>
      <Head>
        <title>{`${pageTitle}`}</title>
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
              {
                title: (
                  <Link href={PartnerRouteUtils.toPartnersSearchScreen()}>Đối tác</Link>
                ),
              },
              { title: pageTitle },
            ]}
          />
        </div>
      </section>
      <section className={"sectionContainer"}>
        <div className={"jobFormSectionContainer"}>{renderView()}</div>
      </section>

      <PartnerRegisterSuccessModal ref={partnerRegisterSuccessModalRef} />
    </RootLayout>
  );
}
