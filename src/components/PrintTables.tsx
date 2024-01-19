import React from "react";
import moment from "moment";
import { numberSeparator } from "@utilities/helpers";

type Props = {
  data: any;
  currency: string;
};

export function TreatmentPlanPrintTable({ data, currency }: Props) {
  return (
    <div>
      <table className="w-full border border-gray-300">
        <thead className=" bg-primary-500 print:bg-primary-500 ">
          <tr>
            <th className=" text-white text-[16px] py-[10px] ">
              Procedure Name
            </th>
            <th className=" text-white text-[16px] py-[10px]">Cost</th>
          </tr>
        </thead>
        <tbody>
          {data?.treatment_plan_list.map((item: any, index: number) => (
            <tr key={index} className="border border-gray-300">
              <td className=" text-center text-[16px] py-[10px]">
                {item.procedure_name}
              </td>
              <td className=" text-center text-[16px] py-[10px]">
                {currency} {numberSeparator(item.cost, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PrescriptionPrintTable({ data, currency }: Props) {
  return (
    <div>
      <table className="w-full border border-gray-300">
        <thead className=" bg-primary-500 print:bg-primary-500 ">
          <tr>
            <th className=" text-white text-[16px] py-[10px] ">Medicine</th>
            <th className=" text-white text-[16px] py-[10px]">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data?.medicines.map((item: any, index: number) => (
            <tr key={index} className="border border-gray-300">
              <td className=" text-center text-[16px] py-[10px]">
                {item.name}
              </td>
              <td className=" text-center text-[16px] py-[10px]">
                {numberSeparator(item.quantity, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TreatmentRecordPrintTable({ data, currency }: Props) {
  return (
    <ul className=" grid grid-cols-2 gap-5 mt-5">
      <li>
        <h5>Payment Date</h5>
        <p className=" text-start text-[16px] py-[10px]">
          {moment(data.created_at).format("MMMM DD, YYYY")}
        </p>
      </li>
      <li>
        <h5>Branch</h5>
        <p className=" text-start text-[16px] py-[10px]">{data.branch}</p>
      </li>
      <li>
        <h5>Procedure</h5>
        <p className=" text-start text-[16px] py-[10px]">{data.procedure}</p>
      </li>
      <li>
        <h5>Payment Method</h5>
        <p className=" text-start text-[16px] py-[10px]">
          {data.mode_of_payment}
        </p>
      </li>
      <li>
        <h5>Payment Method</h5>
        <p className=" text-start text-[16px] py-[10px]">
          {currency} {numberSeparator(data.payment_amount, 2)}
        </p>
      </li>
    </ul>
  );
}
