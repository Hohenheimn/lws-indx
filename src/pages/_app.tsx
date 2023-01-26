import type { AppProps } from "next/app";
import React from "react";
import Head from "next/head";
import Router from "next/router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { capitalizeTitle } from "../../utils/helpers";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import Layout from "../layout";
import "../../styles/globals.scss";
import { AnimateContainer } from "../components/animation";
import { fadeIn, stagger } from "../components/animation/animation";
import Script from "next/script";

const AppProvider = dynamic(() => import("../../utils/context/Provider"));

const queryClient = new QueryClient();

export default function App({ Component, pageProps, router }: AppProps) {
  const [showLoading, setShowLoading] = React.useState(false);

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
        <title>{capitalizeTitle("Indx", router.asPath)}</title>
        <meta property="og:title" content="Index Content" key="ogtitle" />
        <meta property="og:image" content="/images/main-og.png" key="ogimage" />
        <meta
          property="og:description"
          content="Your Digital INDX Card"
          key="ogdesc"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.REACT_APP_GA_ID}', {
                page_path: window.location.pathname,
              });
              `}
      </Script>
      <AppProvider
        showLoading={showLoading}
        setShowLoading={(show: boolean) => setShowLoading(show)}
      >
        <AnimatePresence mode="wait">
          <div key={router.route} className="flex flex-col flex-auto">
            <Component {...pageProps} router={router} />
          </div>
        </AnimatePresence>
      </AppProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
