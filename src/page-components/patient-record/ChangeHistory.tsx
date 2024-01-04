import React, { useState } from "react";
import { DatePicker, Table } from "antd";
import moment from "moment";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";

const columns: any = [
  {
    title: "Changes Made",
    dataIndex: "value",
    width: "10rem",
    align: "center",
  },
  {
    title: "Date Created",
    dataIndex: "created_at",
    width: "10rem",
    align: "center",
    render: (created_at: string, record: any) => {
      return <div>{moment(created_at).format("MMMM DD, YYYY")}</div>;
    },
  },
  {
    title: "Username",
    dataIndex: "patient_id",
    width: "10rem",
    align: "center",
    render: (created_at: string, record: any) => {
      return (
        <div>
          {record.user_first_name} {record.user_last_name}
        </div>
      );
    },
  },
];
const { RangePicker } = DatePicker;

export function ChangeHistory({ patientRecord }: any) {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  let [search, setSearch] = React.useState("");

  const handleDateChange = (dates: any, dateStrings: any) => {
    setDateRange({
      from: dateStrings[0],
      to: dateStrings[1],
    });
  };

  const [page, setPage] = useState(1);

  let { data: changeHistory, isLoading: changeHistoryLoading } = useQuery(
    ["change-history", page, search, patientRecord._id],
    () =>
      fetchData({
        url: `/api/change-history/${patientRecord._id}?limit=5&page=${page}&search=${search}&date_from=${dateRange.from}&date_to=${dateRange.to}`,
      })
  );

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-auto">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={changeHistory?.data}
          showHeader={true}
          tableLayout="fixed"
          loading={changeHistoryLoading}
          title={() => (
            <div className="space-y-4 md:p-12 p-6 !pb-0">
              <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
                <h4 className="basis-full md:basis-auto">Change History</h4>
              </div>
              <div className="flex justify-between align-middle gap-4">
                <div className="basis-1/2">
                  <Input
                    placeholder="Search"
                    prefix={
                      <AiOutlineSearch className="text-lg text-casper-500" />
                    }
                    className="rounded-full text-base shadow-none"
                    onChange={(e: any) => setSearch(e.target.value)}
                  />
                </div>
                <div>
                  <RangePicker
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                  />
                </div>
              </div>
            </div>
          )}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            showSizeChanger: false,
            onChange: (page) => setPage(page),

            total: changeHistory?.meta?.total,
          }}
          className="[&.ant-table]:!rounded-none"
        />
      </div>
    </div>
  );
}

export default ChangeHistory;
