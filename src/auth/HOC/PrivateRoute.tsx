import React, { useState } from "react";
// import { fetchData } from "../../../utils/api";
// import { useQuery } from "react-query";
import Restricted from "./Restricted";
import Login from "./Login";
import Layout from "../../layout";
import Router from "next/router";

type AuthProps = {
  profile: any;
  openMenus: string;
  router: typeof Router;
};

export default function PrivateRoute(Component: any) {
  const Auth = ({ profile, router, openMenus, ...rest }: AuthProps) => {
    const [selectedDate, setSelectedDate] = useState("");

    const restrictedPages = ["entry-validation", "raffle-pick"];

    if (
      !profile?.is_staff &&
      restrictedPages.includes(router.route.split("/")[1])
    ) {
      return <Restricted />;
    }

    if (profile) {
      return (
        <Layout profile={profile} openMenus={openMenus} router={router}>
          <Component
            profile={profile}
            router={router}
            selectedDate={selectedDate}
            setSelectedDate={(date: any) => setSelectedDate(date)}
            {...rest}
          />
        </Layout>
      );
    }

    return <Login {...rest} router={router} />;
  };

  return Auth;
}
