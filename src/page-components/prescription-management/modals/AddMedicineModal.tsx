import React from "react";
import { Form, notification } from "antd";
import { scroller } from "react-scroll";
import { Button } from "@components/Button";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";

export default function AddPrescriptionManagementModal({
  show,
  onClose,
  form,
  ...rest
}: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const { mutate: addMedicine } = useMutation(
    (payload: any) => {
      return postData({
        url: "/api/medicine",
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding New Medicine Success",
          description: `Adding New Medicine Success`,
        });
        form.resetFields();
        onClose();
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

  const { mutate: editMedicine } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/medicine/${payload.id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Editing Medicine Success",
          description: `Editing Medicine Success`,
        });
        form.resetFields();
        onClose();
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

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">Add Medicine</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            let id = form.getFieldValue("_id");
            if (!id) {
              addMedicine(values);
            } else {
              values.id = id;
              editMedicine(values);
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
              label="Generic Name"
              name="generic_name"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Input id="generic_name" placeholder="Generic Name" />
            </Form.Item>
            <Form.Item
              label="Brand Name"
              name="brand_name"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Input id="brand_name" placeholder="Brand Name" />
            </Form.Item>
            <Form.Item
              label="Dosage"
              name="dosage"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Input id="dosage" placeholder="Dosage" />
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
