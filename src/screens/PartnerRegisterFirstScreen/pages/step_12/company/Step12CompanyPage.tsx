
import { Typography, Row, Col, Divider, Tag, FormInstance } from "antd";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";
import { PARTNER_REGISTER_FORM } from "../../../constants/PartnerRegisterConstants";
import {
  getServiceName,
  getServiceCategoryName,
  getSkillName,
  getLanguageName,
  getLocationName,
  getBankName,
} from "../../../hooks/dataHelpers";
import datetimeUtils from "@/src/utils/DatetimeUtils";
import PartnerTermsAndConditions from "../../../components/PartnerTermsAndConditions";
import { useMemo } from "react";

interface Step12CompanyPageProps {
  form: FormInstance;
  selectBoxResource?: PartnerSelectBoxResource;
}

export const Step12CompanyPage: React.FC<Step12CompanyPageProps> = ({
  form,
  selectBoxResource,
}) => {
  const step1V2Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP1_V2_DATA
  );

  const step2V2Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP2_V2_DATA
  );

  const step3V2Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP3_V2_DATA
  );

  const step4Data = form.getFieldValue(
    // PARTNER_REGISTER_FORM.FIELD_NAME.STEP4_DATA
    'workHistories'
  );
  const step5Data = form.getFieldValue(
    // PARTNER_REGISTER_FORM.FIELD_NAME.STEP5_DATA
    'featuredProjects'
  );
  const step6Data = form.getFieldValue(
    // PARTNER_REGISTER_FORM.FIELD_NAME.STEP6_DATA
    'partnerEducations'
  );
  const step7Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP7_DATA
  );
  const step8Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA
  );
  const step9CompanyData = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP9_COMPANY_DATA
  );
  const step10Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP10_DATA
  );
  const step11Data = form.getFieldValue(
    PARTNER_REGISTER_FORM.FIELD_NAME.STEP11_DATA
  );

  const avatarUrl = useMemo(() => {
    if (
      step1V2Data?.avatar &&
      Array.isArray(step1V2Data.avatar) &&
      step1V2Data.avatar.length > 0
    ) {
      const file = step1V2Data.avatar[0];
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      if (file?.url) {
        return file.url;
      }
    }
    if (step1V2Data?.defaultAvatar) {
      return step1V2Data.defaultAvatar;
    }
    return null;
  }, [step1V2Data?.avatar, step1V2Data?.defaultAvatar]);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) {
      return "Hiện tại";
    }
    const momentDate = datetimeUtils.getMoment(dateString);
    return momentDate
      ? momentDate.format(datetimeUtils.LOCAL_DATE_WITHOUT_DAY)
      : dateString;
  };

  const hasServiceAndSkillData =
    (step2V2Data && Object.keys(step2V2Data).length > 0) ||
    step3V2Data?.selectedSkillIds?.length > 0;

  const hasLanguageAndLocationData =
    step8Data?.languageIds?.length > 0 || step8Data?.locationIds?.length > 0;

  // const hasExperienceData =
  //   step4Data?.workHistories?.length > 0 ||
  //   step5Data?.featuredProjects?.length > 0 ||
  //   step6Data?.partnerEducations?.length > 0;

  const hasExperienceData =
    step4Data?.length > 0 ||
    step5Data?.length > 0 ||
    step6Data?.length > 0;

  const hasCompanyVerificationData =
    step9CompanyData?.taxCode || step9CompanyData?.businessLicense;

  const hasLegalRepData =
    step9CompanyData?.nameRep ||
    step9CompanyData?.cardNumber ||
    step9CompanyData?.frontCard ||
    step9CompanyData?.backCard ||
    step9CompanyData?.portraitCard;

  const hasPaymentData =
    step10Data?.bankId ||
    step10Data?.accountNumber ||
    step10Data?.qrCode ||
    step10Data?.bankAccountName;

  const hasVerificationAndPaymentData =
    hasCompanyVerificationData || hasLegalRepData || hasPaymentData;

  return (
    <div style={{ padding: "0 0" }}>
      <Typography.Title
        level={2}
        style={{ margin: 0, color: "#333", marginBottom: "10px" }}
      >
        Hãy kiểm tra lại thông tin
      </Typography.Title>
      <Typography.Text style={{ color: "#09993E" }}>
        Vui lòng xem lại các thông tin bên dưới trước khi hoàn tất đăng ký.
      </Typography.Text>
      <Divider style={{ borderColor: "#D4D4D4", margin: "20px 0" }} />
      <Row gutter={[32, 32]}>
        <Col span={24} md={12}>
          <Typography.Title level={4} style={{ color: "#09993E" }}>
            Thông tin Cá nhân & Giới thiệu (Bước 1 & 7)
          </Typography.Title>
          {avatarUrl && (
            <div style={{ marginBottom: "16px" }}>
              <Typography.Text strong>Ảnh đại diện:</Typography.Text>
              <div
                style={{
                  marginTop: "8px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "1px solid #d9d9d9",
                }}
              >
                <img
                  src={avatarUrl}
                  alt="Ảnh đại diện"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          )}
          {step1V2Data?.professionalRole && (
            <div style={{ marginBottom: "16px" }}>
              <Typography.Text strong>Ngành nghề:</Typography.Text>
              <Typography.Text style={{ display: "block" }}>
                {step1V2Data.professionalRole}
              </Typography.Text>
            </div>
          )}
          {step7Data?.selfIntroduction && (
            <div style={{ marginBottom: "16px" }}>
              <Typography.Text strong>Giới thiệu bản thân:</Typography.Text>
              <Typography.Paragraph>
                {step7Data.selfIntroduction}
              </Typography.Paragraph>
            </div>
          )}
          <Divider />
          {hasServiceAndSkillData && (
            <>
              <Typography.Title level={4} style={{ color: "#09993E" }}>
                Dịch vụ & Kỹ năng (Bước 2 & 3)
              </Typography.Title>
              {step2V2Data && Object.keys(step2V2Data).length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text strong>Dịch vụ:</Typography.Text>
                  {Object.keys(step2V2Data).map((catId) => (
                    <div key={catId} style={{ marginTop: "8px" }}>
                      <Typography.Text strong style={{ color: "#09993E" }}>
                        {
                          selectBoxResource?.categories.find(
                            (c) => c.categoryId === Number(catId)
                          )?.name
                        }
                        :
                      </Typography.Text>
                      <div style={{ paddingLeft: "15px" }}>
                        {step2V2Data[catId]?.selectedServiceCategories?.map(
                          (sc: any) => (
                            <div key={sc.id}>
                              <Typography.Text italic>
                                -{" "}
                                {getServiceCategoryName(
                                  selectBoxResource?.categories,
                                  sc.id
                                )}
                              </Typography.Text>
                              {sc.services?.length > 0 && (
                                <div style={{ paddingLeft: "15px" }}>
                                  {sc.services.map((serviceId: number) => (
                                    <Typography.Text
                                      key={serviceId}
                                      style={{ display: "block" }}
                                    >
                                      -{" "}
                                      {getServiceName(
                                        selectBoxResource?.categories,
                                        serviceId
                                      )}
                                    </Typography.Text>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {step3V2Data?.selectedSkillIds?.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text strong>Kỹ năng:</Typography.Text>
                  <div>
                    {step3V2Data.selectedSkillIds.map((skillId: number) => (
                      <Tag key={skillId} style={{ marginTop: "8px" }}>
                        {getSkillName(selectBoxResource?.skills, skillId)}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
              <Divider />
            </>
          )}

          {hasLanguageAndLocationData && (
            <>
              <Typography.Title level={4} style={{ color: "#09993E" }}>
                Ngôn ngữ & Địa điểm (Bước 8)
              </Typography.Title>
              {step8Data?.languageIds?.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text strong>Ngôn ngữ:</Typography.Text>
                  <div>
                    {step8Data.languageIds.map((langId: number) => (
                      <Tag key={langId} style={{ marginTop: "8px" }}>
                        {getLanguageName(selectBoxResource?.languages, langId)}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
              {step8Data?.locationIds?.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text strong>Địa điểm:</Typography.Text>
                  <div>
                    {step8Data.locationIds.map((locId: number) => (
                      <Tag key={locId} style={{ marginTop: "8px" }}>
                        {getLocationName(selectBoxResource?.locations, locId)}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
              <Divider />
            </>
          )}

          {step11Data?.referralCode && (
            <>
              <Typography.Title level={4} style={{ color: "#09993E" }}>
                Mã giới thiệu (Bước 11)
              </Typography.Title>
              <Typography.Text>
                <span style={{ fontWeight: "bold" }}>Mã:</span>{" "}
                {step11Data.referralCode}
              </Typography.Text>
            </>
          )}
        </Col>
        <Col span={24} md={12}>
          {hasExperienceData && (
            <>
              <Typography.Title level={4} style={{ color: "#09993E" }}>
                Lịch sử làm việc, Dự án tiêu biểu & Học vấn, Chứng chỉ (Bước 4,
                5, 6)
              </Typography.Title>
              {step4Data?.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text strong>
                    Kinh nghiệm làm việc:
                  </Typography.Text>
                  {step4Data.workHistories.map((exp: any, index: number) => (
                    <div
                      key={index}
                      style={{ marginBottom: "8px", paddingLeft: "15px" }}
                    >
                      {exp.position && exp.name && (
                        <Typography.Text strong style={{ display: "block" }}>
                          - {exp.position} tại {exp.name}
                        </Typography.Text>
                      )}
                      {(exp.start_date || exp.end_date) && (
                        <Typography.Text italic style={{ display: "block" }}>
                          Từ {formatDate(exp.start_date)} đến{" "}
                          {formatDate(exp.end_date)}
                        </Typography.Text>
                      )}
                      {exp.description && (
                        <Typography.Text italic style={{ display: "block" }}>
                          {exp.description}
                        </Typography.Text>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {step5Data?.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text strong>Dự án đã thực hiện:</Typography.Text>
                  {step5Data.featuredProjects.map(
                    (proj: any, index: number) => (
                      <div
                        key={index}
                        style={{ marginBottom: "8px", paddingLeft: "15px" }}
                      >
                        {proj.name && (
                          <Typography.Text strong style={{ display: "block" }}>
                            - {proj.name}
                          </Typography.Text>
                        )}
                        {proj.role && (
                          <Typography.Text italic style={{ display: "block" }}>
                            Vai trò: {proj.role}
                          </Typography.Text>
                        )}
                        {(proj.start_date || proj.end_date) && (
                          <Typography.Text italic style={{ display: "block" }}>
                            Thời gian: {formatDate(proj.start_date)} -{" "}
                            {formatDate(proj.end_date)}
                          </Typography.Text>
                        )}
                        {proj.description && (
                          <Typography.Text italic style={{ display: "block" }}>
                            Mô tả: {proj.description}
                          </Typography.Text>
                        )}
                        {proj.achievements && (
                          <Typography.Text italic style={{ display: "block" }}>
                            Thành tựu: {proj.achievements}
                          </Typography.Text>
                        )}
                        {/* {proj.projectUrl && (
                          <Typography.Text italic style={{ display: "block" }}>
                            Link dự án:{" "}
                            <a
                              href={proj.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {proj.projectUrl}
                            </a>
                          </Typography.Text>
                        )} */}
                        {proj.image && (
                          <Typography.Text italic style={{ display: "block" }}>
                            Hình bìa: Đã tải lên
                          </Typography.Text>
                        )}
                        {proj.files && proj.files.length > 0 && (
                          <Typography.Text italic style={{ display: "block" }}>
                            Tệp đính kèm: Đã tải lên ({proj.files.length} tệp)
                          </Typography.Text>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
              {step6Data?.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text strong>Học vấn & Chứng chỉ:</Typography.Text>
                  {step6Data.partnerEducations.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        style={{ marginBottom: "8px", paddingLeft: "15px" }}
                      >
                        {item.type === "education" ? (
                          <>
                            {item.name && (
                              <Typography.Text
                                strong
                                style={{ display: "block" }}
                              >
                                - Học vấn: {item.name}
                              </Typography.Text>
                            )}
                            {(item.degree ||
                              item.majors ||
                              item.start_date ||
                              item.end_date) && (
                              <Typography.Text
                                italic
                                style={{ display: "block" }}
                              >
                                {item.degree} - {item.majors} (
                                {formatDate(item.start_date)} -{" "}
                                {formatDate(item.end_date)})
                              </Typography.Text>
                            )}
                            {item.description && (
                              <Typography.Text
                                italic
                                style={{ display: "block" }}
                              >
                                {item.description}
                              </Typography.Text>
                            )}
                          </>
                        ) : (
                          <>
                            {item.name && (
                              <Typography.Text
                                strong
                                style={{ display: "block" }}
                              >
                                - Chứng chỉ: {item.name}
                              </Typography.Text>
                            )}
                            {item.start_date && (
                              <Typography.Text
                                italic
                                style={{ display: "block" }}
                              >
                                Ngày cấp: {formatDate(item.start_date)}
                                {item.end_date &&
                                  ` - Ngày hết hạn: ${formatDate(
                                    item.end_date
                                  )}`}
                              </Typography.Text>
                            )}
                            {item.grade && (
                              <Typography.Text
                                italic
                                style={{ display: "block" }}
                              >
                                Điểm: {item.grade}
                              </Typography.Text>
                            )}
                            {item.description && (
                              <Typography.Text
                                italic
                                style={{ display: "block" }}
                              >
                                {item.description}
                              </Typography.Text>
                            )}
                          </>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}
          <Divider />
          {hasVerificationAndPaymentData && (
            <>
              <Typography.Title level={4} style={{ color: "#09993E" }}>
                Xác minh & Thanh toán (Bước 9 & 10)
              </Typography.Title>
              {hasCompanyVerificationData && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text strong>
                    Xác minh doanh nghiệp:
                  </Typography.Text>
                  <div style={{ paddingLeft: "15px" }}>
                    {step9CompanyData?.taxCode && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>Mã số thuế:</span>{" "}
                        {step9CompanyData.taxCode}
                      </Typography.Text>
                    )}
                    {step9CompanyData?.businessLicense && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Giấy phép kinh doanh:
                        </span>{" "}
                        Đã tải lên
                      </Typography.Text>
                    )}
                  </div>
                </div>
              )}
              {hasLegalRepData && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text
                    strong
                    style={{ display: "block", marginTop: "10px" }}
                  >
                    Thông tin người đại diện theo pháp luật:
                  </Typography.Text>
                  <div style={{ paddingLeft: "15px" }}>
                    {step9CompanyData?.nameRep && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Tên người đại diện:
                        </span>{" "}
                        {step9CompanyData.nameRep}
                      </Typography.Text>
                    )}
                    {step9CompanyData?.cardNumber && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Số CCCD/CMND:
                        </span>{" "}
                        {step9CompanyData?.cardNumber}
                      </Typography.Text>
                    )}

                    {step9CompanyData?.frontCard && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Hình ảnh CCCD/CMND mặt trước:
                        </span>{" "}
                        Đã tải lên
                      </Typography.Text>
                    )}

                    {step9CompanyData?.backCard && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Hình ảnh CCCD/CMND mặt sau:
                        </span>{" "}
                        Đã tải lên
                      </Typography.Text>
                    )}

                    {step9CompanyData?.portraitCard && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Hình ảnh CCCD/CMND chân dung:
                        </span>{" "}
                        Đã tải lên
                      </Typography.Text>
                    )}
                  </div>
                </div>
              )}
              {hasPaymentData && (
                <div style={{ marginBottom: "16px" }}>
                  <Typography.Text strong>
                    Thông tin thanh toán:
                  </Typography.Text>
                  <div style={{ paddingLeft: "15px" }}>
                    {step10Data?.bankAccountName && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Tên tài khoản:
                        </span>{" "}
                        {step10Data.bankAccountName}
                      </Typography.Text>
                    )}
                    {step10Data?.bankId && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>Ngân hàng:</span>{" "}
                        {getBankName(
                          selectBoxResource?.banks,
                          step10Data.bankId
                        )}
                      </Typography.Text>
                    )}
                    {step10Data?.accountNumber && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>
                          Số tài khoản:
                        </span>{" "}
                        {step10Data.accountNumber}
                      </Typography.Text>
                    )}
                    {step10Data?.qrCode && (
                      <Typography.Text style={{ display: "block" }}>
                        <span style={{ fontWeight: "bold" }}>Mã QR:</span> Đã
                        tải lên
                      </Typography.Text>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>

      <Row gutter={[32, 32]}>
        <Col span={24} md={24}>
          <PartnerTermsAndConditions form={form} />
        </Col>
      </Row>
    </div>
  );
};
