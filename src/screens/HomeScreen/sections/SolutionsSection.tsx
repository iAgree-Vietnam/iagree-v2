import React from 'react';
import { Col, Collapse, Row, Space, Typography } from 'antd';
import { CheckCircleFilled, DownOutlined } from '@ant-design/icons';

const SolutionsSection: React.FC = () => (
  <section className="sectionContainer solutionWrapper">
    <div className="contentWrapper">
      <div className="sectionTitleContainer">
        <Typography.Title className="sectionTitle solutionSectionTitle" level={2}>
          Vì sao nên chọn <span>iAgree</span>
        </Typography.Title>
      </div>

      <div className="sectionContentContainer">
        <Row gutter={[40, 16]} className="hidden-mb">
          <Col xs={24} lg={12}>
            <div className="solutionItemContainer">
              <Typography.Title className="solutionTitle" level={3}>Đối với Khách hàng</Typography.Title>
              <Space className="solutionDescriptionContainer" size="middle" align="start">
                <CheckCircleFilled />
                <Space size={4} direction="vertical" className="d-flex">
                  <Typography.Title level={4} className="nm-typo">Tìm kiếm nhanh chóng</Typography.Title>
                  <Typography.Paragraph className="solutionDescription">
                    Kết nối với các Đối tác cung cấp dịch vụ uy tín chỉ trong vài cú click – tiết kiệm thời gian, tối ưu hiệu quả.
                  </Typography.Paragraph>
                </Space>
              </Space>
              <Space className="solutionDescriptionContainer" size="middle" align="start">
                <CheckCircleFilled />
                <Space size={4} direction="vertical" className="d-flex">
                  <Typography.Title level={4} className="nm-typo">Quy trình tiện lợi</Typography.Title>
                  <Typography.Paragraph className="solutionDescription">
                    Từ tìm kiếm, ký kết hợp đồng đến nghiệm thu, thanh toán – tất cả được thực hiện trực tuyến, đơn giản và linh hoạt.
                  </Typography.Paragraph>
                </Space>
              </Space>
              <Space className="solutionDescriptionContainer" size="middle" align="start">
                <CheckCircleFilled />
                <Space size={4} direction="vertical" className="d-flex">
                  <Typography.Title level={4} className="nm-typo">Đảm bảo chất lượng</Typography.Title>
                  <Typography.Paragraph className="solutionDescription">
                    Đối tác được xác thực, dịch vụ được kiểm duyệt – cam kết minh bạch và an toàn trong từng giao dịch.
                  </Typography.Paragraph>
                </Space>
              </Space>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="solutionItemContainer">
              <Typography.Title className="solutionTitle" level={3}>Đối với Đối tác</Typography.Title>
              <Space className="solutionDescriptionContainer" size="middle" align="start">
                <CheckCircleFilled />
                <Space size={4} direction="vertical" className="d-flex">
                  <Typography.Title level={4} className="nm-typo">Thu nhập bền vững</Typography.Title>
                  <Typography.Paragraph className="solutionDescription">
                    Tiếp nhận yêu cầu dịch vụ một cách thường xuyên, phong phú, đa dạng với thù lao và doanh thu rõ ràng, cạnh tranh.
                  </Typography.Paragraph>
                </Space>
              </Space>
              <Space className="solutionDescriptionContainer" size="middle" align="start">
                <CheckCircleFilled />
                <Space size={4} direction="vertical" className="d-flex">
                  <Typography.Title level={4} className="nm-typo">Mở rộng kết nối</Typography.Title>
                  <Typography.Paragraph className="solutionDescription">
                    Tiếp cận khách hàng tiềm năng, xây dựng thương hiệu cá nhân và mở rộng mạng lưới hợp tác lâu dài.
                  </Typography.Paragraph>
                </Space>
              </Space>
              <Space className="solutionDescriptionContainer" size="middle" align="start">
                <CheckCircleFilled />
                <Space size={4} direction="vertical" className="d-flex">
                  <Typography.Title level={4} className="nm-typo">Phát triển chuyên môn</Typography.Title>
                  <Typography.Paragraph className="solutionDescription">
                    Rèn luyện kỹ năng, tích lũy kinh nghiệm thông qua các dự án từ đơn giản cho đến phức tạp.
                  </Typography.Paragraph>
                </Space>
              </Space>
            </div>
          </Col>
        </Row>
        <Collapse
          className="featureCollapseContainer"
          ghost
          expandIcon={({ isActive }) => (
            <DownOutlined style={{ fontSize: 14 }} rotate={isActive ? 180 : 0} />
          )}
          expandIconPosition="end"
          items={[
            {
              key: '1',
              label: (
                <Typography.Title className="solutionTitle nm-typo" level={3}>
                  Đối với Khách hàng
                </Typography.Title>
              ),
              children: (
                <div>
                  <Space className="solutionDescriptionContainer" size="middle" align="start">
                    <CheckCircleFilled />
                    <Space size={4} direction="vertical" className="d-flex">
                      <Typography.Title level={4} className="nm-typo">Tìm kiếm nhanh chóng</Typography.Title>
                      <Typography.Paragraph className="solutionDescription">
                        Kết nối với các Đối tác cung cấp dịch vụ uy tín chỉ trong vài cú click – tiết kiệm thời gian, tối ưu hiệu quả.
                      </Typography.Paragraph>
                    </Space>
                  </Space>
                  <Space className="solutionDescriptionContainer" size="middle" align="start">
                    <CheckCircleFilled />
                    <Space size={4} direction="vertical" className="d-flex">
                      <Typography.Title level={4} className="nm-typo">Quy trình tiện lợi</Typography.Title>
                      <Typography.Paragraph className="solutionDescription">
                        Từ tìm kiếm, ký kết hợp đồng đến nghiệm thu, thanh toán – tất cả được thực hiện trực tuyến, đơn giản và linh hoạt.
                      </Typography.Paragraph>
                    </Space>
                  </Space>
                  <Space className="solutionDescriptionContainer" size="middle" align="start">
                    <CheckCircleFilled />
                    <Space size={4} direction="vertical" className="d-flex">
                      <Typography.Title level={4} className="nm-typo">Đảm bảo chất lượng</Typography.Title>
                      <Typography.Paragraph className="solutionDescription">
                        Đối tác được xác thực, dịch vụ được kiểm duyệt – cam kết minh bạch và an toàn trong từng giao dịch.
                      </Typography.Paragraph>
                    </Space>
                  </Space>
                </div>
              ),
            },
            {
              key: '2',
              label: (
                <Typography.Title className="solutionTitle nm-typo" level={3}>
                  Đối với Đối tác
                </Typography.Title>
              ),
              children: (
                <div>
                  <Space className="solutionDescriptionContainer" size="middle" align="start">
                    <CheckCircleFilled />
                    <Space size={4} direction="vertical" className="d-flex">
                      <Typography.Title level={4} className="nm-typo">Thu nhập bền vững</Typography.Title>
                      <Typography.Paragraph className="solutionDescription">
                        Tiếp nhận yêu cầu dịch vụ một cách thường xuyên, phong phú, đa dạng với thù lao và doanh thu rõ ràng, cạnh tranh.
                      </Typography.Paragraph>
                    </Space>
                  </Space>
                  <Space className="solutionDescriptionContainer" size="middle" align="start">
                    <CheckCircleFilled />
                    <Space size={4} direction="vertical" className="d-flex">
                      <Typography.Title level={4} className="nm-typo">Mở rộng kết nối</Typography.Title>
                      <Typography.Paragraph className="solutionDescription">
                        Tiếp cận khách hàng tiềm năng, xây dựng thương hiệu cá nhân và mở rộng mạng lưới hợp tác lâu dài.
                      </Typography.Paragraph>
                    </Space>
                  </Space>
                  <Space className="solutionDescriptionContainer" size="middle" align="start">
                    <CheckCircleFilled />
                    <Space size={4} direction="vertical" className="d-flex">
                      <Typography.Title level={4} className="nm-typo">Phát triển chuyên môn</Typography.Title>
                      <Typography.Paragraph className="solutionDescription">
                        Rèn luyện kỹ năng, tích lũy kinh nghiệm thông qua các dự án từ đơn giản cho đến phức tạp.
                      </Typography.Paragraph>
                    </Space>
                  </Space>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  </section>
);

export default SolutionsSection;
