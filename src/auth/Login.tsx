import React, { useEffect, useState } from "react";
import { Space, Form, notification } from "antd";

import { motion } from "framer-motion";
// import { useMutation } from "react-query";
// import { postData } from "@utilities/api";
import { AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { SwapRightOutlined } from "@ant-design/icons";
import { AnimateContainer, PageContainer } from "@components/animation";
import {
  fadeIn,
  fadeInLeft,
  fadeInRight,
} from "@components/animation/animation";
import { Button } from "@components/Button";
import Input from "@components/Input";
import LoadingScreen from "@src/layout/LoadingScreen";
// import { Media } from "../../../context/Media";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";

export default function Login() {
  const router = useRouter();
  const [LoginForm] = Form.useForm();
  const { setIsAppLoading, clinic_logo } = React.useContext(Context);
  const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const [isSubdomain, setSubdomain] = useState("");

  useEffect(() => {
    LoginForm.setFieldValue("email", router?.query?.email);
  }, [router?.query?.email]);

  useEffect(() => {
    if (window?.location?.origin) {
      let getSubDomain: string | string[] = window?.location?.hostname.split(
        "."
      )[0];
      setSubdomain(getSubDomain);
    }
  });

  const { mutate: login } = useMutation(
    (payload) =>
      postData({
        url: `/api/auth/login`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
        isSubdomain,
      }),
    {
      onSuccess: async (res) => {
        setCookie(null, "a_t", res?.token, {
          path: "/",
        });
        setCookie(null, "subdomain", isSubdomain, {
          path: "/",
        });
        router.push("/");
        // router.reload();
        notification.success({
          key: "login",
          message: "Login Successful",
          description: `It's nice to see you`,
        });
      },
      onError: () => {
        notification.warning({
          key: "login",
          message: `Incorrect Email or Password`,
          description: `Kindly check your credentials`,
        });
      },
    }
  );

  const { mutate: SendEmail, isLoading } = useMutation(
    (payload) =>
      postData({
        url: `/api/auth/forget-password`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
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
    if (!regexEmail.test(LoginForm.getFieldValue("email"))) {
      notification.warning({
        key: "sent",
        message: "Invalid Email",
        description: `Enter a correct email`,
      });
      return;
    }
    //mutate
    const Payload: any = {
      email: LoginForm.getFieldValue("email"),
      subdomain: isSubdomain,
    };
    SendEmail(Payload);
  };

  return (
    <PageContainer className="md:p-0">
      <AnimatePresence mode="wait">
        {isLoading && (
          <AnimateContainer
            variants={fadeIn}
            rootMargin="0px"
            className="fixed h-screen w-full top-0 left-0 z-[9999] bg-black bg-opacity-80 flex justify-center items-center"
          >
            <LoadingScreen />
          </AnimateContainer>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-center flex-auto h-full">
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
          className="hidden md:flex relative h-screen basis-full md:basis-[45%]"
        >
          <Image
            src={"/images/login-bg.png"}
            alt="random pics"
            fill
            sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
            className="object-center"
          />
          <div className="w-full h-full relative flex justify-center items-center">
            <div className="h-28 w-full relative">
              <Image
                src={clinic_logo ? clinic_logo : "/images/white-logo.png"}
                alt="random pics"
                fill
                sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                className="object-center object-contain"
              />
            </div>
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
          className="absolute md:relative h-full w-full md:w-auto top-0 left-0 flex flex-col justify-center items-center flex-auto p-[10%] md:p-20 bg-white"
        >
          <div className="space-y-6 md:max-w-md w-full">
            <div className="items-center h-16 w-full relative mb-16">
              <Image
                src={clinic_logo ? clinic_logo : "/images/logo.png"}
                alt="random pics"
                fill
                sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                className="object-center object-contain"
              />
            </div>
            <Form
              form={LoginForm}
              layout="vertical"
              onFinish={(values) => {
                login(values);
              }}
              className="w-full"
            >
              <div className="grid grid-cols-1 gap-y-4">
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Email is required",
                    },
                  ]}
                  required={false}
                >
                  <Input id="email" placeholder="Email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Password is required",
                    },
                  ]}
                  required={false}
                >
                  <Input id="password" placeholder="Password" type="password" />
                </Form.Item>
              </div>
              <div
                className="!text-primary-500 cursor-pointer hover:underline mt-2 inline-block"
                onClick={SendEmailHandler}
              >
                Forgot password?
              </div>

              <div className="space-y-4 mt-10">
                <Button appearance="secondary" type="submit" className="py-4">
                  LOG IN
                </Button>
                {/* <Button className="!text-secondary-500 border-secondary-500 py-4">
                  CREATE ACCOUNT
                </Button> */}
              </div>
            </Form>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
