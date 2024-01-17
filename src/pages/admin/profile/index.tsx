import React from "react";
import { Tabs } from "antd";
import { useRouter } from "next/router";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import profile from "@pagecomponents/profile";

export function ProfilePage({ profile: myProfile, subdomain }: any) {
  const router = useRouter();

  return (
    <>
      <PageContainer>
        <h3>Doctor Profile</h3>
        <div className="profile-container">
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
              subdomain: subdomain,
            })}
          />
        </div>
      </PageContainer>
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(ProfilePage);
