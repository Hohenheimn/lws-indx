import React, { useEffect, useState } from "react";
import Modal from "@components/Modal";
import { Button } from "@src/components/Button";
import { numberSeparator } from "@utilities/helpers";

import { SelectedPayment } from "./types";

export default function ViewPaymentModal({
  show,
  onClose,
  patientRecord,
  SelectedPayment,
  currency,
  ...rest
}: any) {
  const [total, settotal] = useState(0);
  useEffect(() => {
    settotal(0);
    SelectedPayment.map((item: SelectedPayment) =>
      settotal((prev: number) => Number(prev) + Number(item.payment_amount))
    );
  }, [SelectedPayment]);
  return (
    <>
      <Modal
        show={show}
        onClose={() => {
          onClose();
        }}
        {...rest}
        className=" space-y-5 w-[50rem]"
      >
        <div className="font-bold text-3xl">View Payment</div>
        <table className="w-full border border-gray-300">
          <thead className=" bg-primary-500 print:bg-primary-500 ">
            <tr>
              <th className=" text-white text-[1rem] py-4 text-center ">
                Branch
              </th>
              <th className=" text-white text-[1rem] py-4 text-center ">
                Procedure
              </th>
              <th className=" text-white text-[1rem] py-4 text-center ">
                Amount Paid
              </th>
            </tr>
          </thead>
          <tbody>
            {SelectedPayment.map((item: any, index: number) => (
              <tr key={index} className="border border-gray-300">
                <td className=" text-center text-[16px] py-[10px]">
                  {item.branch}
                </td>
                <td className=" text-center text-[16px] py-[10px]">
                  {item.procedure}
                </td>
                <td className=" text-center text-[16px] py-[10px]">
                  {currency} {numberSeparator(item.payment_amount, 0)}
                </td>
              </tr>
            ))}
            <tr className="border border-gray-300">
              <td className=" text-center text-[16px] py-[10px]">
                <h5>Total</h5>
              </td>
              <td className=" text-center text-[16px] py-[10px]"></td>
              <td className=" text-center text-[16px] py-[10px]">
                <h5>
                  {currency} {numberSeparator(total, 0)}
                </h5>
              </td>
            </tr>
          </tbody>
        </table>
        <div className=" w-full flex justify-end">
          <Button appearance="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
