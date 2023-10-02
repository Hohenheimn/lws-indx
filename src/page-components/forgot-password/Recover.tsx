import React from "react";
import { Form, notification } from "antd";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { AnimateContainer } from "@src/components/animation";
import { fadeIn } from "@src/components/animation/animation";
import { Button } from "@src/components/Button";
import LoadingScreen from "@src/layout/LoadingScreen";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@utilities/api";

function Recover({ setLoading }: { setLoading: Function }) {
  const router = useRouter();
  const isSubdomain = router?.query?.subdomain;
  const { mutate: SendEmail, isLoading } = useMutation(
    (payload) =>
      postData({
        url: `/api/auth/forget-password`,
        payload,
        options: {
          isLoading: (show: boolean) => setLoading(show),
        },
        isSubdomain,
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          key: "email sent",
          message: "Email Sent Successful",
          description: `Check your email`,
        });
      },
      onError: () => {
        notification.warning({
          key: "email sent",
          message: `Invalid Email`,
          description: `Kindly check your email`,
        });
      },
    }
  );
  const SendEmailHandler = () => {
    //mutate
    const Payload: any = {
      email: router.query.email,
      subdomain: isSubdomain,
    };
    SendEmail(Payload);
  };
  return (
    <div className="space-y-6 w-full">
      <div className=" space-y-5">
        <p className="font-['Mulish'] mb-2 text-[1.5rem]">
          We&apos;ll send a reset password link here:
        </p>
        <h2 className="font-['Mulish']">{router?.query?.email}</h2>
      </div>
      <Button appearance="primary" onClick={SendEmailHandler}>
        Send
      </Button>
    </div>
  );
}

export default Recover;
