import RegisterScreen from "../../src/screens/RegisterScreen/RegisterScreen";

export default function RegisterPage() {
  return <RegisterScreen/>;
}

export const getServerSideProps = async () => ({ props: {} })
