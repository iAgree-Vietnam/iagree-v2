
import { Form, FormInstance } from "antd";
import { FullProfileResource } from "@/src/data/auth/models/types";
import Constants from "@/src/constants/Constants";

import PartnerRegisterInfo from "../parts/PartnerRegisterInfo";
import PartnerCompanyRegisterInfo from "../parts/PartnerCompanyRegisterInfo";
import PartnerRegisterVerify from "../parts/PartnerRegisterVerify";
import PartnerCompanyRegisterVerify from "../parts/PartnerCompanyRegisterVerify";
import PartnerRegisterPayment from "../parts/PartnerRegisterPayment";
import PartnerRegisterConfirm from "../parts/PartnerRegisterConfirm";
import PartnerCompanyRegisterConfirm from "../parts/PartnerCompanyRegisterConfirm";

interface PartnerRegistrationFormProps {
  form: FormInstance;
  fullProfileResource: FullProfileResource | null;
  stepName: string;
  setStepName: (stepName: string) => void;
  businessLicenseFile: File | null;
  setBusinessLicenseFile: (file: File | null) => void;
}

export function PartnerRegistrationForm({
  form,
  fullProfileResource,
  stepName,
  setStepName,
  businessLicenseFile,
  setBusinessLicenseFile,
}: PartnerRegistrationFormProps) {
  if (!fullProfileResource) {
    return null;
  }

  return (
    <Form
      name={"partnerRegisterForm"}
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
        phoneNumber: fullProfileResource?.phoneNumber || null,
        categoryServiceIds: [],
        serviceIds: [],
      }}
      layout={"vertical"}
      className={"jobFormContainer"}
    >
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
    </Form>
  );
}
