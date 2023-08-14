import React from "react";
import { numberSeparator } from "@utilities/helpers";

type Props = {
  data: any;
};

export function TreatmentPlanPrintTable({ data }: Props) {
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
                ₱{numberSeparator(item.cost, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PrescriptionPrintTable({ data }: Props) {
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
                ₱{numberSeparator(item.quantity, 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
