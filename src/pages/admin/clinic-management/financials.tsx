import React, { useEffect, useState } from "react";
import { Form } from "antd";
import DatePicker from "antd/lib/date-picker";
// import Radio from "antd/lib/radio";
import Table from "antd/lib/table/Table";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { format } from "date-fns";
import Image from "next/image";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import Card from "@components/Card";
import Input from "@components/Input";
import { Select } from "@components/Select";
import { InfiniteSelect } from "@src/components/InfiniteSelect";
import colors from "@styles/theme";
import { numberSeparator, paymentStatusPalette } from "@utilities/helpers";
import { NextPageProps } from "@utilities/types/NextPageProps";

const randomNumber = () => {
  return Math.random() * (100 - 1);
};

let fakeData = [
  {
    branch: "Branch 1",
    doctor: "Doctor 1",
    invoice_number: 1,
    date_created: new Date("11/22/2021"),
    amount: 20000,
    mode_of_payment: "Credit",
    payment_status: "pending",
  },
  {
    branch: "Branch 2",
    doctor: "Doctor 2",
    invoice_number: 2,
    date_created: new Date("12/22/2021"),
    amount: 20000,
    mode_of_payment: "Debit",
    payment_status: "paid",
  },
  {
    branch: "Branch 3",
    doctor: "Doctor 3",
    invoice_number: 3,
    date_created: new Date("01/22/2022"),
    amount: 20000,
    mode_of_payment: "GCash",
    payment_status: "partial payment",
  },
  {
    branch: "Branch 4",
    doctor: "Doctor 4",
    invoice_number: 4,
    date_created: new Date("02/22/2022"),
    amount: 20000,
    mode_of_payment: "Credit",
    payment_status: "pending",
  },
  {
    branch: "Branch 5",
    doctor: "Doctor 5",
    invoice_number: 5,
    date_created: new Date("03/22/2022"),
    amount: 20000,
    mode_of_payment: "Checque",
    payment_status: "pending",
  },
];

const { RangePicker } = DatePicker;

export function Financials({ profile }: any) {
  const columns: any = [
    {
      title: "Branch",
      dataIndex: "branch",
      width: "10rem",
      align: "center",
    },
    {
      title: "Assigned Doctor",
      dataIndex: "doctor",
      width: "10rem",
      align: "center",
    },
    {
      title: "Invoice Number",
      dataIndex: "invoice_number",
      width: "10rem",
      align: "center",
    },
    {
      title: "Date Created",
      dataIndex: "date_created",
      width: "15rem",
      align: "center",
      render: (date: Date) => format(date, "MMM dd, yyyy"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: "10rem",
      align: "center",
      render: (amount: number) =>
        `${profile.setting.currency} ${numberSeparator(amount, 0)}`,
    },
    {
      title: "Mode of Payment",
      dataIndex: "mode_of_payment",
      width: "10rem",
      align: "center",
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      width: "10rem",
      align: "center",
      render: (status: string) => {
        return (
          <div className="px-2">
            <div
              className={twMerge(
                "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs",
                paymentStatusPalette(status)
              )}
            >
              {status}
            </div>
          </div>
        );
      },
    },
  ];
  let [search, setSearch] = React.useState("");

  const [FilterForm] = Form.useForm();

  const doctor_id = Form.useWatch("doctor_id", FilterForm);

  const branch_id = Form.useWatch("branch_id", FilterForm);

  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [status, setStatus] = useState("");

  const handleDateChange = (dates: any, dateStrings: any) => {
    setDateRange({
      from: dateStrings[0],
      to: dateStrings[1],
    });
  };

  return (
    <PageContainer>
      <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
        <h3 className="basis-auto whitespace-nowrap">Financials</h3>
      </div>

      <Form
        form={FilterForm}
        layout="vertical"
        className=" flex flex-wrap justify-between lg:space-x-1 space-y-3 lg:space-y-0"
      >
        <div className="flex flex-wrap lg:space-x-1 w-full lg:w-auto  space-y-3 lg:space-y-0">
          <Form.Item
            label=""
            name="doctor_id"
            rules={[
              {
                required: true,
                message: "This is required",
              },
            ]}
            required={false}
            className="w-full lg:w-auto"
          >
            <InfiniteSelect
              placeholder="Select Doctor"
              id="doctor_id"
              api={`${process.env.REACT_APP_API_BASE_URL}/api/account?limit=3&for_dropdown=true&page=1`}
              queryKey={["doctor"]}
              displayValueKey="name"
              returnValueKey="_id"
            />
          </Form.Item>

          <Form.Item
            label=""
            name="branch_id"
            rules={[
              {
                required: true,
                message: "This is required",
              },
            ]}
            required={false}
            className="w-full lg:w-auto"
          >
            <InfiniteSelect
              placeholder="Select Branch"
              id="branch_id"
              api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
              queryKey={["branch"]}
              displayValueKey="name"
              returnValueKey="_id"
            />
          </Form.Item>
        </div>
        <div className="w-full lg:w-auto">
          <RangePicker onChange={handleDateChange} format="YYYY-MM-DD" />
        </div>
      </Form>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="text-center space-y-1 z-[1] overflow-hidden justify-center items-center flex flex-col">
          <h4>
            {profile.setting.currency} {numberSeparator(102500, 0)}
          </h4>
          <div className="text-base m-auto font-medium">
            Total Clinic Earnings
          </div>
        </Card>
        <Card className="text-center space-y-1 z-[1] overflow-hidden justify-center items-center flex flex-col">
          <h4>
            {profile.setting.currency} {numberSeparator(500, 0)}
          </h4>
          <div className="text-base m-auto font-medium">
            Total Paid Balances
          </div>
        </Card>
        <Card className="text-center space-y-1 z-[1] overflow-hidden justify-center items-center flex flex-col">
          <h4>
            {profile.setting.currency} {numberSeparator(329, 0)}
          </h4>
          <div className="text-base m-auto font-medium">
            Total Pending Balances
          </div>
        </Card>
      </div>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="basis-full lg:basis-1/2">
          <Input
            placeholder="Search"
            prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
            className="rounded-full text-base shadow-none"
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        <div className="basis-full lg:basis-auto flex gap-4">
          <Select
            placeholder="View Payment Status"
            className="border-transparent"
            value={status}
            onChange={(value: string) => setStatus(value)}
          >
            <Select.Option value="pending" key="pending">
              Pending
            </Select.Option>
            <Select.Option value="paid" key="paid">
              Paid
            </Select.Option>
          </Select>
        </div>
      </div>
      <Table
        id="tab"
        rowKey="invoice_number"
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

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(Financials);
