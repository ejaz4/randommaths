import { Header } from "../header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
