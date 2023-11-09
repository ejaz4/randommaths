import { PageConstraints } from "@/components/constraints";
import { Button } from "@/components/button";
import ChevronRight from "@/assets/chevron-right.svg"

export const LoginScreen = () => {
  const hello = () => {
    alert("It works!")
  }

  return (
      <Button onClick={hello} image={<ChevronRight/>}>Next</Button>
  );
}


export default LoginScreen;