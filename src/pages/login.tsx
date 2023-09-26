import { PageConstraints } from "@/components/constraints";
import { LoginDialogue } from "@/components/login";


export const LoginScreen = () => {
  return (
    <PageConstraints>
      <div>
        <h1>Login</h1>
      </div>

      <LoginDialogue />
    </PageConstraints>
  );
}


export default LoginScreen;