import React from "react";
import { DatePicker, Form, TimePicker, notification } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import Image from "next/image";
import { AiFillMinusCircle } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import { NumericFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { AnimateContainer } from "@components/animation";
import { fadeIn } from "@components/animation/animation";
import { Button } from "@components/Button";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { Select } from "@components/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import {
  getInitialValue,
  numberSeparator,
  removeNumberFormatting,
} from "@utilities/helpers";

export default function AddAndUseCredit({
  remainingCredit,
  actionType,
  show,
  onCloseSecondModal,
  patientRecord,
  setUseCreditAmount,
  ...rest
}: any) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const { mutate: addCredit } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/patient/credit/${patientRecord?._id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding Credit Success",
          description: `Adding Credit Success`,
        });
        onCloseSecondModal();
        form.resetFields();
      },
      onError: (err: any, _, context: any) => {
        notification.warning({
          message: "Something Went Wrong",
          description: `${
            err.response.data[Object.keys(err.response.data)[0]]
          }`,
        });
        queryClient.setQueryData(["credit"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({
          queryKey: ["credit"],
        });
      },
    }
  );

  return (
    <Modal show={show} onClose={onCloseSecondModal} {...rest}>
      <div className="space-y-4">
        <div className="font-bold text-3xl text-center">
          {actionType} Credit
        </div>
        <p>
          Remaining Credit:{" "}
          {numberSeparator(remainingCredit ? remainingCredit : 0, 0)}
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values: any) => {
            values.amount = removeNumberFormatting(values.amount);

            if (actionType === "Use") {
              setUseCreditAmount(values.amount);
              onCloseSecondModal();
              form.resetFields();
            }
            if (actionType === "Add") {
              addCredit(values);
            }
          }}
          className=" w-full space-y-8"
        >
          <Form.Item
            name="amount"
            required={false}
            className="text-base"
            rules={[
              {
                required: true,
                message: "This is required",
              },
            ]}
          >
            <NumericFormat
              customInput={Input}
              placeholder="Enter Amount"
              id="amount"
              prefix={"₱"}
              className=" text-end"
              thousandSeparator
              isAllowed={({ floatValue }: any) => {
                if (actionType === "Add") {
                  return true;
                } else {
                  return floatValue <= remainingCredit
                    ? remainingCredit
                    : 0 || floatValue === undefined;
                }
              }}
            />
          </Form.Item>
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => {
                form.resetFields();
                onCloseSecondModal();
                form.resetFields();
              }}
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
