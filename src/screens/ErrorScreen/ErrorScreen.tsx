import RootLayout from "@/src/layouts/RootLayout";
import Head from "next/head";
import { Typography } from "antd";

export default function ErrorScreen() {
  return (
    <RootLayout>
      <Head>
        <title>Oops! Internal Server Error</title>
      </Head>

      <section className={"sectionContainer "}>
        <div className="contentWrapper">
          <Typography.Title>500: Internal Server Error</Typography.Title>
        </div>
      </section>
    </RootLayout>
  );
}
