import React, { useEffect, useState } from "react";
import { Form } from "antd";
import DatePicker from "antd/lib/date-picker";
// import Radio from "antd/lib/radio";
import Table from "antd/lib/table/Table";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { format, parseISO } from "date-fns";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { AnimateContainer, PageContainer } from "@components/animation";
import Card from "@components/Card";
import Input from "@components/Input";
import { Select } from "@components/Select";
import { fadeIn } from "@src/components/animation/animation";
import { InfiniteSelect } from "@src/components/InfiniteSelect";
import LoadingScreen from "@src/layout/LoadingScreen";
import colors from "@styles/theme";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";
import { numberSeparator, paymentStatusPalette } from "@utilities/helpers";
import { NextPageProps } from "@utilities/types/NextPageProps";

type financials = {
  pending_balance: number;
  revenue: number;
  paid_amount: number;
  patient_invoices: invoices[];
};

type invoices = {
  _id: string;
  invoince_no: null | string | number;
  branch_name: string;
  doctor_name: string;
  created_at: string;
  mode_of_payment: null | string;
  status: string;
  amount: number;
};

const { RangePicker } = DatePicker;

export function Financials({ profile }: any) {
  const columns: any = [
    {
      title: "Branch",
      dataIndex: "branch_name",
      width: "10rem",
      align: "center",
    },
    {
      title: "Assigned Doctor",
      dataIndex: "doctor_name",
      width: "10rem",
      align: "center",
    },
    {
      title: "Invoice Number",
      dataIndex: "invoince_no",
      width: "10rem",
      align: "center",
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      width: "15rem",
      align: "center",
      render: (date: any) => {
        return format(parseISO(date), "MMM dd, yyyy");
      },
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
      dataIndex: "status",
      width: "10rem",
      align: "center",
      render: (status: string) => (
        <div
          className={twMerge(
            "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs ",
            paymentStatusPalette(status === null ? "no payment" : status)
          )}
        >
          {status}
        </div>
      ),
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

  let [page, setPage] = React.useState(1);

  const handleDateChange = (dates: any, dateStrings: any) => {
    setDateRange({
      from: dateStrings[0],
      to: dateStrings[1],
    });
  };

  let { data, isLoading } = useQuery(
    [
      "financials",
      branch_id,
      doctor_id,
      dateRange.from,
      dateRange.to,
      status,
      search,
      page,
    ],
    () =>
      fetchData({
        url: `/api/financial/list?limit=5&page=${page}&keyword=${search}&status=${status}&doctor_id=${
          doctor_id ? doctor_id : ""
        }&branch_id=${branch_id ? branch_id : ""}&date_from=${
          dateRange.from
        }&date_to=${dateRange.to}`,
      })
  );

  let { data: invoices, isLoading: invoicesLoading } = useQuery(
    [
      "financials-invoices-list",
      branch_id,
      doctor_id,
      dateRange.from,
      dateRange.to,
      status,
      search,
      page,
    ],
    () =>
      fetchData({
        url: `/api/financial/patient-invoice-list?limit=5&page=${page}&keyword=${search}&status=${status}&doctor_id=${
          doctor_id ? doctor_id : ""
        }&branch_id=${branch_id ? branch_id : ""}&date_from=${
          dateRange.from
        }&date_to=${dateRange.to}`,
      })
  );
  const invoicesData: invoices[] = invoices?.data;
  const financials: financials = data;

  return (
    <PageContainer>
      <AnimatePresence mode="wait">
        {(isLoading || invoicesLoading) && (
          <AnimateContainer
            variants={fadeIn}
            rootMargin="0px"
            className="fixed h-screen w-full top-0 left-0 z-[9999] bg-black bg-opacity-80 flex justify-center items-center"
          >
            <LoadingScreen />
          </AnimateContainer>
        )}
      </AnimatePresence>
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
            required={false}
            initialValue={""}
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
            required={false}
            className="w-full lg:w-auto"
            initialValue={""}
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
            {profile.setting.currency}{" "}
            {financials?.revenue ? numberSeparator(financials?.revenue, 0) : 0}
          </h4>
          <div className="text-base m-auto font-medium">
            Total Clinic Earnings
          </div>
        </Card>
        <Card className="text-center space-y-1 z-[1] overflow-hidden justify-center items-center flex flex-col">
          <h4>
            {profile.setting.currency}{" "}
            {financials?.paid_amount
              ? numberSeparator(financials?.paid_amount, 0)
              : 0}
          </h4>
          <div className="text-base m-auto font-medium">
            Total Paid Balances
          </div>
        </Card>
        <Card className="text-center space-y-1 z-[1] overflow-hidden justify-center items-center flex flex-col">
          <h4>
            {profile.setting.currency}{" "}
            {financials?.pending_balance
              ? numberSeparator(financials?.pending_balance, 0)
              : 0}
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
        dataSource={invoicesData}
        showHeader={true}
        tableLayout="fixed"
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
          showSizeChanger: false,
          total: invoices?.meta?.total,
          onChange: (page) => setPage(page),
        }}
      />
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(Financials);
