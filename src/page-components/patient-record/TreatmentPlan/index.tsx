import React from "react";
import { Form, Table, notification } from "antd";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlinePrinter, AiOutlineSearch } from "react-icons/ai";
import { Button } from "@components/Button";
import Input from "@components/Input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "@utilities/api";
import { numberSeparator } from "@utilities/helpers";

import AddTreatmentPlanModal from "./AddTreatmentPlanModal";

export function TreatmentPlan({ patientRecord, pageType, currency }: any) {
  const SelectedRowHandler = (selectedRowRecord: any) => {
    TreatmentPlanForm.setFieldsValue({
      ...selectedRowRecord,
      _id: selectedRowRecord._id,
    });
    setIsTreatmentPlanModalOpen(true);
  };

  const columns: any = [
    {
      title: "Treatment Plan",
      dataIndex: "treatment_plan_name",
      width: "10rem",
      align: "center",
      render: (treatment_plan_name: string, record: any) => {
        return (
          <div onClick={() => SelectedRowHandler(record)}>
            {treatment_plan_name}
          </div>
        );
      },
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      width: "10rem",
      align: "center",
      render: (created_at: string, record: any) => {
        return (
          <div onClick={() => SelectedRowHandler(record)}>
            {moment(created_at).format("MMMM DD, YYYY")}
          </div>
        );
      },
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      width: "15rem",
      align: "center",

      render: (amount: number, record: any) => {
        if (amount) {
          return (
            <div onClick={() => SelectedRowHandler(record)}>
              {currency} {numberSeparator(amount, 0)}
            </div>
          );
        }
      },
    },
    {
      title: "Action",
      dataIndex: "",
      width: "5rem",
      align: "center",
      render: (_: any, record: any) => {
        return (
          <div className="w-full flex justify-center">
            <Link
              href={`/admin/print?page=treatment plan&patient=${JSON.stringify(
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

  const [TreatmentPlanForm] = Form.useForm();

  const queryClient = useQueryClient();

  let [page, setPage] = React.useState(1);

  let [search, setSearch] = React.useState("");

  let [isTreatmentPlanModalOpen, setIsTreatmentPlanModalOpen] = React.useState(
    false
  );

  let { data: treatmentPlan, isLoading: treatmentPlanIsLoading } = useQuery(
    ["treatment-plan", page, search],
    () =>
      fetchData({
        url: `/api/patient/treatment-plan/${patientRecord._id}?limit=5&page=${page}&search=${search}`,
      })
  );

  const { mutate: deleteTreatmentPlan }: any = useMutation(
    (treatment_plan_id: number) =>
      deleteData({
        url: `/api/patient/treatment-plan/${treatment_plan_id}`,
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Treatment Plan Deleted",
          description: "Treatment Plan has been deleted",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["treatment-plan"],
        });
        const previousValues = queryClient.getQueryData(["treatment-plan"]);
        queryClient.setQueryData(["treatment-plan"], (oldData: any) =>
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
        queryClient.setQueryData(["treatment-plan"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["treatment-plan"] });
      },
    }
  );

  return (
    <>
      <div className="flex flex-auto">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={treatmentPlan?.data}
          showHeader={true}
          tableLayout="fixed"
          loading={treatmentPlanIsLoading}
          title={() => (
            <div className="space-y-4 md:p-12 p-6 !pb-0">
              <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
                <h4 className="basis-full md:basis-auto">Treatment Plan</h4>
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
                    onClick={() => setIsTreatmentPlanModalOpen(true)}
                  >
                    New Treatment Plan
                  </Button>
                </div>
              </div>
            </div>
          )}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            showSizeChanger: false,
            total: treatmentPlan?.meta?.total,
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
                let selectedRow = treatmentPlan?.data?.find(
                  ({ _id }: any) => _id === rest["data-row-key"]
                );
                return <tr {...rest} />;
              },
            },
          }}
          className="[&.ant-table]:!rounded-none"
        />
      </div>
      <AddTreatmentPlanModal
        pageType={pageType}
        show={isTreatmentPlanModalOpen}
        onClose={() => {
          setIsTreatmentPlanModalOpen(false);
          TreatmentPlanForm.resetFields();
        }}
        className="w-[75rem]"
        currency={currency}
        id="treatment-plan-modal"
        patientRecord={patientRecord}
        form={TreatmentPlanForm}
      />
    </>
  );
}

export default TreatmentPlan;
