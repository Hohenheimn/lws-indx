import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import Card from "@src/components/Card";

type Props = {
  onBack: () => void;
};

export default function BillingDetails({ onBack }: Props) {
  return (
    <Card className="flex-auto md:p-12 p-6">
      <h4 className="mb-3">Billing Details</h4>
      <ul className=" flex space-x-3 items-center">
        <li className=" cursor-pointer" onClick={onBack}>
          Account Details
        </li>
        <li>
          <IoIosArrowForward />
        </li>
        <li className=" text-primary-500 cursor-pointer">Billing Details</li>
      </ul>
    </Card>
  );
}
