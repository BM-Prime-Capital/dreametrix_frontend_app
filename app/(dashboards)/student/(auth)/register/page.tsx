import LoginPage from "@/components/Login";
import RegisterPage from "@/components/school_admin/Register";

export default function Login() {
  return <RegisterPage userType="Student" userBasePath="student" />;
}
