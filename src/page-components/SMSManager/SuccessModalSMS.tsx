import React from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { BiSolidBadgeCheck, BiSolidErrorAlt } from "react-icons/bi";
import { AnimateContainer } from "@src/components/animation";
import { fadeIn } from "@src/components/animation/animation";
import { Button } from "@src/components/Button";
import Modal from "@src/components/Modal";
import LoadingScreen from "@src/layout/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import { fetchData, fetchDataNoSubdomain } from "@utilities/api";
import { numberSeparator } from "@utilities/helpers";

type payment = {
  account_id: string;
  amount: string;
  cc_name: string;
  cc_no: string;
  created_at: string;
  currency: string;
  payment_date: string;
  product_description: string;
  reference_no: string;
  status: string;
  updated_at: string;
  user_contact: string;
  user_email: string;
  username: string;
  _id: string;
};

export default function SuccessModalSMS({ currency }: any) {
  const router = useRouter();

  let { data: receipt, isLoading: receiptLoading, isError } = useQuery(
    ["payment-receipt", router.query.reference_no],
    () =>
      fetchDataNoSubdomain({
        url: `/api/payment/${router.query.reference_no}?api_key=${process.env.REACT_APP_API_KEY}`,
      })
  );

  const payment: payment = receipt;

  if (isError) {
    return (
      <Modal
        show={true}
        onClose={() => router.push("")}
        className=" flex flex-col items-center space-y-3"
      >
        <div className=" w-full flex flex-col items-center space-y-3">
          <BiSolidErrorAlt className=" text-danger-500 text-[5rem]" />
          <h4 className=" text-gray-400">Something went wrong</h4>
        </div>
      </Modal>
    );
  }

  if (receiptLoading) {
    return (
      <AnimatePresence mode="wait">
        {receiptLoading && (
          <AnimateContainer
            variants={fadeIn}
            rootMargin="0px"
            className="fixed h-screen w-full top-0 left-0 z-[9999] bg-black bg-opacity-80 flex justify-center items-center"
          >
            <LoadingScreen />
          </AnimateContainer>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Modal
      show={true}
      onClose={() => router.push("")}
      className=" flex flex-col items-center space-y-3"
    >
      <div className=" w-full flex flex-col items-center space-y-3">
        <BiSolidBadgeCheck className=" text-green-500 text-[5rem]" />
        <h4 className=" text-primary">Payment Received</h4>
      </div>

      <div className=" w-full flex flex-col items-center space-y-0">
        <p className=" text-gray-400 text-[1rem]">Reference No.</p>
        <h1>{router.query.reference_no}</h1>
      </div>

      <div className=" w-full flex flex-col items-center space-y-0">
        <p className=" text-gray-400 text-[1rem]">Payment Date</p>
        <h3>{payment?.payment_date}</h3>
      </div>

      <div className=" w-full flex flex-col items-center space-y-0">
        <p className=" text-gray-400 text-[1rem]">Product</p>
        <h3>{payment?.product_description}</h3>
      </div>

      <div className=" w-full flex flex-col items-center space-y-0">
        <p className=" text-gray-400 text-[1rem]">Amount</p>
        <h1 className=" text-primary">
          {currency} {numberSeparator(payment?.amount, 2)}
        </h1>
      </div>

      <div>
        <Button appearance="primary" onClick={() => router.push("")}>
          DONE
        </Button>
      </div>
    </Modal>
  );
}
