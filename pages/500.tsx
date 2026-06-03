import dynamic from "next/dynamic";

const ErrorScreen = dynamic(
  () => import("@/src/screens/ErrorScreen/ErrorScreen"),
  {
    ssr: false,
  }
);

export default function ErrorPage() {
  return <ErrorScreen />;
}
