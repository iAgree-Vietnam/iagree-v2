import { Space, Typography } from "antd";

import { EducationResource } from "@/src/data/education/models/education.types";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

export interface PartnerEducationV2Props {
  educations?: EducationResource[];
}

export function PartnerEducationV2({ educations }: PartnerEducationV2Props) {
  return (
    <div>
      <Typography.Title className={"infoTitle"} level={4}>
        Học vấn - Chứng chỉ
      </Typography.Title>
      <Space direction={"vertical"} size={"large"} className={"d-flex"}>
        {educations?.map((item) => (
          <Space size={"large"} key={item.educationId} align={"start"}>
            <div className={"iconWrapper"} style={{ borderRadius: "8px" }}>
              <IconSvgLocal name={"IC_CERTIFICATE"} width={24} height={24} />
            </div>
            <div>
              <Typography.Title className={"companyName nm-typo"} level={4}>
                {item.name} {item.grade ? ` - ${item.grade}` : ""}
              </Typography.Title>
              <Typography.Paragraph className={"position"}>
                {item.majors} {item.degree ? `(${item.degree})` : ""}
              </Typography.Paragraph>
              <Typography.Paragraph className={"workTime"}>
                {item.start_date + " - " + (item.end_date || "Hiện tại")}
              </Typography.Paragraph>
              <div
                className={"infoContent nm-typo"}
                dangerouslySetInnerHTML={{
                  __html: item.description,
                }}
              />
            </div>
          </Space>
        ))}
      </Space>
    </div>
  );
}
