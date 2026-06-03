import { useAccountContext } from "@/src/contexts/AccountContext";
import { Row, Col, Form, Input, Select, Typography, Button } from "antd";
import { useMemo, useState } from "react";
import { usePartnerSelectBox } from "../../hooks/usePartnerSelectBox";
import { PartnerSelectBoxResource } from "@/src/data/partner/models/partner.types";
import { PartnerRegisterProps } from "../PartnerRegisterScreen";
// import AppIDUpload from "../../components/AppIDUpload";
import BusinessLicenseViewModal from "../modals/BusinessLicenseViewModal";
import { EyeOutlined } from "@ant-design/icons";
import AppIDUpload from "@/src/screens/ProfileScreen/components/AppIDUpload";
import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";

function PartnerCompanyRegisterConfirm(
  props: PartnerRegisterProps & { form: any }
) {
  const { auth: userInfo } = useAccountContext();
  const selectBoxQuery = usePartnerSelectBox();
  // const selectBoxResource: PartnerSelectBoxResource = selectBoxQuery.data;
  const selectBoxResource = selectBoxQuery.data as PartnerSelectBoxResource;
  const [isBusinessLicenseModalVisible, setIsBusinessLicenseModalVisible] =
    useState(false);

  const { form } = props;

  // Watch the selected categoryId
  const selectedCategoryIds = Form.useWatch("categoryProjectIds", form);
  const selectedCategoryServiceIds = Form.useWatch("categoryServiceIds", form);

  // Filter categoryServices based on selected categoryIds - for display only
  const serviceCategoriesAvailable: CateServiceResource[] = useMemo(() => {
    // Find all categoryServices for selected categories
    if (!selectedCategoryIds) return [];

    return selectBoxResource.categories
      .filter((category) => {
        if (Array.isArray(selectedCategoryIds)) {
          return selectedCategoryIds.includes(category.categoryId);
        }
        return category.categoryId === selectedCategoryIds;
      })
      .flatMap((category) => category.childrens || []);
  }, [selectedCategoryIds, selectBoxResource.categories]);

  // Filter services based on selected categoryServiceIds - for display only
  const servicesAvailable: ServiceResource[] = useMemo(() => {
    // Find all services for selected service categories
    if (!selectedCategoryServiceIds) return [];

    return selectBoxResource?.categories
      ?.flatMap((category) => category.childrens || [])
      ?.filter((serviceCategory) => {
        if (Array.isArray(selectedCategoryServiceIds)) {
          return selectedCategoryServiceIds?.includes(
            serviceCategory?.cateServiceId
          );
        }
        return serviceCategory?.cateServiceId === selectedCategoryServiceIds;
      })
      .flatMap((serviceCategory) => serviceCategory?.childrens || []);
  }, [selectedCategoryServiceIds, selectBoxResource?.categories]);

  return (
    <>
      <div className={"formGroupContainer"}>
        <div className={"formGroupContentContainer"}>
          <Row gutter={[20, 0]}>
            <Col xs={24} lg={24}>
              <Typography.Title>Thông tin doanh nghiệp</Typography.Title>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item label={"Tên doanh nghiệp"}>
                <Input value={userInfo?.fullName} disabled size={"large"} />
              </Form.Item>

              <Form.Item label={"Lĩnh vực"} name={"categoryProjectIds"}>
                <Select
                  mode={"multiple"}
                  options={selectBoxResource.categories.map((catItem) => ({
                    value: catItem.categoryId,
                    label: catItem.name,
                  }))}
                  placeholder={"Chọn lĩnh vực"}
                  size={"large"}
                  disabled
                />
              </Form.Item>

              <Form.Item label={"Danh mục dịch vụ"} name={"categoryServiceIds"}>
                <Select
                  mode={"multiple"}
                  options={serviceCategoriesAvailable.map((catItem) => ({
                    value: catItem.cateServiceId,
                    label: catItem.name,
                  }))}
                  placeholder={
                    !selectedCategoryIds
                      ? "Vui lòng chọn lĩnh vực"
                      : "Chọn danh mục dịch vụ"
                  }
                  size={"large"}
                  showSearch
                  disabled
                  notFoundContent="Không có dữ liệu"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item label={"Địa điểm"} name={"locationId"}>
                <Select
                  options={selectBoxResource.locations.items.map((locItem) => ({
                    value: locItem.locationId,
                    label: locItem.name,
                  }))}
                  placeholder={"Chọn địa điểm"}
                  size={"large"}
                  disabled
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item label={"Mã số thuế doanh nghiệp"} name={"taxCode"}>
                <Input
                  size={"large"}
                  placeholder={"Nhập mã số thuế doanh nghiệp"}
                  disabled
                />
              </Form.Item>

              <Form.Item label={"Ngôn ngữ"} name={"languageIds"}>
                <Select
                  mode={"multiple"}
                  options={selectBoxResource.languages.items.map(
                    (languageItem) => ({
                      value: languageItem.languageId,
                      label: languageItem.name,
                    })
                  )}
                  placeholder={"Chọn ngôn ngữ"}
                  size={"large"}
                  disabled
                />
              </Form.Item>

              <Form.Item label={"Dịch vụ"} name={"serviceIds"}>
                <Select
                  mode={"multiple"}
                  options={servicesAvailable.map((serviceItem) => ({
                    value: serviceItem.serviceId,
                    label: serviceItem.name,
                  }))}
                  placeholder={
                    !selectedCategoryServiceIds
                      ? "Vui lòng chọn danh mục dịch vụ"
                      : "Chọn dịch vụ"
                  }
                  size={"large"}
                  showSearch
                  disabled
                  notFoundContent="Không có dữ liệu"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                />
              </Form.Item>

              <Form.Item
                label={"Giấy phép kinh doanh"}
                name={"businessLicense"}
              >
                {props.businessLicenseFile ? (
                  <div style={{ marginBottom: 8 }}>
                    <Typography.Text strong>Tệp đã tải lên: </Typography.Text>
                    <span>{props.businessLicenseFile.name}</span>
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      onClick={() => setIsBusinessLicenseModalVisible(true)}
                      style={{ marginLeft: 8 }}
                    >
                      Xem file
                    </Button>
                  </div>
                ) : (
                  <Typography.Text type="secondary">
                    Chưa có file nào được tải lên
                  </Typography.Text>
                )}
              </Form.Item>
            </Col>

            <Col xs={24} lg={24}>
              <Typography.Title>
                Thông tin người đại diện theo pháp luật
              </Typography.Title>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item label={"Người đại diện"} name={"nameRep"}>
                <Input size={"large"} placeholder={"Người đại diện"} disabled />
              </Form.Item>

              <Form.Item label={"Hình CCCD/CMND mặt trước"} name={"frontCard"}>
                <AppIDUpload disabled={true} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item
                label={"Số CCCD/CMND của người đại diện"}
                name={"cardNumber"}
              >
                <Input
                  size={"large"}
                  placeholder={"Nhập số CCCD/CMND"}
                  disabled
                />
              </Form.Item>

              <Form.Item label={"Hình CCCD/CMND mặt sau"} name={"backCard"}>
                <AppIDUpload disabled={true} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item
                label={"Hình chân dung cầm CCCD/CMND"}
                name={"portraitCard"}
              >
                <AppIDUpload disabled={true} />
              </Form.Item>
            </Col>

            <Col xs={24} lg={24}>
              <Typography.Title>Thông tin thanh toán</Typography.Title>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item label={"Ngân hàng"} name={"bankId"}>
                <Select
                  options={selectBoxResource.banks.map((bankItem) => ({
                    value: bankItem.bankId,
                    label: bankItem.name,
                  }))}
                  placeholder={"Chọn ngân hàng"}
                  size={"large"}
                  disabled
                />
              </Form.Item>

              <Form.Item
                label={"Hình QR mã tài khoản nhận thanh toán"}
                name={"qrCode"}
              >
                <AppIDUpload disabled={true} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Form.Item label={"Số tài khoản"} name={"accountNumber"}>
                <Input
                  size={"large"}
                  placeholder={"Nhập số tài khoản"}
                  disabled
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>

      <BusinessLicenseViewModal
        isVisible={isBusinessLicenseModalVisible}
        onClose={() => setIsBusinessLicenseModalVisible(false)}
        businessLicenseFile={props.businessLicenseFile || null}
      />
    </>
  );
}

export default PartnerCompanyRegisterConfirm;
