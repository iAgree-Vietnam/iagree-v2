
import { GetServerSidePropsContext } from "next/types";
import _ from "lodash";

import ContractsScreen from "@/src/screens/ContractScreen/ContractScreen";
import CookieUtils from "@/src/utils/CookieUtils";
import { ContractParseUtils } from "@/src/data/contract/utils/ContractParseUtils";
import Constants from "@/src/constants/Constants";

import Seo from "@/src/components/Seo";
import { ConstantConfig } from "@/src/constants/Config";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (!CookieUtils.hasAccessToken(context)) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let id = null;

  if (_.has(context.query, "id") && !_.isEmpty(context.query)) {
    id = context.query.id as string;
  }

  return {
    props: {
      filters: ContractParseUtils.contractQueries(context.query),
      id,
    },
  };
};

function Component(props: any) {
  const statusId =
    props.filters?.statusId ?? Constants.CONTRACT.STATUS.LUU_NHAP;

  const titleLabel: Record<number, string> = {
    [Constants.CONTRACT.STATUS.LUU_NHAP]: "Tài liệu của tôi",
    [Constants.CONTRACT.STATUS.DA_BAN_HANH]: "Tài liệu đã ký",
    [Constants.CONTRACT.STATUS.HUY]: "Tài liệu bị hủy",
  };

  const title = titleLabel[statusId] ?? "Tài liệu của tôi";

  return (
    <>
      <Seo
        title={title}
        description={`${title} trên iAgree. Quản lý, theo dõi và kiểm tra trạng thái tài liệu, hợp đồng của bạn.`}
        canonicalPath="/contracts"
        ogImage={ConstantConfig.DEFAULT_OG_IMAGE?.[0]?.url}
      />

      <ContractsScreen {...props} />
    </>
  );
}

export default Component;
