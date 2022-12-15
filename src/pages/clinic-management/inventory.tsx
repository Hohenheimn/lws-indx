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
    item_name: "Toothpaste",
    serial_number: "39571938231",
    remaining_quantity: 20,
    branch_assigned: "Branch 1",
    cost_per_item: 49,
    supplier_name: "Colgate",
    supplier_number: "09xx xxx xxxx",
  },
  {
    id: 2,
    item_name: "Cotton",
    serial_number: "39571938232",
    remaining_quantity: 315,
    branch_assigned: "Branch 2",
    cost_per_item: 500,
    supplier_name: "Puregold",
    supplier_number: "09xx xxx xxxx",
  },
  {
    id: 3,
    item_name: "Plaster",
    serial_number: "39571938233",
    remaining_quantity: 1000,
    branch_assigned: "Branch 3",
    cost_per_item: 253,
    supplier_name: "Suy Sing",
    supplier_number: "09xx xxx xxxx",
  },
  {
    id: 4,
    item_name: "Mouth Wash",
    serial_number: "39571938234",
    remaining_quantity: 20,
    branch_assigned: "Branch 4",
    cost_per_item: 49,
    supplier_name: "Happy",
    supplier_number: "0995 xxx xxxx",
  },
  {
    id: 5,
    item_name: "Betadine",
    serial_number: "39571938231",
    remaining_quantity: 1504,
    branch_assigned: "Branch 5",
    cost_per_item: 264,
    supplier_name: "Betadine",
    supplier_number: "09xx xxx xxxx",
  },
];

const columns: any = [
  {
    title: "Item Name",
    dataIndex: "item_name",
    width: "10rem",
    align: "center",
  },
  {
    title: "Serial Number",
    dataIndex: "serial_number",
    width: "10rem",
    align: "center",
  },
  {
    title: "Remaining Quantity",
    dataIndex: "remaining_quantity",
    width: "15rem",
    align: "center",
    render: (quantity: number) => numberSeparator(quantity, 0),
  },
  {
    title: "Branch Assigned",
    dataIndex: "branch_assigned",
    width: "15rem",
    align: "center",
  },
  {
    title: "Cost Per Item",
    dataIndex: "cost_per_item",
    width: "10rem",
    align: "center",
    render: (cost: number) => `₱ ${numberSeparator(cost, 0)}`,
  },
  {
    title: "Supplier Name",
    dataIndex: "supplier_name",
    width: "10rem",
    align: "center",
  },
  {
    title: "Supplier Number",
    dataIndex: "supplier_number",
    width: "10rem",
    align: "center",
  },
  {
    title: "Action",
    width: "10rem",
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

export function Inventory({}: NextPageProps) {
  return (
    <PageContainer>
      <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
        <h3 className="basis-auto whitespace-nowrap">Inventory</h3>
        <Radio.Group
          onChange={(e: string) => console.log(e)}
          defaultValue="1"
          className="md:max-w-md"
        >
          <Radio.Button value="1" label="Item List" />
          <Radio.Button value="2" label="Usage History" />
        </Radio.Group>
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
      />
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(Inventory);
