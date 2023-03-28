import React from "react";
import { AnimateContainer, PageContainer } from "../../components/animation";
import { Button } from "../../components/Button";
import Table from "antd/lib/table/Table";
import { AiOutlineSearch } from "react-icons/ai";
import Input from "../../components/Input";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "../../../utils/api";
import { Form, Popover, notification } from "antd";
import { Context } from "../../../utils/context/Provider";
import AddMedicineManagementModal from "./modals/AddMedicineModal";
import { fadeIn } from "../../components/animation/animation";
import moment from "moment";

export function MedicineList() {
  const [MedicineForm] = Form.useForm();
  const { setIsAppLoading } = React.useContext(Context);
  const queryClient = useQueryClient();
  let [search, setSearch] = React.useState("");
  let [page, setPage] = React.useState(1);
  let [isMedicineModalOpen, setIsMedicineModalOpen] = React.useState(false);

  const { data: medicine, isFetching: isProceduresLoading } = useQuery(
    ["medicine", page, search],
    () =>
      fetchData({
        url: `/api/medicine?limit=5&page=${page}&search=${search}`,
      })
  );

  const { mutate: deleteMedicine }: any = useMutation(
    (id: number) =>
      deleteData({
        url: `/api/medicine/${id}`,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Medicine Deleted",
          description: "Medicine has been deleted",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["medicine"] });
        const previousValues = queryClient.getQueryData(["medicine"]);
        queryClient.setQueryData(["medicine"], (oldData: any) =>
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
        queryClient.setQueryData(["medicine"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["medicine"] });
      },
    }
  );

  const columns: any = [
    {
      title: "Generic Name",
      dataIndex: "generic_name",
      width: "10rem",
      align: "center",
    },
    {
      title: "Brand Name",
      dataIndex: "brand_name",
      width: "10rem",
      align: "center",
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      width: "10rem",
      align: "center",
    },
  ];

  return (
    <>
      <AnimateContainer
        variants={fadeIn}
        key="medicine-template"
        className="flex flex-col flex-auto space-y-4"
      >
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
            <Button
              className="p-3 min-w-[15rem]"
              appearance="primary"
              onClick={() => setIsMedicineModalOpen(true)}
            >
              <div className="flex justify-center items-center">
                <IoIosAdd className="inline-block text-2xl" />{" "}
                <span>Add Medicine</span>
              </div>
            </Button>
          </div>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={medicine?.data}
          showHeader={true}
          tableLayout="fixed"
          loading={isProceduresLoading}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            showSizeChanger: false,
            total: medicine?.meta?.total,
            onChange: (page) => setPage(page),
          }}
          components={{
            table: ({ ...rest }: any) => {
              let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
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
                let selectedRow = medicine?.data?.find(
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
                            MedicineForm.setFieldsValue({
                              ...selectedRow,
                              _id: selectedRow._id,
                            });

                            setIsMedicineModalOpen(true);
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
                          onClick={() => deleteMedicine(rest["data-row-key"])}
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
      <AddMedicineManagementModal
        show={isMedicineModalOpen}
        onClose={() => {
          setIsMedicineModalOpen(false);
          MedicineForm.resetFields();
        }}
        className="w-[40rem]"
        id="medicine-modal"
        form={MedicineForm}
      />
    </>
  );
}

export default MedicineList;
