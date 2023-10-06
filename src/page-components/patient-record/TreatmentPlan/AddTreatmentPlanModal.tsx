import React, { useEffect } from "react";
import { DatePicker, Form, Radio, TimePicker, notification } from "antd";
import { Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { AnimatePresence } from "framer-motion";
import moment from "moment";
import { AiFillMinusCircle } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import { NumericFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { AnimateContainer } from "@components/animation";
import { down, fadeIn } from "@components/animation/animation";
import { Button } from "@components/Button";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import Modal from "@components/Modal";
import DeleteButton from "@src/components/DeleteButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import {
  getAge,
  getInitialValue,
  removeNumberFormatting,
  toothNumbers,
} from "@utilities/helpers";

export default function AddTreatmentPlanModal({
  show,
  onClose,
  currency,
  form,
  patientRecord,
  pageType,
  ...rest
}: any) {
  const age = getAge(patientRecord.birthdate);

  const queryClient = useQueryClient();

  const { setIsAppLoading } = React.useContext(Context);

  const discount_type = Form.useWatch("discount_type", form);

  const discountField = Form.useWatch("discount", form);

  const estimated_costField = Form.useWatch("estimated_cost", form);

  const treatment_plan_list = Form.useWatch("treatment_plan_list", form);

  useEffect(() => {
    let total = 0;
    treatment_plan_list?.map((item: any) => (total = total + item.total));
    form.setFieldValue("estimated_cost", total);
    form.setFieldValue("total_amount", total);
  }, [treatment_plan_list]);

  const UpdateValue = (index: number | string, value: any, field: string) => {
    const cloneToUpdate = treatment_plan_list.map(
      (item: any, indexMap: number) => {
        if (indexMap === index && field === "procedure") {
          const total = Number(item.tooth.length * value.cost);
          return {
            ...item,
            cost: value.cost,
            procedure_name: value.procedure_name,
            procedure_id: value.procedure_id,
            total: total,
          };
        }
        if (indexMap === index && field === "tooth") {
          const total = Number(value.tooth.length * item.cost);
          return {
            ...item,
            tooth: value.tooth,
            total: total,
          };
        }
        if (indexMap === index && field === "cost") {
          const total = Number(item.tooth.length * value.cost);
          return {
            ...item,
            cost: value.cost,
            total: total,
          };
        }
        return item;
      }
    );
    form.setFieldValue("treatment_plan_list", cloneToUpdate);
  };

  useEffect(() => {
    let discount = 0;
    if (discount_type === "Percent") {
      discount = removeNumberFormatting(discountField)
        ? removeNumberFormatting(discountField) / 100
        : 0;
      discount = estimated_costField * discount;
    }
    if (discount_type === "Amount") {
      discount = removeNumberFormatting(discountField)
        ? removeNumberFormatting(discountField)
        : 0;
    }
    let total = estimated_costField - discount;
    form.setFieldValue("total_amount", total);
  }, [discountField, estimated_costField, discount_type]);

  let id = form.getFieldValue("_id");

  const addHandler = () => {
    form.setFieldValue("treatment_plan_list", [
      ...treatment_plan_list,
      {
        procedure_id: "",
        tooth: [],
        cost: "",
        total: "",
      },
    ]);
  };

  React.useEffect(() => {
    form.setFieldsValue({
      ...form,
      created_at: moment(form?.getFieldValue("created_at")).isValid()
        ? moment(form?.getFieldValue("created_at"))
        : undefined,
    });
  }, [show]);

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
        await queryClient.cancelQueries({
          queryKey: ["treatment-plan"],
        });
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
        await queryClient.cancelQueries({
          queryKey: ["treatment-plan"],
        });
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

  const { mutate: deleteTreatmentPlan }: any = useMutation(
    (treatment_plan_id: number) =>
      deleteData({
        url: `/api/patient/treatment-plan/${treatment_plan_id}`,
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Treatment Plan Deleted",
          description: "Treatment Plan has been deleted",
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["treatment-plan"],
        });
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
          <div className="font-bold text-3xl">
            {!id ? "New" : "Update"} Treatment Plan
          </div>
        </div>
        {id && (
          <DeleteButton
            label="Delete Treatment Plan"
            deleteHandler={() => deleteTreatmentPlan()}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={(values: any) => {
            values.cost = removeNumberFormatting(values.cost);
            values.discount = removeNumberFormatting(values.discount);
            delete values.cost;
            delete values.date_created;
            let treatment_plan_list = values.treatment_plan_list.map(
              (itemMap: any) => {
                return {
                  ...itemMap,
                  cost: removeNumberFormatting(itemMap.cost),
                };
              }
            );
            values.treatment_plan_list = JSON.stringify(treatment_plan_list);
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
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                label="Treatment Plan Name"
                name="treatment_plan_name"
                rules={[
                  {
                    required: true,
                    message: "Treatment Plan Name is required",
                  },
                ]}
                required={true}
              >
                <Input
                  id="treatment_plan_name"
                  placeholder="Add Treatment Plan Name"
                  disabled={pageType === "view" && id}
                />
              </Form.Item>

              <Form.Item
                label="Date Created"
                name="created_at"
                required={false}
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
            </div>
          </div>
          <div className="space-y-4">
            <h4>Treatment List</h4>
            <div className="grid grid-cols-1 gap-4">
              <Form.List
                name="treatment_plan_list"
                initialValue={[
                  {
                    procedure_id: "",
                    tooth: [],
                    cost: "",
                    total: "",
                  },
                ]}
              >
                {(fields, { add, remove }) => {
                  return (
                    <>
                      <AnimatePresence>
                        {fields.map(({ name, key }) => {
                          return (
                            <AnimateContainer
                              variants={down}
                              key={key}
                              triggerOnce={true}
                            >
                              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 border border-gray-300 p-4 pt-4 rounded-md relative">
                                {fields.length > 1 ? (
                                  <AiFillMinusCircle
                                    className={`absolute z-10 top-0 right-3 m-2  text-3xl ${
                                      pageType === "view" && id
                                        ? " text-gray-400"
                                        : "cursor-pointer text-danger"
                                    }`}
                                    onClick={() => {
                                      if (pageType === "view" && id) return;
                                      remove(name);
                                    }}
                                  />
                                ) : null}
                                <Form.Item
                                  label="Procedure"
                                  name={[name, "procedure_name"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "This is required!",
                                    },
                                  ]}
                                  required={true}
                                >
                                  <InfiniteSelect
                                    placeholder="Select Procedure"
                                    disabled={pageType === "view" && id}
                                    id={[
                                      "treatment_plan_list",
                                      name,
                                      "procedure_name",
                                    ].join("-")}
                                    api={`${
                                      process.env.REACT_APP_API_BASE_URL
                                    }/api/procedure?limit=3&for_dropdown=true&page=1${getInitialValue(
                                      form,
                                      "procedure"
                                    )}`}
                                    queryKey={["procedure"]}
                                    returnAllValue={true}
                                    displayValueKey="name"
                                    returnValueKey="_id"
                                    onChange={(e) => {
                                      UpdateValue(
                                        name,
                                        {
                                          cost: e.cost,
                                          procedure_id: e._id,
                                          procedure_name: e.name,
                                        },
                                        "procedure"
                                      );
                                    }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  label="Tooth"
                                  name={[name, "tooth"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Tooth is required",
                                    },
                                  ]}
                                  required={true}
                                >
                                  <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Tooth"
                                    disabled={pageType === "view" && id}
                                    id={[
                                      "treatment_plan_list",
                                      name,
                                      "tooth",
                                    ].join("-")}
                                    getPopupContainer={(triggerNode: any) => {
                                      return triggerNode.parentNode;
                                    }}
                                    onChange={(e) => {
                                      UpdateValue(name, { tooth: e }, "tooth");
                                    }}
                                  >
                                    {toothNumbers(age).map((item: number) => (
                                      <Select.Option value={item} key={item}>
                                        {item}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>

                                <Form.Item
                                  label="Cost"
                                  name={[name, "cost"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "This is required!",
                                    },
                                  ]}
                                  required={true}
                                >
                                  <NumericFormat
                                    customInput={Input}
                                    disabled={pageType === "view" && id}
                                    placeholder="Cost"
                                    thousandSeparator=","
                                    thousandsGroupStyle="thousand"
                                    className="text-end"
                                    id={[
                                      "treatment_plan_list",
                                      name,
                                      "cost",
                                    ].join("-")}
                                    prefix={currency}
                                    onValueChange={({ floatValue }) => {
                                      let cost = floatValue ?? 0;

                                      UpdateValue(name, { cost: cost }, "cost");
                                    }}
                                  />
                                </Form.Item>

                                <Form.Item
                                  label="Total Amount"
                                  name={[name, "total"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "This is required!",
                                    },
                                  ]}
                                  required={true}
                                >
                                  <NumericFormat
                                    customInput={Input}
                                    placeholder="Total Amount"
                                    thousandSeparator
                                    id={[
                                      "treatment_plan_list",
                                      name,
                                      "total",
                                    ].join("-")}
                                    prefix={currency}
                                    readOnly
                                    disabled={true}
                                  />
                                </Form.Item>
                              </div>
                            </AnimateContainer>
                          );
                        })}
                      </AnimatePresence>
                      <div className="border border-gray-300 p-4 pt-8 rounded-md relative">
                        <div className="blur-sm grid grid-cols-1 lg:grid-cols-4 gap-4">
                          <Form.Item
                            label="Procedure"
                            rules={[
                              {
                                required: true,
                                message: "This is required!",
                              },
                            ]}
                            required={true}
                          >
                            <InfiniteSelect
                              placeholder="Select Procedure"
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
                            rules={[
                              {
                                required: true,
                                message: "Tooth is required",
                              },
                            ]}
                            required={true}
                          >
                            <Select
                              mode="multiple"
                              allowClear
                              placeholder="Tooth"
                              getPopupContainer={(triggerNode: any) => {
                                return triggerNode.parentNode;
                              }}
                            ></Select>
                          </Form.Item>
                          <Form.Item label="Cost" required={true}>
                            <NumericFormat
                              customInput={Input}
                              placeholder="Cost"
                              thousandSeparator=","
                              thousandsGroupStyle="thousand"
                              prefix={currency}
                            />
                          </Form.Item>
                          <Form.Item label="Total Amount" required={true}>
                            <NumericFormat
                              customInput={Input}
                              placeholder="Total Amount"
                              prefix={currency}
                              readOnly
                            />
                          </Form.Item>
                        </div>
                        <div
                          className={`absolute top-0 left-0 h-full w-full flex justify-center items-center ${
                            pageType === "view" && id ? "" : "cursor-pointer"
                          } `}
                          onClick={() => {
                            if (pageType === "view" && id) return;
                            addHandler();
                          }}
                        >
                          <IoMdAddCircle
                            className={`text-7xl ${
                              pageType === "view" && id
                                ? "text-gray-400"
                                : "text-primary"
                            }`}
                          />
                        </div>
                      </div>
                    </>
                  );
                }}
              </Form.List>
            </div>
            <div className="flex items-end flex-col">
              <div className="w-1/2">
                <div className="space-y-4">
                  <Form.Item
                    label="Notes"
                    name="notes"
                    // rules={[{ required: true, message: "Notes is required" }]}
                    required={true}
                    className="basis-1/2"
                    initialValue={""}
                  >
                    <TextArea
                      id="notes"
                      placeholder="Notes"
                      // rows={8}
                      className="!border-2"
                      disabled={pageType === "view" && id}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Estimated Cost"
                    name="estimated_cost"
                    rules={[
                      {
                        required: true,
                        message: "This is required!",
                      },
                    ]}
                    required={true}
                  >
                    <NumericFormat
                      customInput={Input}
                      placeholder="Estimated Cost"
                      id="estimated_cost"
                      prefix={currency}
                      className=" text-end"
                      readOnly
                      thousandSeparator
                      disabled={pageType === "view" && id}
                    />
                  </Form.Item>

                  <div>
                    <p className="mb-1">Choose Type of Discount</p>
                    <Form.Item
                      name="discount_type"
                      required={true}
                      className="text-base"
                      initialValue={""}
                    >
                      <Radio.Group
                        id="discount_type"
                        className="grid grid-cols-1 gap-1 text-lg"
                        disabled={pageType === "view" && id}
                      >
                        <Radio value="Amount">Amount Discount</Radio>
                        <Radio value="Percent">Percent Discount</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <Form.Item
                    label="Add Discount (Optional)"
                    name="discount"
                    rules={[
                      {
                        required: true,
                        message: "This is required!",
                      },
                    ]}
                    required={true}
                    initialValue={0}
                    className="basis-1/2"
                  >
                    <NumericFormat
                      customInput={Input}
                      placeholder="Add Discount"
                      id="discount"
                      prefix={discount_type === "Amount" ? currency : ""}
                      suffix={discount_type === "Percent" ? "%" : ""}
                      className=" text-end"
                      disabled={pageType === "view" && id}
                      isAllowed={({ floatValue }: any) => {
                        if (discount_type === "Percent")
                          return floatValue === undefined || floatValue <= 100;
                        if (discount_type === "Amount")
                          return (
                            floatValue === undefined ||
                            floatValue <= estimated_costField
                          );
                        return false;
                      }}
                    />
                  </Form.Item>
                </div>
                <hr className="my-4 mx-0 border-t-2" />
                <Form.Item
                  label="Total Amount"
                  required={true}
                  name="total_amount"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                >
                  <NumericFormat
                    customInput={Input}
                    placeholder="Total Amount"
                    id="total_amount"
                    thousandSeparator
                    prefix={currency}
                    className=" text-end"
                    disabled={true}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          {pageType === "view" && id ? (
            <div>
              <div className="flex justify-end items-center gap-4">
                <Button
                  appearance="link"
                  className="p-4 bg-transparent border-none text-casper-500 font-semibold"
                  onClick={() => onClose()}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div>
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
            </div>
          )}
        </Form>
      </div>
    </Modal>
  );
}
