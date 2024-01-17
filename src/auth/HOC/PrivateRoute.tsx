import React, { useState } from "react";
// import { fetchData } from "@utilities/api";
// import { useQuery } from "react-query";
import Image from "next/image";

import Router from "next/router";

import Modal from "@src/components/Modal";

import ChangePaswordAD from "@src/page-components/profile/Actions/ChangePasswordAD";

import Layout from "../../layout";
import Login from "../Login";

type AuthProps = {
  profile: any;
  openMenus: string;
  subdomain: string;
  router: typeof Router;
  pathname: string;
  userToken: any;
};

export default function PrivateRoute(Component: any) {
  const Auth = ({
    profile,
    router,
    openMenus,
    subdomain,
    pathname,
    userToken,
    ...rest
  }: AuthProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    // if (!profile?.is_subscribed && profile?.is_admin && userToken) {
    //   return <SubscriptionAccount profile={profile} subdomain={subdomain} />;
    // }

    // if (!profile?.is_subscribed && !profile?.is_admin && userToken) {
    //   return <SubAccountMessageExpiration />;
    // }

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
          {!profile?.is_password_changed && userToken && (
            <section className=" w-screen h-screen bg-primary">
              <Modal show={true} onClose={() => {}} className=" w-[40rem]">
                <Image
                  src={"/images/logo.png"}
                  alt="random pics"
                  width={200}
                  height={100}
                  className="object-center mb-10"
                />
                <ChangePaswordAD
                  onBack={() => {}}
                  profile={profile}
                  firstLogin={true}
                />
              </Modal>
            </section>
          )}
        </Layout>
      );
    }
    return <Login {...rest} />;
  };

  return Auth;
}
