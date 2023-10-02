import React, { useState } from "react";
import { Space, Form, notification, Checkbox } from "antd";

import axios from "axios";
// import { useMutation } from "react-query";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import { BsCheckCircle } from "react-icons/bs";
import { PatternFormat } from "react-number-format";
import { SwapRightOutlined } from "@ant-design/icons";
import { AnimateContainer, PageContainer } from "@components/animation";
import { fadeIn } from "@components/animation/animation";
import LoadingScreen from "@src/layout/LoadingScreen";
import EnterEmail from "@src/page-components/forgot-password/EnterEmail";
import Recover from "@src/page-components/forgot-password/Recover";

// import { Media } from "../../../context/Media";

export default function ForgotPassword() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <>
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
      <PageContainer className="md:p-0">
        <div className="flex items-center justify-center flex-auto overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{
              x: 0,
              transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
            }}
            exit={{
              x: "-100%",
              transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
            }}
            className="absolute md:relative h-full w-full md:w-auto top-0 left-0 flex flex-col justify-center items-center flex-auto p-[5%] md:p-20 bg-white"
          >
            {router.query.recovery === undefined && (
              <EnterEmail setLoading={setLoading} />
            )}
            {router.query.recovery && <Recover setLoading={setLoading} />}
          </motion.div>
          <motion.div
            initial={{ x: "100%" }}
            animate={{
              x: 0,
              transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
            }}
            exit={{ x: "100%" }}
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
        </div>
      </PageContainer>
    </>
  );
}
