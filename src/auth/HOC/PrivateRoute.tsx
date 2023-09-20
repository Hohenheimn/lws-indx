import React, { useState } from "react";
// import { fetchData } from "@utilities/api";
// import { useQuery } from "react-query";
import Router from "next/router";

import { BiError } from "react-icons/bi";

import Layout from "../../layout";
import Login from "../Login";
import Restricted from "../Restricted";

type AuthProps = {
  profile: any;
  openMenus: string;
  subdomain: string;
  domainExist: boolean;
  router: typeof Router;
};

export default function PrivateRoute(Component: any) {
  const Auth = ({
    profile,
    router,
    openMenus,
    subdomain,
    domainExist,
    ...rest
  }: AuthProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

    if (domainExist && !profile) {
      return <Login {...rest} />;
    }

    return (
      <div className=" h-screen w-screen flex justify-center items-center flex-col bg-primary-500">
        <BiError className=" text-6xl text-danger-500 mb-5" />
        <h1 className=" text-white text-3xl">Subdomain Do not Exist</h1>
      </div>
    );
  };

  return Auth;
}
