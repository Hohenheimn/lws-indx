import React from "react";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Router from "next/router";
import Script from "next/script";
import { twMerge } from "tailwind-merge";
import { AnimateContainer } from "@components/animation";
import { fadeIn, stagger } from "@components/animation/animation";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { capitalizeTitle } from "@utilities/helpers";

import "../../styles/globals.scss";
import Layout from "../layout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


const AppProvider = dynamic(() => import("@utilities/context/Provider"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: false,
      refetchOnWindowFocus: false,
      staleTime: 10000,
    },
  },
});

export default function App({ Component, pageProps, router }: AppProps) {
  const [isAppLoading, setIsAppLoading] = React.useState(false);

  Router.events.on("routeChangeStart", (url) => {
    if (Router?.router?.route !== url) {
      setIsAppLoading(true);
    }
  });
  Router.events.on("routeChangeComplete", () => setIsAppLoading(false));
  Router.events.on("routeChangeError", () => setIsAppLoading(false));

  if (typeof window !== "undefined") {
    if (router.route === "/") {
      document?.querySelector("body")?.classList.add('font-["Roboto"]');
    } else {
      document?.querySelector("body")?.classList.add('font-["Hind"]');
    }
  }

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
        isAppLoading={isAppLoading}
        setIsAppLoading={(show: boolean) => setIsAppLoading(show)}
      >
        <AnimatePresence mode="wait">
          <div key={router.route} className={"flex flex-col flex-auto"}>
            <Component {...pageProps} router={router} />
          </div>
        </AnimatePresence>
      </AppProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
