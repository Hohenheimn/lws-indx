import React from "react";
import { DatePicker, Form, TimePicker, notification } from "antd";
import Input from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Select } from "antd";
import Modal from "../../../components/Modal";
import { scroller } from "react-scroll";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, postData } from "../../../../utils/api";
import { Context } from "../../../../utils/context/Provider";
import moment from "moment";
import { InfiniteSelect } from "../../../components/InfiniteSelect";
import {
  getInitialValue,
  removeNumberFormatting,
} from "../../../../utils/helpers";
import TextArea from "antd/lib/input/TextArea";
import { NumericFormat } from "react-number-format";

export default function AddTreatmentPlanModal({
  show,
  onClose,
  form,
  patientRecord,
  ...rest
}: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const { mutate: addTreatmentPlan } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/patient/treatment-plan/${patientRecord?._id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding Treatment Plan Success",
          description: `Adding Treatment Plan Success`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["treatment-plan"] });
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

  const { mutate: editTreatmentPlan } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/patient/treatment-plan/update/${payload.id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Treatment Plan Updated!",
          description: `Treatment Plan Updated!`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["treatment-plan"] });
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
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">New Treatment Plan</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            values.cost = removeNumberFormatting(values.cost);
            values.discount = removeNumberFormatting(values.discount);
            let id = form.getFieldValue("_id");

            if (!id) {
              addTreatmentPlan(values);
            } else {
              values.id = id;
              editTreatmentPlan(values);
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
                label="Date Created"
                name="date_created"
                required={false}
                initialValue={moment()}
              >
                <DatePicker
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  placeholder="Date Created"
                  disabled={true}
                  format="MMMM DD, YYYY"
                />
              </Form.Item>
              <Form.Item
                label="Treatment Plan Name"
                name="treatment_plan_name"
                rules={[
                  {
                    required: true,
                    message: "Treatment Plan Name is required",
                  },
                ]}
                required={false}
              >
                <Input
                  id="treatment_plan_name"
                  placeholder="Add Treatment Plan Name"
                />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <h4>Treatment List</h4>
            <div className="grid grid-cols-1 gap-4">
              <Form.Item
                label="Procedure"
                name="procedure_id"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
              >
                <InfiniteSelect
                  placeholder="Select Procedure"
                  id="procedure_id"
                  api={`${
                    process.env.REACT_APP_API_BASE_URL
                  }/api/procedure?limit=3&for_dropdown=true&page=1${getInitialValue(
                    form,
                    "procedure"
                  )}`}
                  queryKey={["procedure"]}
                  displayValueKey="name"
                  returnValueKey="_id"
                />
              </Form.Item>
              <Form.Item
                label="Tooth"
                name="tooth"
                rules={[
                  {
                    required: true,
                    message: "Tooth is required",
                  },
                ]}
                required={false}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Tooth"
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  onChange={(e) => {
                    let cost = removeNumberFormatting(
                      form.getFieldValue("cost") ?? 0
                    );
                    let discount = form.getFieldValue("discount")
                      ? removeNumberFormatting(form.getFieldValue("discount")) /
                        100
                      : 0;
                    let toothTotal = e?.length ?? 0;
                    let discountedCost = cost * discount;
                    let total = (cost - discountedCost) * toothTotal;

                    form.setFieldValue("total_amount", total);
                  }}
                >
                  <Select.Option value={1}>Toothache</Select.Option>
                  <Select.Option value={2}>2</Select.Option>
                  <Select.Option value={3}>3</Select.Option>
                  <Select.Option value={4}>4</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Notes"
                name="notes"
                // rules={[{ required: true, message: "Notes is required" }]}
                required={false}
              >
                <TextArea
                  id="notes"
                  placeholder="Notes"
                  rows={8}
                  className="!border-2"
                />
              </Form.Item>
              <Form.Item
                label="Cost"
                name="cost"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
              >
                <NumericFormat
                  customInput={Input}
                  placeholder="Cost"
                  thousandSeparator=","
                  thousandsGroupStyle="thousand"
                  id="cost"
                  prefix="₱"
                  onValueChange={({ floatValue }) => {
                    // if (floatValue < 0) floatValue = 0;
                    // if (floatValue > 100) floatValue = 100;
                    let cost = floatValue ?? 0;
                    let discount = form.getFieldValue("discount")
                      ? removeNumberFormatting(form.getFieldValue("discount")) /
                        100
                      : 0;
                    let toothTotal = form.getFieldValue("tooth")?.length ?? 0;
                    let discountedCost = cost * discount;
                    let total = (cost - discountedCost) * toothTotal;

                    form.setFieldValue("total_amount", total);
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Add Discount (Optional)"
                name="discount"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
                initialValue={0}
              >
                <NumericFormat
                  customInput={Input}
                  placeholder="Add Discount"
                  id="discount"
                  suffix="%"
                  isAllowed={({ floatValue }: any) => {
                    return (
                      (floatValue >= 0 && floatValue <= 100) ||
                      floatValue === undefined
                    );
                  }}
                  onValueChange={({ floatValue, ...rest }) => {
                    let cost = removeNumberFormatting(
                      form.getFieldValue("cost") ?? 0
                    );
                    let discount = floatValue ? floatValue / 100 : 0;
                    let toothTotal = form.getFieldValue("tooth")?.length ?? 0;
                    let discountedCost = cost * discount;
                    let total = (cost - discountedCost) * toothTotal;

                    form.setFieldValue("total_amount", total);
                  }}
                />
              </Form.Item>
              <hr className="my-4 mx-0 border-t-2" />
              <Form.Item
                label="Total Amount"
                required={false}
                shouldUpdate={(prev, curr) => {
                  if (
                    prev.cost !== curr.cost ||
                    prev.discount !== curr.discount ||
                    prev.tooth !== curr.tooth
                  ) {
                    return true;
                  }

                  return false;
                }}
              >
                {({ getFieldValue, resetFields }) => {
                  //   let cost = removeNumberFormatting(getFieldValue("cost") ?? 0);
                  //   let discount = getFieldValue("discount")
                  //     ? removeNumberFormatting(getFieldValue("discount" ?? 0)) /
                  //       100
                  //     : 0;
                  //   let toothTotal = getFieldValue("tooth")?.length ?? 0;

                  //   console.log(cost, discount, toothTotal);

                  //   let discountedCost = cost * discount;
                  //   let total = (cost - discountedCost) * toothTotal;

                  return (
                    <Form.Item
                      name="total_amount"
                      rules={[{ required: true, message: "This is required!" }]}
                    >
                      <NumericFormat
                        customInput={Input}
                        placeholder="Total Amount"
                        id="total_amount"
                        prefix="₱"
                        readOnly
                      />
                    </Form.Item>
                  );
                }}
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
