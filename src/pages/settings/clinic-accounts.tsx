import React from "react";
import { PageContainer } from "../../components/animation";
import DatePicker from "antd/lib/date-picker";
// import Radio from "antd/lib/radio";
import Card from "../../components/Card";
import "chart.js/auto";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import { Button } from "../../components/Button";
import colors from "../../../styles/theme";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Radio } from "../../components/Radio";
import { Select } from "../../components/Select";
import fakeDoctors from "../../../utils/global-data/fakeDoctors";
import fakeBranches from "../../../utils/global-data/fakeBranches";
import { numberSeparator, paymentStatusPalette } from "../../../utils/helpers";
import PrivateRoute from "../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../auth/HOC/VerifyAuth";
import Table from "antd/lib/table/Table";
import { AiOutlineSearch } from "react-icons/ai";
import Input from "../../components/Input";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import Image from "next/image";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { IoIosAdd } from "react-icons/io";
import { NextPageProps } from "../../../utils/types/NextPageProps";

let fakeData = [
  {
    id: 1,
    user_name: "Mark Gan",
    account_type: "Doctor",
  },
  {
    id: 2,
    user_name: "Rose Alawi",
    account_type: "Doctor",
  },
  {
    id: 3,
    user_name: "Steven Strange",
    account_type: "Doctor",
  },
  {
    id: 4,
    user_name: "Sarah Meyer",
    account_type: "Staff",
  },
];

const columns: any = [
  {
    title: "User Name",
    dataIndex: "user_name",
    width: "15rem",
    align: "center",
  },
  {
    title: "Account Type",
    dataIndex: "account_type",
    width: "10rem",
    align: "center",
  },
  {
    title: "Action",
    width: "5rem",
    align: "center",
    render: () => {
      return (
        <div className="grid grid-cols-3">
          <BsEyeFill className="m-auto hover:opacity-50 transition" />
          <BsPencilSquare className="m-auto hover:opacity-50 transition" />
          <BsTrashFill className="m-auto hover:opacity-50 transition" />
        </div>
      );
    },
  },
];

export function ClinicAccounts({}: NextPageProps) {
  return (
    <PageContainer>
      <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
        <h3 className="basis-auto whitespace-nowrap">Clinic Accounts</h3>
      </div>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="basis-full lg:basis-1/2">
          <Input
            placeholder="Search"
            prefix={<AiOutlineSearch className="text-lg text-gray-300" />}
            className="rounded-full border-none text-lg"
          />
        </div>
        <div className="basis-full lg:basis-auto flex gap-4">
          <Button className="p-3 min-w-[15rem]" appearance="primary">
            <div className="flex justify-center items-center">
              <IoIosAdd className="inline-block text-2xl" />{" "}
              <span>Add Clinic Account</span>
            </div>
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={fakeData}
        showHeader={true}
        tableLayout="fixed"
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
          showSizeChanger: false,
        }}
      />
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, profile, openMenus) => {
  return { props: { profile, openMenus } };
});

export default PrivateRoute(ClinicAccounts);
