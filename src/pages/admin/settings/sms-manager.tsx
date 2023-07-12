import React from "react";
import { Popover } from "antd";
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
import { IoIosAdd } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Radio } from "@components/Radio";
import { Select } from "@components/Select";
import colors from "@styles/theme";
import { numberSeparator, paymentStatusPalette } from "@utilities/helpers";
import { NextPageProps } from "@utilities/types/NextPageProps";


let fakeData = [
  {
    id: 1,
    sms_template_name: "Birthday Template",
    message_content: "Happy Birthday",
  },
  {
    id: 2,
    sms_template_name: "Follow-Up Template",
    message_content: "Hi! May we follow-up your payment?",
  },
  {
    id: 3,
    sms_template_name: "Schedule Template",
    message_content: "Hi! Your schedule is on",
  },
];

const columns: any = [
  {
    title: "SMS Template Name",
    dataIndex: "sms_template_name",
    width: "20rem",
    align: "center",
  },
  {
    title: "Message Content",
    dataIndex: "message_content",
    width: "20rem",
    align: "center",
  },
];

export function SMSManager({ router }: NextPageProps) {
  let [search, setSearch] = React.useState("");
  return (
    <PageContainer>
      <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
        <h3 className="basis-full xl:basis-auto whitespace-nowrap">
          SMS Manager
        </h3>
        <div className="flex items-center justify-center xl:basis-auto basis-full">
          <div className="flex gap-x-4 items-center flex-wrap lg:flex-nowrap flex-auto">
            <div className="whitespace-nowrap font-semibold text-sm">
              Your available SMS credits is: 500
            </div>{" "}
            <Button appearance="disabled" className="p-3">
              Buy SMS Credit
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-4 flex-wrap mb-4">
        <div className="basis-full lg:basis-1/2">
          <Input
            placeholder="Search"
            prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
            className="rounded-full text-base shadow-none"
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        <div className="basis-full lg:basis-auto flex gap-4 flex-auto">
          <Button className="p-3" appearance="primary">
            SMS Settings
          </Button>
          <Button className="p-3" appearance="primary">
            <div className="flex justify-center items-center">
              <IoIosAdd className="inline-block text-2xl" />{" "}
              <span>Add Item</span>
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
        components={{
          table: ({ ...rest }: any) => {
            // let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
            let tableFlexGrow = 1;
            return (
              <table
                {...rest}
                style={{
                  flex: `${tableFlexGrow ? tableFlexGrow : 1} 1 auto`,
                }}
              />
            );
          },
          body: {
            row: ({ ...rest }: any) => {
              return (
                <Popover
                  placement="bottom"
                  showArrow={false}
                  content={
                    <div className="grid grid-cols-1 gap-2">
                      <Button appearance="link" className="text-casper-500 p-2">
                        <div className="flex items-center gap-2">
                          <BsPencilSquare className="text-base" />
                          <div>Edit</div>
                        </div>
                      </Button>
                      <Button
                        appearance="link"
                        className="text-casper-500 p-2"
                        // onClick={() => deletePatient(rest["data-row-key"])}
                      >
                        <div className="flex items-center gap-2">
                          <BsTrashFill className="text-base" />
                          <div>Delete</div>
                        </div>
                      </Button>
                    </div>
                  }
                  trigger="click"
                >
                  <tr {...rest} />
                </Popover>
              );
            },
          },
        }}
      />
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(SMSManager);
