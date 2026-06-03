import dynamic from "next/dynamic";

// Load NotFoundScreen chỉ ở client, không SSR
const NotFoundScreen = dynamic(
  () => import("@/src/screens/NotFoundScreen/NotFoundScreen"),
  { ssr: false }
);

export default function NotFoundPage() {
  return <NotFoundScreen />;
}