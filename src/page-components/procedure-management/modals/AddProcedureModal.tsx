import React from "react";
import { Form, notification } from "antd";
import { NumericFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { Button } from "@components/Button";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData, updateData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { removeNumberFormatting } from "@utilities/helpers";

export default function AddProcedureModal({
  show,
  onClose,
  form,
  ...rest
}: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const { mutate: addProcedure } = useMutation(
    (payload: any) => {
      return postData({
        url: "/api/procedure",
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding New Procedure Success",
          description: `Adding New Procedure Success`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["procedure"] });
        const previousValues = queryClient.getQueryData(["procedure"]);
        queryClient.setQueryData(["procedure"], (oldData: any) =>
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
        queryClient.setQueryData(["procedure"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["procedure"] });
      },
    }
  );

  const { mutate: editProcedure } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/procedure/${payload.id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Editing Procedure Success",
          description: `Editing Procedure Success`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["procedure"] });
        const previousValues = queryClient.getQueryData(["procedure"]);
        queryClient.setQueryData(["procedure"], (oldData: any) =>
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
        queryClient.setQueryData(["procedure"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["procedure"] });
      },
    }
  );

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">Add Procedure</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            let id = form.getFieldValue("_id");
            values.cost = removeNumberFormatting(values.cost);
            if (!id) {
              addProcedure(values);
            } else {
              values.id = id;
              editProcedure(values);
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
          <div className="grid grid-cols-1 gap-4">
            <Form.Item
              label="Procedure"
              name="procedure_name"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Input id="procedure_name" placeholder="Procedure" />
            </Form.Item>
            <Form.Item
              label="Abbreviation"
              name="abbreviation"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Input id="abbreviation" placeholder="Abbreviation" />
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
              />
            </Form.Item>
            <Form.Item
              label="Color Code"
              name="color_code"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Input id="color_code" placeholder="Color Code" />
            </Form.Item>
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
