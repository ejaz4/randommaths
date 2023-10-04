import { PageConstraints } from "@/components/constraints";
import { LoginDialogue } from "@/components/login";
import { Button } from "@/components/button";
import ChevronRight from "@/assets/chevron-right.svg"

export const LoginScreen = () => {
  return (
      <Button image={<ChevronRight/>}>Next</Button>

  );
}


export default LoginScreen;