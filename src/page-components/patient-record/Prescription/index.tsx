import React from "react";
import { Checkbox, DatePicker, Form, Popover, Table, notification } from "antd";
import moment from "moment";
import Link from "next/link";
import { AiOutlinePrinter, AiOutlineSearch } from "react-icons/ai";
import {
  BsEyeFill,
  BsPencilSquare,
  BsTrash,
  BsTrashFill,
} from "react-icons/bs";
import { scroller } from "react-scroll";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Select } from "@components/Select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "@utilities/api";
import { numberSeparator } from "@utilities/helpers";

import { NextPageProps } from "@utilities/types/NextPageProps";

import AddPrescriptionModal from "./AddPrescriptionModal";

export function Prescription({ patientRecord }: any) {
  const [PrescriptionForm] = Form.useForm();
  const queryClient = useQueryClient();
  let [page, setPage] = React.useState(1);
  let [search, setSearch] = React.useState("");
  let [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = React.useState(
    false
  );

  const SelectedRowHandler = (record: any) => {
    PrescriptionForm.setFieldsValue({
      ...record,
      _id: record._id,
      created_at: moment(record.created_at).isValid()
        ? moment(record.created_at)
        : undefined,
    });
    setIsPrescriptionModalOpen(true);
  };

  const columns: any = [
    {
      title: "Prescription",
      dataIndex: "name",
      width: "10rem",
      align: "center",
      render: (name: any, record: any) => (
        <div onClick={() => SelectedRowHandler(record)}>{name}</div>
      ),
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      width: "10rem",
      align: "center",
      render: (created_at: Date, record: any) => (
        <div onClick={() => SelectedRowHandler(record)}>
          {moment(created_at).format("MMMM DD, YYYY")}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      width: "5rem",
      align: "center",
      render: (_: any, record: any) => {
        return (
          <div className="w-full flex justify-center space-x-4">
            <BsTrash
              className=" text-xl text-gray-400"
              onClick={() => deletePrescription(record._id)}
            />
            <Link
              href={`/admin/print?page=prescription&patient=${JSON.stringify(
                patientRecord
              )}&tableData=${JSON.stringify(record)}`}
              target="_blank"
            >
              <AiOutlinePrinter className=" text-xl text-gray-400" />
            </Link>
          </div>
        );
      },
    },
  ];

  let { data: prescription, isLoading: prescriptionIsLoading } = useQuery(
    ["prescription", page, search],
    () =>
      fetchData({
        url: `/api/patient/prescription/${patientRecord._id}?limit=5&page=${page}&search=${search}`,
      })
  );

  const { mutate: deletePrescription }: any = useMutation(
    (treatment_plan_id: number) =>
      deleteData({
        url: `/api/patient/prescription/${treatment_plan_id}`,
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Prescription Deleted",
          description: "Prescription has been deleted",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["prescription"] });
        const previousValues = queryClient.getQueryData(["prescription"]);
        queryClient.setQueryData(["prescription"], (oldData: any) =>
          oldData ? [...oldData, newData] : undefined
        );

        return { previousValues };
      },
      onError: (err: any, _, context: any) => {
        notification.warning({
          message: "Something Went Wrong",
          description: `${
            err.response.data[Object.keys(err.response.data)[0]]
          }`,
        });
        queryClient.setQueryData(["prescription"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["prescription"] });
      },
    }
  );

  return (
    <>
      <div className="flex flex-auto">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={prescription?.data}
          showHeader={true}
          tableLayout="fixed"
          loading={prescriptionIsLoading}
          title={() => (
            <div className="space-y-4 md:p-12 p-6 !pb-0">
              <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
                <h4 className="basis-full md:basis-auto">Prescription</h4>
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
                  <Button
                    className="p-3 max-w-xs"
                    appearance="primary"
                    onClick={() => setIsPrescriptionModalOpen(true)}
                  >
                    Create Prescription
                  </Button>
                </div>
              </div>
            </div>
          )}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            showSizeChanger: false,
            total: prescription?.meta?.total,
            onChange: (page) => setPage(page),
          }}
          components={{
            table: ({ ...rest }: any) => {
              let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
              // let tableFlexGrow = 1;
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
                return <tr {...rest} />;
              },
            },
          }}
          className="[&.ant-table]:!rounded-none"
        />
      </div>
      <AddPrescriptionModal
        show={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false);
          PrescriptionForm.resetFields();
        }}
        className="w-[80rem]"
        id="prescription-modal"
        patientRecord={patientRecord}
        form={PrescriptionForm}
      />
    </>
  );
}

export default Prescription;
