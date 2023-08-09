import React, { useEffect } from "react";
import { Form, Upload, notification } from "antd";
import Image from "next/image";
import { AiOutlineInbox } from "react-icons/ai";
import { IoPersonOutline } from "react-icons/io5";
import { NumericFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { Button } from "@components/Button";
import Input from "@components/Input";
import Modal from "@components/Modal";
import Avatar from "@src/components/Avatar";
import Uploader from "@src/components/Uploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData, updateData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { getBase64, removeNumberFormatting } from "@utilities/helpers";

export default function AddProcedureModal({
  show,
  onClose,
  form,
  ...rest
}: any) {
  const queryClient = useQueryClient();

  const { setIsAppLoading } = React.useContext(Context);

  const iconUrl = form.getFieldValue("icon");

  let [image, setImage] = React.useState({
    imageUrl: iconUrl ? iconUrl : "",
    error: false,
    file: null,
    loading: false,
    edit: false,
  });

  useEffect(() => {
    setImage({
      ...image,
      imageUrl: iconUrl,
    });
  }, [show]);

  function handleChange(info: any) {
    if (info.file.status === "uploading") {
      return setImage({
        ...image,
        loading: true,
        file: null,
        edit: false,
      });
    }

    if (info.file.status === "error") {
      return setImage({
        ...image,
        loading: false,
        error: true,
        edit: false,
      });
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setImage({
          ...image,
          imageUrl,
          loading: false,
          file: info.file,
          edit: true,
        });
      });
      return info.file.originFileObj;
    }
  }

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
        form.setFieldValue("icon", "");
        setImage({
          imageUrl: "",
          error: false,
          file: null,
          loading: false,
          edit: false,
        });
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
        form.setFieldValue("icon", "");
        setImage({
          imageUrl: "",
          error: false,
          file: null,
          loading: false,
          edit: false,
        });
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
            values.icon = values.icon;
            if (!image.edit) {
              delete values.icon;
            }

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
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
              ]}
              required={false}
            >
              <Input id="procedure_name" placeholder="Procedure" />
            </Form.Item>
            <Form.Item
              label="Abbreviation"
              name="abbreviation"
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
              ]}
              required={false}
            >
              <Input id="abbreviation" placeholder="Abbreviation" />
            </Form.Item>
            <Form.Item
              label="Cost"
              name="cost"
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
              ]}
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
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
              ]}
              required={false}
            >
              <Input id="color_code" placeholder="Color Code" />
            </Form.Item>
            <Form.Item
              name="icon"
              valuePropName="file"
              getValueFromEvent={handleChange}
              rules={[
                {
                  required: true,
                  message: "This field is required",
                },
              ]}
              required={false}
              className="w-fit m-auto [&_.ant-form-item-explain]:text-center [&_.avatar]:[&.ant-form-item-has-error]:border-red-500"
            >
              <Uploader
                image={image}
                setImage={(value: any) => setImage(value)}
                className="[&_.ant-upload]:!border-0"
                id="icon"
              >
                <div className="space-y-2 text-center">
                  <Avatar className="h-40 w-40 p-8 overflow-hidden bg-white relative border border-gray-300 avatar transition">
                    {image.imageUrl ? (
                      <Image
                        src={
                          image.imageUrl
                            ? image.imageUrl
                            : "/images/default_tooth.png"
                        }
                        alt="procedure icons"
                        fill
                        sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                        objectFit="contain"
                        className="object-center contain h-full w-full"
                      />
                    ) : (
                      <Image
                        src={"/images/default_tooth.png"}
                        alt="procedure icons"
                        fill
                        sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                        objectFit="contain"
                        className="object-center contain h-full w-full"
                      />
                    )}
                  </Avatar>
                  <div className="text-casper-500">
                    {image.imageUrl ? "Change " : "Upload "}
                    Procedure Icon
                  </div>
                </div>
              </Uploader>
            </Form.Item>
          </div>
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => {
                setImage({
                  imageUrl: "",
                  error: false,
                  file: null,
                  loading: false,
                  edit: false,
                });
                form.setFieldValue("icon", "");
                onClose();
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
