import React from "react";
import { AnimateContainer, PageContainer } from "../../components/animation";
import { Button } from "../../components/Button";
import Table from "antd/lib/table/Table";
import { AiOutlineSearch } from "react-icons/ai";
import Input from "../../components/Input";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { NextPageProps } from "../../../utils/types/NextPageProps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "../../../utils/api";
import { Form, Popover, notification } from "antd";
import { Context } from "../../../utils/context/Provider";
import { format, parseISO } from "date-fns";
import AddPrescriptionManagementModal from "./modals/AddPrescriptionModal";
import { fadeIn } from "../../components/animation/animation";
import { useRouter } from "next/router";

export function PrescriptionTemplate() {
  const router = useRouter();
  const [PrescriptionForm] = Form.useForm();
  const { setIsAppLoading } = React.useContext(Context);
  const queryClient = useQueryClient();

  let [page, setPage] = React.useState(1);
  let [isPrescriptionModalOpen, setIsPrescriptionModalOpen] =
    React.useState(false);

  const { data: prescription, isFetching: isProceduresLoading } = useQuery(
    ["prescription", page],
    () =>
      fetchData({
        url: `/api/prescription?limit=5&page=${page}`,
      })
  );

  //   console.log(prescription);

  const { mutate: deletePrescription }: any = useMutation(
    (id: number) =>
      deleteData({
        url: `/api/prescription/${id}`,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
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

  const columns: any = [
    {
      title: "Prescription Name",
      dataIndex: "name",
      width: "15rem",
      align: "center",
    },
    // {
    //   title: "Date Created",
    //   dataIndex: "created_at",
    //   width: "15rem",
    //   align: "center",
    //   render: (created_at: string) =>
    //     format(parseISO(created_at), "MMM dd, yyyy"),
    // },
  ];

  return (
    <>
      <AnimateContainer
        variants={fadeIn}
        key="prescription-template"
        className="flex flex-col flex-auto space-y-4"
      >
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="basis-full lg:basis-1/2">
            <Input
              placeholder="Search"
              prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
              className="rounded-full border-none text-lg"
            />
          </div>
          <div className="basis-full lg:basis-auto flex gap-4">
            <Button
              className="p-3 min-w-[15rem]"
              appearance="primary"
              onClick={() => setIsPrescriptionModalOpen(true)}
            >
              <div className="flex justify-center items-center">
                <IoIosAdd className="inline-block text-2xl" />{" "}
                <span>Create Prescription</span>
              </div>
            </Button>
          </div>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={prescription?.data}
          showHeader={true}
          tableLayout="fixed"
          loading={isProceduresLoading}
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
              return (
                <table {...rest} style={{ flex: `${tableFlexGrow} 1 auto` }} />
              );
            },
            body: {
              row: ({ ...rest }: any) => {
                let selectedRow = prescription?.data?.find(
                  ({ _id }: any) => _id === rest["data-row-key"]
                );

                let medicines = selectedRow?.medicines?.map(
                  ({ medicine_id, name, ...rest }: any) => ({
                    medicine_id: {
                      _id: medicine_id,
                      name,
                    },
                    ...rest,
                  })
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
        />
      </AnimateContainer>
      <AddPrescriptionManagementModal
        show={isPrescriptionModalOpen}
        onClose={() => {
          setIsPrescriptionModalOpen(false);
          PrescriptionForm.resetFields();
        }}
        className="w-[80rem]"
        id="prescription-modal"
        form={PrescriptionForm}
      />
    </>
  );
}

export default PrescriptionTemplate;
