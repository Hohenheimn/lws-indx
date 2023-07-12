import React from "react";
import { Form, Popover, notification } from "antd";
import Table from "antd/lib/table/Table";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import { Button } from "@components/Button";
import Input from "@components/Input";
import { Radio } from "@components/Radio";
import AddInventoryModal from "@pagecomponents/inventory/modals/AddInventoryModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { numberSeparator } from "@utilities/helpers";
import { NextPageProps } from "@utilities/types/NextPageProps";

const columns: any = [
  {
    title: "Item Name",
    dataIndex: "item_name",
    width: "10rem",
    align: "center",
  },
  // {
  //   title: "Serial Number",
  //   dataIndex: "serial_number",
  //   width: "10rem",
  //   align: "center",
  // },
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
];

export function Inventory({ router }: NextPageProps) {
  const [InventoryForm] = Form.useForm();
  let [page, setPage] = React.useState(1);
  let [search, setSearch] = React.useState("");
  let [isInventoryModalOpen, setIsInventoryModalOpen] = React.useState(false);
  let { setIsAppLoading } = React.useContext(Context);
  let queryClient = useQueryClient();

  const { mutate: deleteInventory }: any = useMutation(
    (id: number) =>
      deleteData({
        url: `/api/inventory/${id}`,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Inventory Item Deleted",
          description: "Inventory Item has been deleted",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["inventory"] });
        const previousValues = queryClient.getQueryData(["inventory"]);
        queryClient.setQueryData(["inventory"], (oldData: any) =>
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
        queryClient.setQueryData(["inventory"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["inventory"] });
      },
    }
  );

  const { data: inventory, isFetching: isInventoryLoading } = useQuery(
    ["inventory", page, search],
    () =>
      fetchData({
        url: `/api/inventory?limit=5&page=${page}&search=${search}`,
      })
  );

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
            prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
            className="rounded-full text-base shadow-none"
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        <div className="basis-full lg:basis-auto flex gap-4">
          <Button
            className="p-3 min-w-[15rem]"
            appearance="primary"
            onClick={() => {
              setIsInventoryModalOpen(true);
            }}
          >
            <div className="flex justify-center items-center">
              <IoIosAdd className="inline-block text-2xl" />{" "}
              <span>Add Item</span>
            </div>
          </Button>
        </div>
      </div>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={inventory?.data}
        showHeader={true}
        tableLayout="fixed"
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
          showSizeChanger: false,
          total: inventory?.meta?.total,
          onChange: (page) => setPage(page),
        }}
        loading={isInventoryLoading}
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
              let selectedRow = inventory?.data?.find(
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
                          InventoryForm.setFieldsValue({
                            ...selectedRow,
                            _id: selectedRow._id,
                          });

                          setIsInventoryModalOpen(true);
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
                        onClick={() => deleteInventory(rest["data-row-key"])}
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
      <AddInventoryModal
        show={isInventoryModalOpen}
        onClose={() => {
          setIsInventoryModalOpen(false);
          InventoryForm.resetFields();
        }}
        className="w-[80rem]"
        id="inventory-modal"
        form={InventoryForm}
      />
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(Inventory);
