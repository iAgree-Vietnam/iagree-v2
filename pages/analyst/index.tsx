
import { AnalystScreen } from "@/src/screens/AnalystScreen/AnalystScreen";

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default function Component(props: any) {
  return <AnalystScreen {...props} />;
}
