import Wrapper from "@/components/layout/Wrapper";
import MainHome from "../app/(homes)/home_5/page";

export const metadata = {
  title: "ômi I Proof Of Concept",
  description: "votre experience sur mesure",
};

export default function Home() {
  return (
    <>
      <Wrapper>
        <MainHome />
      </Wrapper>
    </>
  );
}
