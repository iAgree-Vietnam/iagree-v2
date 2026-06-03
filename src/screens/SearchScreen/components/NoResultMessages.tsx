
import { Space, Typography } from "antd";
import { IconSvgLocal } from "@/src/components/icon-svg-local";

function NoResultMessages({
  searchTerm,
  type,
}: {
  searchTerm: string | null;
  type: string;
}) {
  return (
    <section className={"sectionContainer searchSectionContainer"}>
      <div className="contentWrapper">
        <Space
          size={40}
          className={"noResult d-flex"}
          direction={"vertical"}
          align={"center"}
        >
          <IconSvgLocal
            name={"IC_NO_RESULT"}
            width={100}
            height={100}
            fill={"none"}
          />
          <div>
            <Typography.Title
              className={"sectionTitle text-center nm-typo"}
              level={4}
            >
              Không tìm thấy {type} phù hợp
            </Typography.Title>
            <Typography.Title
              className={"sectionSubTitle text-center nm-typo"}
              level={5}
            >
              Rất tiếc, chúng tôi không tìm thấy kết quả cho "
              <span>{searchTerm}</span>".
              <br />
              Vui lòng kiểm tra lại chính tả hoặc thử các từ khóa khác.
            </Typography.Title>
          </div>
        </Space>
      </div>
    </section>
  );
}

export default NoResultMessages;