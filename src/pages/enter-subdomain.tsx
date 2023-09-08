import React from "react";
import { Space, Form, notification, Checkbox } from "antd";

import axios from "axios";
// import { useMutation } from "react-query";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import Image from "next/image";
import { useRouter } from "next/router";
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
import { postData, postDataNoToken } from "@utilities/api";
import { Context } from "@utilities/context/Provider";

// import { Media } from "../../../context/Media";

export default function EnterSubdomain() {
  const router = useRouter();
  const [checkDomain] = Form.useForm();
  const { setIsAppLoading } = React.useContext(Context);
  let [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  const accountid = Form.useWatch("domain", checkDomain);

  const { mutate: checkAccountID } = useMutation(
    (payload: {}) =>
      postDataNoToken({
        url: `/api/domain-checker?api_key=${process.env.REACT_APP_API_KEY}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: (res) => {
        if (res) {
          router.push(`http://${accountid}.staging.indxhealth.com/admin`);
        } else {
          notification.success({
            key: "check-account-id",
            message: "Invalid Account ID",
            description: "Account ID does not exist",
          });
        }
      },
      onError: (err: { [key: string]: string }) => {
        notification.success({
          key: "check-account-id",
          message: err.title,
          description: err.message,
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
              transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
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
              transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
            }}
            exit={{
              x: "100%",
              transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
            }}
            className="absolute md:relative h-full w-full md:w-auto top-0 left-0 flex flex-col justify-center items-center flex-auto p-[5%] md:p-20 bg-white"
          >
            <div className="space-y-6 w-full">
              <h1 className="font-['Mulish']">Enter Account ID</h1>
              <Form
                form={checkDomain}
                layout="vertical"
                onFinish={(values) => {
                  checkAccountID(values);
                }}
                className="w-full"
              >
                <div>
                  <Form.Item
                    name="domain"
                    rules={[
                      {
                        required: true,
                        message: "Enter Account ID to proceed",
                      },
                    ]}
                    required={false}
                  >
                    <Input id="domain" placeholder="Account ID" />
                  </Form.Item>
                </div>
                <div className="space-y-4 mt-10">
                  <Button className="py-4" appearance="blumine" type="submit">
                    Next
                  </Button>
                </div>
              </Form>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
