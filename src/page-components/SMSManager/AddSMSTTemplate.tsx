import React from "react";
import { Form, notification } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { scroller } from "react-scroll";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { Button } from "@src/components/Button";
import DeleteButton from "@src/components/DeleteButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteData,
  postData,
  postDataMultipleFile,
  postDataNoFormData,
} from "@utilities/api";
import { Context } from "@utilities/context/Provider";

export default function AddSMSTemplate({
  show,
  onClose,
  form,
  patientRecord,
  ...rest
}: any) {
  const queryClient = useQueryClient();

  const { setIsAppLoading } = React.useContext(Context);

  let id = form?.getFieldValue("_id");

  const { mutate: createSMSTemplate } = useMutation(
    (payload: FormData) => {
      return postDataNoFormData({
        url: `/api/sms-manager`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding SMS Template Success",
          description: `Adding SMS Template list Success`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["sms-template"],
        });
        const previousValues = queryClient.getQueryData(["sms-template"]);
        queryClient.setQueryData(["sms-template"], (oldData: any) =>
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
        queryClient.setQueryData(["sms-template"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({
          queryKey: ["sms-template"],
        });
      },
    }
  );

  const { mutate: editSMSTemplate } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/sms-manager/${id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "SMS Template Updated!",
          description: `SMS Template Updated!`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["sms-template"],
        });
        const previousValues = queryClient.getQueryData(["sms-template"]);
        queryClient.setQueryData(["sms-template"], (oldData: any) =>
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
        queryClient.setQueryData(["sms-template"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["sms-template"] });
      },
    }
  );

  const { mutate: deleteSMSTemplate }: any = useMutation(
    (idPayload: number) =>
      deleteData({
        url: `/api/sms-manager/${idPayload}`,
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "SMS Template Deleted",
          description: "SMS Template has been deleted",
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["sms-template"],
        });
        const previousValues = queryClient.getQueryData(["sms-template"]);
        queryClient.setQueryData(["sms-template"], (oldData: any) =>
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
        queryClient.setQueryData(["sms-template"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["sms-template"] });
      },
    }
  );

  return (
    <Modal show={show} onClose={() => {}} {...rest}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">Add SMS Template</div>
        </div>
        {id && (
          <DeleteButton
            label="Delete SMS Template"
            deleteHandler={() => deleteSMSTemplate(id)}
          />
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            let id = form.getFieldValue("_id");
            if (!id) {
              createSMSTemplate(values);
            } else {
              editSMSTemplate(values);
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
          className="space-y-5"
        >
          <Form.Item
            label="SMS Template Name"
            name="template_name"
            rules={[
              {
                required: true,
                message: "This is required!",
              },
            ]}
            required={true}
          >
            <Input id="sms-template_name" placeholder="SMS Template Name" />
          </Form.Item>
          <Form.Item
            name="message_content"
            label="Message Content"
            rules={[
              {
                required: true,
                message: "This is required!",
              },
            ]}
            required={true}
          >
            <TextArea
              id="sms-message_content"
              placeholder="Message Content"
              className=" shadow-md"
            />
          </Form.Item>
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => onClose()}
              id="sms-cancel"
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              className="max-w-[10rem]"
              type="submit"
              id="sms-save"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
