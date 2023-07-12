import React from "react";
import { Tabs, message } from "antd";
import { format, parseISO, differenceInYears, parse } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoPersonOutline } from "react-icons/io5";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import Avatar from "@components/Avatar";
import Card from "@components/Card";
import profile from "@pagecomponents/profile";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";
import { NextPageProps } from "@utilities/types/NextPageProps";

export function ProfilePage({ profile: myProfile }: any) {
  let [isImageError, setIsImageError] = React.useState(false);
  const router = useRouter();

  return (
    <>
      <PageContainer>
        <h3>My Profile</h3>
        <Tabs
          activeKey={`${router.query.tab ?? profile("")[0]?.key}`}
          onChange={(e) =>
            router.replace({
              query: { ...router.query, tab: e },
            })
          }
          items={profile({
            profile: myProfile,
            tab: router.query.tab ?? "1",
          })}
        />
      </PageContainer>
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(ProfilePage);
