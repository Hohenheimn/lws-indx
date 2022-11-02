import type { AppProps } from "next/app";
import React from "react";
import Head from "next/head";
import Router from "next/router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { capitalizeTitle } from "../../utils/helpers";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import Layout from "../layout";
import "../../styles/globals.scss";
import { AnimateContainer } from "../components/animation";
import { fadeIn } from "../components/animation/animation";

const AppProvider = dynamic(() => import("../../utils/context/Provider"));

const queryClient = new QueryClient();

export default function App({ Component, pageProps, router }: AppProps) {
  const [showLoading, setShowLoading] = React.useState(false);

  React.useEffect(() => {
    const use = async () => {
      (await import("tw-elements")).default;
    };
    use();
  }, []);

  Router.events.on("routeChangeStart", (url) => {
    if (Router?.router?.route !== url) {
      setShowLoading(true);
    }
  });
  Router.events.on("routeChangeComplete", () => setShowLoading(false));
  Router.events.on("routeChangeError", () => setShowLoading(false));
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>{capitalizeTitle("Index CMS", router.asPath)}</title>
        <meta property="og:title" content="Index Content" key="ogtitle" />
        <meta
          property="og:image"
          content="/images/main-og.webp"
          key="ogimage"
        />
        <meta
          property="og:description"
          content="Index Description"
          key="ogdesc"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta key="robots" name="robots" content="noindex,follow" />
        <meta key="googlebot" name="googlebot" content="noindex,follow" />
      </Head>
      <AppProvider
        showLoading={showLoading}
        setShowLoading={(show: boolean) => setShowLoading(show)}
      >
        <AnimatePresence mode="wait">
          <AnimateContainer variants={fadeIn}>
            <AnimatePresence mode="wait">
              <Layout key={router.asPath}>
                <Component {...pageProps} router={router} />
              </Layout>
            </AnimatePresence>
          </AnimateContainer>
        </AnimatePresence>
      </AppProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
