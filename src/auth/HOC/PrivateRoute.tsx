import React, { useState } from "react";
// import { fetchData } from "@utilities/api";
// import { useQuery } from "react-query";
import Router from "next/router";

import Layout from "../../layout";
import Login from "../Login";
import Restricted from "../Restricted";

type AuthProps = {
  profile: any;
  openMenus: string;
  subdomain: string;
  router: typeof Router;
};

export default function PrivateRoute(Component: any) {
  const Auth = ({
    profile,
    router,
    openMenus,
    subdomain,
    ...rest
  }: AuthProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const restrictedPages = ["/", "raffle-pick"];
    const allowedSubDomain = ["lws-dentist", "ampong-clinic"];

    if (subdomain && profile) {
      return (
        <Layout
          profile={profile}
          openMenus={openMenus}
          router={router}
          subdomain={subdomain}
        >
          <Component
            profile={profile}
            router={router}
            selectedDate={selectedDate}
            setSelectedDate={(date: Date) => setSelectedDate(date)}
            {...rest}
          />
        </Layout>
      );
    }

    if (allowedSubDomain.includes(subdomain) && !profile) {
      return <Login {...rest} />;
    }

    return <div>Sample Message</div>;
  };

  return Auth;
}
