import { PageConstraints } from "@/components/constraints";
import { AuthenticationDialogue } from "@/components/authentication";

export const AuthenticationScreen = () => {
  return (
    <PageConstraints>
      <div>
        <h1>Login</h1>
      </div>

      <AuthenticationDialogue />
    </PageConstraints>
  );
};

export default AuthenticationScreen;
