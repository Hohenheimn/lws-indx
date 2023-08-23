import React, { useEffect, useState } from "react";
import { Space, Form, notification, Checkbox } from "antd";

import { motion } from "framer-motion";
// import { useMutation } from "react-query";
import dynamic from "next/dynamic";
import Image from "next/image";

import { setCookie } from "nookies";
import { BsCheckCircle } from "react-icons/bs";
import { PatternFormat } from "react-number-format";
import { SwapRightOutlined } from "@ant-design/icons";
import { AnimateContainer, PageContainer } from "@components/animation";
import {
  fadeIn,
  fadeInLeft,
  fadeInRight,
} from "@components/animation/animation";
import { Button } from "@components/Button";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";

// import { Media } from "../../../context/Media";

export default function ChangePassword({ router }: any) {
  const token = router.query.token;
  const email = router.query.email;
  const [ChangePasswordForm] = Form.useForm();
  const { setIsAppLoading } = React.useContext(Context);
  let [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    if (window?.location?.origin) {
      let getSubDomain: string | string[] = window?.location?.origin.replace(
        "https://",
        ""
      );
      getSubDomain = getSubDomain.replace("http://", "");
      getSubDomain = getSubDomain.replace("https://", "");
      getSubDomain = getSubDomain.split(".");
      getSubDomain = getSubDomain[0];
      setSubdomain(getSubDomain);
    }
  });

  const { mutate: ChangePassword } = useMutation(
    (payload) =>
      postData({
        url: `/api/user/change-password`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
        subdomain,
      }),
    {
      onSuccess: async (res) => {
        router.push("/");
        notification.success({
          key: "change password",
          message: "Change Password Successful",
          description: `It's nice to see you`,
        });
      },
      onError: () => {
        notification.warning({
          key: "login",
          message: `Something went wrong`,
          description: ``,
        });
      },
    }
  );

  return (
    <>
      <PageContainer className="md:p-0">
        <div className="flex items-center justify-center flex-auto overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{
              x: 0,
              transition: {
                duration: 1,
                ease: [0.6, -0.05, 0.01, 0.99],
              },
            }}
            exit={{ x: "-100%" }}
            className="hidden md:flex relative h-screen basis-full md:basis-[60%] bg-primary p-[4vw]"
          >
            <div className="w-full h-full relative">
              <Image
                src="/images/white-logo.png"
                alt="random pics"
                fill
                sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                className="object-center object-contain"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ x: "100%" }}
            animate={{
              x: 0,
              transition: {
                duration: 1,
                ease: [0.6, -0.05, 0.01, 0.99],
              },
            }}
            exit={{
              x: "100%",
              transition: {
                duration: 1,
                ease: [0.6, -0.05, 0.01, 0.99],
              },
            }}
            className="absolute md:relative h-full w-full md:w-auto top-0 left-0 flex flex-col justify-center items-center flex-auto p-[5%] md:p-20 bg-white"
          >
            <div className="space-y-6 w-full">
              <h1 className="font-['Mulish']">Change Password</h1>
              <Form
                form={ChangePasswordForm}
                layout="vertical"
                onFinish={(values) => {
                  values.token = token;
                  values.email = email;

                  ChangePassword(values);
                }}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <Form.Item
                    label="New Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "New Password is required",
                      },
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <Input
                      type="password"
                      id="password"
                      placeholder="New Password"
                    />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label="Confirm Password"
                    name="confirm_password"
                    dependencies={["new_password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Mandatory field required!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The passwords that you entered does not match!"
                            )
                          );
                        },
                      }),
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <Input
                      type="password"
                      id="confirm_password"
                      placeholder="Confirm Password"
                    />
                  </Form.Item>
                </div>
                <div className="space-y-4 mt-10">
                  <Button className="py-4" appearance="blumine" type="submit">
                    SAVE
                  </Button>
                </div>
              </Form>
            </div>
          </motion.div>
        </div>
      </PageContainer>
      <Modal
        show={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        className="w-[70rem]"
      >
        <div className="space-y-12 text-center text-base max-w-[50rem] m-auto">
          <BsCheckCircle className="text-primary text-9xl m-auto" />
          <div>
            <h2 className="font-normal mb-2">Registration Successful</h2>
            <div className="text-default-secondary">
              Your registration has been confirmed. Stay tuned for more updates.
            </div>
          </div>
          <Button
            appearance="primary"
            className="max-w-[20rem] p-4"
            onClick={() => {
              router.push("/");
              setIsSuccessModalOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}
