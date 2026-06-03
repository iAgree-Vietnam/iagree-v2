import React, { useMemo, useState } from "react";
import { Typography, Space, Tag, List, Row, Col, Progress } from "antd";
import { StarFilled } from "@ant-design/icons";

import Constants from "@/src/constants/Constants";
import { ConstantsHelper } from "@/src/constants/ConstantsHelper";
import { usePaginatedReviews } from "@/src/screens/PartnerScreen/hooks/usePaginatedReviews";
import { ReviewItem } from "@/src/components/partner/ReviewItem";
import {
  CountByRate,
  PartnerFilterParams,
  ReviewResource,
} from "@/src/data/partner/models/partner.types";
import { DatasResource } from "@/src/data/base/models/base.types";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import { RawReviewResource } from "@/src/data/partner/models/partner.raw";
import { filter, includes, isEmpty, meanBy, reverse, size } from "lodash";
import ArrayUtils from "@/src/utils/ArrayUtils";

export interface PartnerRatingProps {
  partnerId: number;
  initData?: DatasResource<ReviewResource> & {
    rateAvg: number;
    countByRate: CountByRate;
  };
  reviews?: RawReviewResource[];
  isProfileDetails: boolean;
}

export function PartnerReviews({
  partnerId,
  isProfileDetails,
  reviews,
}: PartnerRatingProps) {
  const [filters, setFilters] = useState<Partial<PartnerFilterParams>>({
    page: 1,
    rate: Constants.RATING.ALL,
  });
  const { isDesktop } = useBreakpoint();

  const ratingItem = useMemo(() => {
    return Object.values(Constants.RATING).map((item) => ({
      label: ConstantsHelper.getRatingTitle(item),
      value: item,
    }));
  }, []);

  const { data: reviewss, isFetching } = usePaginatedReviews({
    filters: filters,
    initData: undefined,
    partnerId,
  });
  const reviewWithRate = useMemo(() => {
    return includes([Constants?.RATING.ALL], filters?.rate)
      ? reviews
      : reviews?.filter((it) => includes([it?.rate], filters?.rate));
  }, [filters?.rate]);
  return (
    <div className={"partnerDetailPartContainer"}>
      <Row gutter={[40, 20]} style={{ marginBottom: "40px" }}>
        <Col
          {...(!isDesktop ? { span: 24 } : { flex: "240px" })}
          style={{ flexShrink: 0 }}
        >
          <div className={"rateAvgContainer"}>
            <Space style={{ marginBottom: "10px" }}>
              <Typography.Paragraph
                className={"nm-typo"}
                style={{
                  fontSize: "40px",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                {Number(meanBy(reviews, "rate") || 0).toFixed(2)}
              </Typography.Paragraph>
              <StarFilled style={{ fontSize: "36px", color: "#09993E" }} />
            </Space>
            <Typography.Paragraph
              className={"nm-typo"}
              style={{
                fontSize: "20px",
                fontWeight: 500,
                lineHeight: "normal",
                color: "#74767E",
              }}
            >
              {size(reviews)} đánh giá
            </Typography.Paragraph>
          </div>
        </Col>
        <Col flex={"auto"} className={"rateOverView"}>
          {[5, 4, 3, 2, 1].map((rate) => {
            const count = ConstantsHelper.countByRateKey(reviews || [], rate);
            const total = size(reviews);

            return (
              <Row key={rate} gutter={20} align="middle">
                <Col>
                  <Space size={4}>
                    <Typography.Paragraph
                      className="nm-typo"
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "normal",
                      }}
                    >
                      {rate}
                    </Typography.Paragraph>
                    <StarFilled
                      style={{ fontSize: "14px", color: "#09993E" }}
                    />
                  </Space>
                </Col>

                <Col flex="auto">
                  <Progress
                    percent={total ? (count / total) * 100 : 0}
                    showInfo={false}
                  />
                </Col>

                <Col>
                  <Typography.Paragraph
                    className="nm-typo"
                    style={{
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "normal",
                    }}
                  >
                    ({count})
                  </Typography.Paragraph>
                </Col>
              </Row>
            );
          })}
        </Col>
      </Row>

      <div className="partnerDetailPartTitleContainer">
        <Typography.Title
          className={"partnerDetailPartTitle nm-typo"}
          level={3}
        >
          {isProfileDetails ? "Đánh giá từ khách hàng" : "Đánh giá"} (
          {reviews?.length})
        </Typography.Title>
      </div>

      <div className={"partnerDetailPartContentContainer"}>
        <Row gutter={[12, 12]}>
          {ratingItem.map((item) => (
            <Col key={item.value} flex={1}>
              <Tag.CheckableTag
                className={"app-checkable-tag"}
                checked={filters.rate === item.value}
                onClick={() =>
                  setFilters((prevState) => ({
                    ...prevState,
                    rate: item.value,
                    page: 1,
                  }))
                }
              >
                <Space size={4} align={"center"}>
                  {item.label}
                  {item.value !== Constants.RATING.ALL && (
                    <span className={"secondary hoverActive"}>
                      <StarFilled style={{ fontSize: "15px" }} />
                    </span>
                  )}
                  <span className={"secondary"}>
                    {/* {ConstantsHelper.getCountByRate(
                      (initData?.countByRate || undefined),
                      // initData.total,
                      reviews?.total,
                      item.value
                    )} */}

                    {`(${
                      item.value !== Constants.RATING.ALL
                        ? ConstantsHelper.countByRateKey(
                            reviews || [],
                            item.value
                          )
                        : reviews?.length
                    })`}
                  </span>
                </Space>
              </Tag.CheckableTag>
            </Col>
          ))}
        </Row>
        <List
          pagination={{
            current: filters.page,
            pageSize: 3,
            total: size(reviewWithRate),
            align: "center",
            onChange: (pageNumber) =>
              setFilters((prevState) => ({ ...prevState, page: pageNumber })),
            hideOnSinglePage: true,
            showSizeChanger: false,
          }}
          loading={isFetching}
          dataSource={reverse(ArrayUtils.sortByDateDesc(reviewWithRate, "created_at", 'desc'))}
          locale={{ emptyText: "Không có dữ liệu" }}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
            xxl: 1,
          }}
          className={"reviewsListContainer"}
          renderItem={(item) => {
            return (
              <List.Item className={"reviewsItemWrapper"}>
                <ReviewItem reviewData={item} />
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
}
