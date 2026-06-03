import React, { useMemo, useEffect } from "react";
import { Typography, Divider, Form, Select, Col, Row, message } from "antd";
import { PARTNER_REGISTER_FORM } from "../../constants/PartnerRegisterConstants";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";

const { Title, Text } = Typography;

interface Step8PageProps {
  selectBoxResource?: PartnerSelectBoxResource;
}

const MAX_LANGUAGES = 10;
const ALL_COUNTRY_LOCATION_NAME = "Toàn quốc";
const VIETNAMESE_LANGUAGE_NAME_1 = "Tiếng Việt";
const VIETNAMESE_LANGUAGE_NAME_2 = "Tiếng Việt\r";

export const Step8Page: React.FC<Step8PageProps> = ({ selectBoxResource }) => {
  const form = Form.useFormInstance();

  const selectedLanguageIds: number[] =
    Form.useWatch(
      [PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA, "languageIds"],
      form
    ) || [];

  const selectedLocationIds: number[] =
    Form.useWatch(
      [PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA, "locationIds"],
      form
    ) || [];

  const languageOptions = useMemo(
    () =>
      selectBoxResource?.languages.items.map((languageItem) => ({
        value: languageItem.languageId,
        label: languageItem.name,
      })) || [],
    [selectBoxResource]
  );

  useEffect(() => {
    if (selectBoxResource) {
      const vietnameseLang = selectBoxResource.languages.items.find(
        (item) =>
          item?.name ===
          (VIETNAMESE_LANGUAGE_NAME_1 || VIETNAMESE_LANGUAGE_NAME_2)
      );

      if (vietnameseLang) {
        const currentLanguageIds = form.getFieldValue([
          PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA,
          "languageIds",
        ]);

        if (!currentLanguageIds || currentLanguageIds.length === 0) {
          form.setFieldValue(
            [PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA, "languageIds"],
            [vietnameseLang.languageId]
          );
        }
      }
    }
  }, [selectBoxResource, form]);

  const allLocations = useMemo(
    () =>
      selectBoxResource?.locations.items.map((locItem) => ({
        value: locItem.locationId,
        label: locItem.name,
      })) || [],
    [selectBoxResource]
  );

  const allCountryLocationId = useMemo(() => {
    const allCountry = allLocations.find(
      (loc) => loc.label === ALL_COUNTRY_LOCATION_NAME
    );
    return allCountry?.value;
  }, [allLocations]);

  const isAllCountrySelected = selectedLocationIds.includes(
    allCountryLocationId as number
  );

  const locationOptions = useMemo(() => {
    if (allCountryLocationId === undefined) {
      return allLocations;
    }

    if (isAllCountrySelected) {
      return allLocations.filter((loc) => loc.value === allCountryLocationId);
    } else {
      return allLocations;
    }
  }, [allLocations, isAllCountrySelected, allCountryLocationId]);

  const handleLanguageChange = (selectedValues: number[]) => {
    if (selectedValues.length > MAX_LANGUAGES) {
      message.warning(`Bạn chỉ có thể chọn tối đa ${MAX_LANGUAGES} ngôn ngữ.`);
      return selectedValues.slice(0, MAX_LANGUAGES);
    }
    return selectedValues;
  };

  const handleLocationChange = (selectedValues: number[]) => {
    if (
      allCountryLocationId !== undefined &&
      selectedValues.includes(allCountryLocationId)
    ) {
      if (selectedValues.length > 1) {
        return [allCountryLocationId];
      }
    }
    return selectedValues;
  };

  const handleClearLanguages = () => {
    form.setFieldValue(
      [PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA, "languageIds"],
      []
    );
  };

  const handleClearLocations = () => {
    form.setFieldValue(
      [PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA, "locationIds"],
      []
    );
  };

  return (
    <div style={{ padding: "0 0", overflowX: "hidden" }}>
      <div style={{ marginBottom: "15px" }}>
        <Title
          level={2}
          style={{ margin: 0, color: "#333", marginBottom: "10px" }}
        >
          Chọn ngôn ngữ bạn sử dụng và khu vực bạn đang làm việc.
        </Title>
        <Text style={{ color: "#09993E" }}>
          Thông tin này giúp Khách hàng tìm được Đối tác phù hợp với nhu cầu
          ngôn ngữ và vị trí địa lý, đồng thời tăng cơ hội kết nối của bạn.
        </Text>
      </div>

      <Divider style={{ borderColor: "#D4D4D4", margin: "0 0 12px 0" }} />

      <Row gutter={[24, 24]}>
        {/* Cột Ngôn ngữ */}
        <Col xs={24} lg={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={5} style={{ marginBottom: 5 }}>
              Ngôn ngữ <span style={{ color: "red" }}>*</span>
            </Title>
            {selectedLanguageIds.length > 0 && (
              <a
                onClick={handleClearLanguages}
                style={{ color: "red", cursor: "pointer" }}
              >
                Bỏ chọn tất cả
              </a>
            )}
          </div>
          <Form.Item
            name={[PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA, "languageIds"]}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một ngôn ngữ!",
              },
            ]}
            getValueFromEvent={handleLanguageChange}
          >
            <Select
              mode="multiple"
              showSearch
              placeholder="Chọn ngôn ngữ"
              size="large"
              options={languageOptions}
              filterOption={(inputValue, option) =>
                (option?.label as string)
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
              maxTagCount="responsive"
            />
          </Form.Item>
        </Col>

        {/* Cột Địa điểm */}
        <Col xs={24} lg={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={5} style={{ marginBottom: 5 }}>
              Địa điểm <span style={{ color: "red" }}>*</span>
            </Title>
            {selectedLocationIds.length > 0 && (
              <a
                onClick={handleClearLocations}
                style={{ color: "red", cursor: "pointer" }}
              >
                Bỏ chọn tất cả
              </a>
            )}
          </div>
          <Form.Item
            name={[PARTNER_REGISTER_FORM.FIELD_NAME.STEP8_DATA, "locationIds"]}
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một địa điểm!",
              },
            ]}
            getValueFromEvent={handleLocationChange}
          >
            <Select
              mode="multiple"
              showSearch
              placeholder="Chọn địa điểm"
              size="large"
              options={locationOptions}
              disabled={isAllCountrySelected}
              filterOption={(inputValue, option) =>
                (option?.label as string)
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              }
              maxTagCount="responsive"
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};
