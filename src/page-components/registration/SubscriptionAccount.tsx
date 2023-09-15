import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { BsCheck, BsInstagram, BsLinkedin } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { AnimateContainer, PageContainer } from "@src/components/animation";
import { fadeIn } from "@src/components/animation/animation";
import { Button } from "@src/components/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchDataNoSubdomain, payment_base_url } from "@utilities/api";
import { numberSeparator } from "@utilities/helpers";

export type registrationAccount = {
  clinic_address: string;
  clinic_name: string;
  email_address: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  indx_url: string;
  terms: boolean;
};

type accountSubs = {
  amount: number;
  doctor_account_no: string;
  name: string;
  patient_record_no: string;
  sms_credit: string;
  storage: string;
  type: string;
  _id: string;
};

type Props = {
  registrationInfo: registrationAccount | null;
};

export default function SubscriptionAccount({ registrationInfo }: Props) {
  const router = useRouter();
  let { data: accountSubscription } = useQuery(["account-subscription"], () =>
    fetchDataNoSubdomain({
      url: `/api/subscriptions?type=Subscription`,
    })
  );
  const accountPackage: accountSubs[] = accountSubscription;
  return (
    <PageContainer className="md:p-0">
      <div className=" flex flex-col w-full items-center h-screen overflow-auto">
        <div className="w-11/12 flex flex-col items-center pt-10 space-y-10 mb-10">
          <aside className=" flex justify-center">
            <div className=" relative h-[7rem] aspect-[2/1] ">
              <Image
                src="/images/logo.png"
                alt="random pics"
                className=" h-full w-full object-contain"
                fill
              />
            </div>
          </aside>
          <h2>Select subscription that fits your needs.</h2>
          <ul className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accountPackage?.map((item, index) => (
              <li
                key={index}
                className=" p-5 lg:p-10 shadow-lg  duration-75 ease-linear bg-white space-y-5 rounded-md"
              >
                <h4>{item.name}</h4>
                {/* <p className=" text-[1rem] text-gray-400">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Itaque modi tempore voluptate velit? Earum, ipsum.
                </p> */}
                <h1>PHP {numberSeparator(item.amount, 2)}</h1>
                {/* <h5>Recommended for</h5> */}
                {/* <p className=" text-[1rem] text-gray-400">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Dolorum ipsa ducimus eligendi esse repellendus atque.
                </p> */}
                <Button
                  appearance="primary"
                  onClick={() => {
                    router.push(
                      `${payment_base_url}?email=${registrationInfo?.email_address}&subscription_id=${item._id}&contact_no=${registrationInfo?.mobile_number}&clinic_url=${registrationInfo?.indx_url}`
                    );
                  }}
                >
                  GET STARTED
                </Button>
                <hr />
                <ul className=" space-y-2">
                  <li>
                    <h5>Subscription Includes:</h5>
                  </li>
                  <li className=" flex pl-[1.5rem] relative">
                    <BsCheck className=" text-gray-400  text-[1rem] absolute left-1 top-1" />
                    <p className=" text-[1rem] ">
                      Patient Record No.:{" "}
                      {numberSeparator(item.patient_record_no, 0)}
                    </p>
                  </li>
                  <li className=" flex pl-[1.5rem] relative">
                    <BsCheck className=" text-gray-400  text-[1rem] absolute left-1 top-1" />
                    <p className=" text-[1rem] ">
                      SMS Credit: {numberSeparator(item.sms_credit, 0)}
                    </p>
                  </li>
                  <li className=" flex pl-[1.5rem] relative">
                    <BsCheck className=" text-gray-400  text-[1rem] absolute left-1 top-1" />
                    <p className=" text-[1rem] ">Storage: {item.storage}</p>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </div>
        <footer className=" w-full">
          <AnimateContainer variants={fadeIn} rootMargin="0px 0px">
            <div className="p-8 pt-0 flex justify-center items-center gap-8 flex-none !mt-4 !m-0">
              <Button
                appearance="link"
                className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
                onClick={() =>
                  window.open("https://www.facebook.com/indxhealth", "_blank")
                }
              >
                <FaFacebookF />
              </Button>
              <Button
                appearance="link"
                className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/company/indx-health/?viewAsMember=true&original_referer=",
                    "_blank"
                  )
                }
              >
                <BsLinkedin />
              </Button>
              <Button
                appearance="link"
                className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
                onClick={() =>
                  window.open("https://www.instagram.com/indxhealth/", "_blank")
                }
              >
                <BsInstagram />
              </Button>
            </div>
          </AnimateContainer>
          <AnimateContainer
            variants={fadeIn}
            rootMargin="0px 0px"
            className="!m-0"
          >
            <div className="text-white bg-primary p-4 text-center !m-0">
              ©2023 Copyright | INDX Dental
            </div>
          </AnimateContainer>
        </footer>
      </div>
    </PageContainer>
  );
}
