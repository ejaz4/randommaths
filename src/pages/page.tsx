import { Button } from "@/components/button";
import ChevronRight from "../assets/chevron-right.svg";
import { ProgressBar } from "@/components/progressBar";

export default function Home() {
  return (
    <div>
      <Button image={<ChevronRight />}>Next</Button>

      <Button>Next</Button>

      <ProgressBar progress={50}></ProgressBar>
      <br />
      <ProgressBar progress={100}></ProgressBar>
      <br />
      <ProgressBar progress={0}></ProgressBar>
      <br />
      <ProgressBar progress={-10}></ProgressBar>
      <br />
      <ProgressBar progress={130}></ProgressBar>
    </div>
  );
}
