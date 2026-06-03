import { ConstantConfig } from "@/src/constants/Config";
import HomeScreen from "../src/screens/HomeScreen/HomeScreen";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { GetServerSidePropsContext } from "next/types";

import Seo from "@/src/components/Seo";
// import HomeServices from '../src/data/home/services/HomeServices';

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // const apiRes = await new HomeServices(context).get({});

  // // Utility to replace undefined with null
  // function replaceUndefinedWithNull(obj: any): any {
  //     if (Array.isArray(obj)) {
  //         return obj.map(replaceUndefinedWithNull);
  //     } else if (obj && typeof obj === 'object') {
  //         return Object.fromEntries(
  //             Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : replaceUndefinedWithNull(v)])
  //         );
  //     }
  //     return obj;
  // }

  return {
    props: {
      // data: apiRes,
      // data: replaceUndefinedWithNull(apiRes),
    },
  };
};

export default function Component(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <>
      <Seo
        canonicalPath="/"
        jsonLd={ConstantConfig.DEFAULT_JSONLD()}
        jsonLdId="jsonld-home"
      />
      <HomeScreen {...props} />
    </>
  );
}
