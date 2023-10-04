import React from "react";
import { DatePicker, Form, TimePicker, notification } from "antd";
import { Select } from "antd";
import moment from "moment";
import Image from "next/image";
import { NumericFormat, PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { Button } from "@components/Button";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { getInitialValue, removeNumberFormatting } from "@utilities/helpers";

export default function AddInventoryModal({
  show,
  onClose,
  form,
  currency,
  ...rest
}: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const { mutate: addInventory } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/inventory`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding Inventory Success",
          description: `Adding Inventory Success`,
        });
        form.resetFields();
        onClose();
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

  const { mutate: editInventory } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/inventory/${payload.id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Inventory Updated!",
          description: `Inventory Updated!`,
        });
        form.resetFields();
        onClose();
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

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">New Inventory</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            let id = form.getFieldValue("_id");
            values.remaining_quantity = removeNumberFormatting(
              values.remaining_quantity
            );
            values.cost_per_item = removeNumberFormatting(values.cost_per_item);

            if (!id) {
              addInventory(values);
            } else {
              values.id = id;
              editInventory(values);
            }
          }}
          onFinishFailed={(data) => {
            scroller.scrollTo(
              data?.errorFields[0]?.name?.join("-")?.toString(),
              {
                smooth: true,
                offset: -50,
                containerId: rest?.id,
              }
            );
          }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label="Item Name"
                name="item_name"
                rules={[
                  {
                    required: true,
                    message: "Item Name is required",
                  },
                ]}
                required={true}
              >
                <Input id="item_name" placeholder="Item Name" />
              </Form.Item>
              {/* <Form.Item
                label="Serial Number"
                name="serial_number"
                rules={[
                  {
                    required: true,
                    message: "Serial Number is required",
                  },
                ]}
                required={true}
              >
                <Input id="serial_number" placeholder="Serial Number" />
              </Form.Item> */}
              <Form.Item
                label="Remaining Quantity"
                name="remaining_quantity"
                rules={[
                  {
                    required: true,
                    message: "Remaining Quantity is required",
                  },
                ]}
                required={true}
              >
                <NumericFormat
                  customInput={Input}
                  id="remaining_quantity"
                  allowNegative={false}
                  placeholder="Remaining Quantity"
                  thousandSeparator=","
                />
              </Form.Item>
              <Form.Item
                label="Branch Assigned"
                name="branch_assigned"
                rules={[
                  {
                    required: true,
                    message: "Branch Assigned is required",
                  },
                ]}
                required={true}
              >
                <InfiniteSelect
                  placeholder="Branch Assigned"
                  id="branch_assigned"
                  api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                  getInitialValue={{
                    form,
                    initialValue: "branch_assigned",
                  }}
                  queryKey={["branch_assigned"]}
                  displayValueKey="name"
                  returnValueKey="_id"
                />
              </Form.Item>
              <Form.Item
                label="Cost Per Item"
                name="cost_per_item"
                rules={[
                  {
                    required: true,
                    message: "Cost Per Item is required",
                  },
                ]}
                required={true}
              >
                <NumericFormat
                  customInput={Input}
                  placeholder="Cost Per Item"
                  thousandSeparator=","
                  thousandsGroupStyle="thousand"
                  id="cost_per_item"
                  prefix={currency}
                />
              </Form.Item>
              <Form.Item
                label="Supplier Name"
                name="supplier_name"
                rules={[
                  {
                    required: true,
                    message: "Supplier Name is required",
                  },
                ]}
                required={true}
              >
                <Input id="supplier_name" placeholder="Supplier Name" />
              </Form.Item>
              <Form.Item
                label="Supplier Number"
                name="supplier_number"
                rules={[
                  { required: true, message: "This is required!" },
                  {
                    pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                    message: "Please use correct format!",
                  },
                ]}
                required={true}
                className="col-span-3 lg:col-span-1"
              >
                <PatternFormat
                  customInput={Input}
                  placeholder="09XX-XXX-XXXXX"
                  patternChar="*"
                  format="****-***-****"
                  allowEmptyFormatting={false}
                  id="supplier_number"
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              className="max-w-[10rem]"
              type="submit"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
