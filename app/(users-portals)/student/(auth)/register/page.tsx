import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/school/register/RegisterPage";

export default function Login() {
  return <RegisterPage userType="Student" userBasePath="student" />;
}
