import React from "react";
import { PageContainer } from "../../../components/animation";
import Image from "next/image";
import PrivateRoute from "../../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../../auth/HOC/VerifyAuth";
import { NextPageProps } from "../../../../utils/types/NextPageProps";
import Card from "../../../components/Card";
import Avatar from "../../../components/Avatar";
import { Tabs, message } from "antd";
import profile from "../../../page-components/profile";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../../../utils/api";
import { format, parseISO, differenceInYears, parse } from "date-fns";
import { useRouter } from "next/router";
import { IoPersonOutline } from "react-icons/io5";

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
