import React from "react";
import Image from "next/image";
import { AiOutlinePrinter } from "react-icons/ai";
import LoadingScreen from "@src/layout/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";

type Props = {
  children: React.ReactNode;
  patientID: any;
};

export default function PrintTemplate({ children, patientID }: Props) {
  const { data: patientRecord, isLoading, isError } = useQuery(
    ["patient", patientID],
    () =>
      fetchData({
        url: `/api/patient/${patientID}`,
      })
  );
  const printhandler = () => {
    print();
  };
  return (
    <div className={` printThis top-0`}>
      {isLoading && (
        <div className=" bg-[#00000048] fixed w-screen h-screen top-0 left-0 flex justify-center items-center">
          <LoadingScreen />
        </div>
      )}
      <aside className="w-full py-5 flex justify-end px-5 hidePrint">
        <AiOutlinePrinter
          onClick={printhandler}
          className=" cursor-pointer text-3xl text-gray-400"
        />
      </aside>

      <table className=" w-full">
        <thead>
          <tr>
            <th>
              <header className=" w-full flex justify-between items-start border-b-2 border-primary-500 pb-[30px]">
                <aside className="relative">
                  <Image
                    src="/images/logo.png"
                    alt="random pics"
                    height={80}
                    width={160}
                  />
                </aside>
                <ul className=" flex space-x-3 lg:space-x-10">
                  <li className=" space-y-2">
                    <p className=" text-start lg:text-[1rem] font-normal">
                      <span className="text-gray-400">Patient Number:</span>{" "}
                      {patientRecord?.patient_no}
                    </p>
                    <p className=" text-start lg:text-[1rem] font-normal">
                      <span className="text-gray-400">Patient Name:</span>
                      {patientRecord?.first_name} {patientRecord?.middle_name}{" "}
                      {patientRecord?.last_name}
                    </p>
                  </li>
                  <li className=" space-y-2">
                    <p className=" text-start lg:text-[1rem] font-normal">
                      <span className="text-gray-400">Gender:</span>{" "}
                      {patientRecord?.gender}
                    </p>
                    <p className=" text-start lg:text-[1rem] font-normal">
                      <span className="text-gray-400">Mobile Number:</span>{" "}
                      {patientRecord?.mobile_no}
                    </p>
                  </li>
                </ul>
              </header>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-10">{children}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className=" print:h-[100px]"></td>
          </tr>
        </tfoot>
      </table>
      <footer className="flex w-full left-0 justify-between print:fixed bottom-0 h-[100px] items-center print:px-8">
        <h5 className=" w-56 print:w-32 border-t border-gray-400 pt-[20px] text-[16px] text-center">
          Dentist
        </h5>

        <ul className=" flex space-x-3 lg:space-x-10">
          <li className=" space-y-2">
            <p className=" text-start lg:text-[1rem] font-normal">
              <span className="text-gray-400">License Number:</span>{" "}
              {patientRecord?.patient_no}
            </p>
            <p className=" text-start lg:text-[1rem] font-normal">
              <span className="text-gray-400">S2 No. :</span>
              smaple number
            </p>
          </li>
        </ul>
      </footer>
    </div>
  );
}
