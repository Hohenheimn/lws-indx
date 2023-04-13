import { Checkbox, DatePicker, Form, Popover, Table, notification } from "antd";
import React from "react";
import { scroller } from "react-scroll";
import { Button } from "../../../components/Button";
import Card from "../../../components/Card";
import Input from "../../../components/Input";
import { Select } from "../../../components/Select";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { numberSeparator } from "../../../../utils/helpers";
import { NextPageProps } from "../../../../utils/types/NextPageProps";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "../../../../utils/api";
import AddPrescriptionModal from "./AddPrescriptionModal";
import moment from "moment";

const columns: any = [
  {
    title: "Prescription",
    dataIndex: "name",
    width: "10rem",
    align: "center",
  },
  {
    title: "Date Created",
    dataIndex: "created_at",
    width: "10rem",
    align: "center",
    render: (created_at: Date) => moment(created_at).format("MMMM DD, YYYY"),
  },
];

export function Prescription({ patientRecord }: any) {
  const [PrescriptionForm] = Form.useForm();
  const queryClient = useQueryClient();
  let [page, setPage] = React.useState(1);
  let [search, setSearch] = React.useState("");

  let [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = React.useState(
    false
  );

  let { data: prescription, isLoading: prescriptionIsLoading } = useQuery(
    ["prescription", page, search],
    () =>
      fetchData({
        url: `/api/patient/prescription/${patientRecord._id}?limit=5&page=${page}&search=${search}`,
      })
  );

  console.log(prescription);

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
                let selectedRow = prescription?.data?.find(
                  ({ _id }: any) => _id === rest["data-row-key"]
                );

                return (
                  <Popover
                    placement="bottom"
                    showArrow={false}
                    content={
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          appearance="link"
                          className="text-casper-500 p-2"
                          onClick={() => {
                            PrescriptionForm.setFieldsValue({
                              ...selectedRow,
                              created_at: moment(
                                selectedRow.created_at
                              ).isValid()
                                ? moment(selectedRow.created_at)
                                : undefined,
                              _id: selectedRow._id,
                            });

                            setIsPrescriptionModalOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <BsPencilSquare className="text-base" />
                            <div>Edit</div>
                          </div>
                        </Button>
                        <Button
                          appearance="link"
                          className="text-casper-500 p-2"
                          onClick={() =>
                            deletePrescription(rest["data-row-key"])
                          }
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
