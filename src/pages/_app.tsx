import { AppProps } from "next/app";
import { Layout } from "../components/layout";
import "./globals.css";

export const RandomMathsLayout = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default RandomMathsLayout;
