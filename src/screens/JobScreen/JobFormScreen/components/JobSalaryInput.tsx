
import { Form, Radio, Row, Col } from "antd";
import AppInputNumber from "@/src/components/AppInputNumber";
import Constants from "@/src/constants/Constants";

interface JobSalaryInputProps {
  salaryType: number;
  setSalaryType: (type: number) => void;
}

export function JobSalaryInput({
  salaryType,
  setSalaryType,
}: JobSalaryInputProps) {
  return (
    <>
      <Form.Item label={"Thù lao công việc"} required>
        <Radio.Group
          options={[
            {
              value: Constants.JOB.SALARY_TYPE.DEAL,
              label: "Thỏa thuận",
            },
            {
              value: Constants.JOB.SALARY_TYPE.FIXED,
              label: "Cố định",
            },
            {
              value: Constants.JOB.SALARY_TYPE.RANGE,
              label: "Khoảng giá",
            },
          ]}
          onChange={(e) => setSalaryType(Number(e.target.value))}
          value={salaryType}
          optionType={"button"}
          buttonStyle={"solid"}
          className={"jobSalaryTypeContainer"}
        />
      </Form.Item>

      {salaryType === Constants.JOB.SALARY_TYPE.RANGE && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={"Từ"}
              name={"priceMin"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tiền thấp nhất",
                },
              ]}
              labelCol={{
                lg: 6,
              }}
            >
              <AppInputNumber
                size={"large"}
                placeholder={"Nhập số tiền thấp nhất"}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
            <Form.Item
              label={"Đến"}
              name={"priceMax"}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số tiền cao nhất",
                },
              ]}
              labelCol={{
                lg: 6,
              }}
            >
              <AppInputNumber
                size={"large"}
                placeholder={"Nhập số tiền cao nhất"}
              />
            </Form.Item>
          </Col>
        </Row>
      )}

      {salaryType === Constants.JOB.SALARY_TYPE.FIXED && (
        <Form.Item
          label={"Số tiền"}
          name={"price"}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số tiền cho công việc",
            },
          ]}
        >
          <AppInputNumber placeholder={"Nhập số tiền"} size={"large"} />
        </Form.Item>
      )}
    </>
  );
}
