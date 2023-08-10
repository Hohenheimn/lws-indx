import React from "react";
import { Checkbox, Form, Radio, notification } from "antd";
import { scroller } from "react-scroll";
import Modal from "@components/Modal";
import { Button } from "@src/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDataMultipleFile } from "@utilities/api";
import { Context } from "@utilities/context/Provider";

export default function BuySMSCreditModal({
  show,
  onClose,
  form,
  patientRecord,
  ...rest
}: any) {
  const queryClient = useQueryClient();

  const { setIsAppLoading } = React.useContext(Context);

  const { mutate: addMedicalGallery } = useMutation(
    (payload: FormData) => {
      return postDataMultipleFile({
        url: `/api/patient/gallery/${patientRecord?._id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding Gallery Success",
          description: `Adding gallery-list Success`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["medical-gallery"],
        });
        const previousValues = queryClient.getQueryData(["medical-gallery"]);
        queryClient.setQueryData(["medical-gallery"], (oldData: any) =>
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
        queryClient.setQueryData(["medical-gallery"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({
          queryKey: ["medical-gallery"],
        });
      },
    }
  );

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">Buy SMS Credit</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log(values);
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
          <Form.Item name="sms_credit" required={false} className="text-base">
            <Radio.Group className="w-full">
              <ul className="w-full">
                <li className="flex justify-between border-b border-gray-300 py-5">
                  <p className=" text-xl font-semibold">100 SMS CREDIT</p>
                  <Radio value="100" />
                </li>
                <li className="flex justify-between border-b border-gray-300 py-5">
                  <p className=" text-xl font-semibold">500 SMS CREDIT</p>
                  <Radio value="500" />
                </li>
                <li className="flex justify-between border-b border-gray-300 py-5">
                  <p className=" text-xl font-semibold">1,000 SMS CREDIT</p>
                  <Radio value="1000" />
                </li>
                <li className="flex justify-between py-5">
                  <p className=" text-xl font-semibold">2,000 SMS CREDIT</p>
                  <Radio value="2000" />
                </li>
              </ul>
            </Radio.Group>
          </Form.Item>
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
