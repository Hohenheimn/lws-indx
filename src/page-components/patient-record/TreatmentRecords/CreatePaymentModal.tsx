import React, { useEffect, useState } from "react";
import { DatePicker, Form, TimePicker, notification } from "antd";
import TextArea from "antd/lib/input/TextArea";
import search from "antd/lib/transfer/search";
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
import { Select } from "@src/components/Select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteData,
  fetchData,
  postData,
  postDataNoFormData,
} from "@utilities/api";

import { Context } from "@utilities/context/Provider";

import {
  getInitialValue,
  numberSeparator,
  removeNumberFormatting,
} from "@utilities/helpers";

import AddAndUseCredit from "./AddAndUseCredit";
import { SelectedBilling } from "./types";

export default function CreatePaymentModal({
  show,
  onClose,
  patientRecord,
  SelectedBilling,
  setSelectedBilling,
  currency,
  ...rest
}: any) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const [addorUseCreditModal, setAddorUseCreditModal] = useState({
    toggle: false,
    type: "",
  });

  const [useCreditAmount, setUseCreditAmount] = useState(0);

  const [TotalBalance, setTotalBalance] = useState(0);

  const mode_of_payment = Form.useWatch("mode_of_payment", form);

  React.useEffect(() => {
    setTotalBalance(0);
    let totalBalance = 0;
    SelectedBilling.map((item: SelectedBilling) => {
      totalBalance = totalBalance + Number(item.balance);
    });
    setTotalBalance(totalBalance);
  }, [SelectedBilling]);

  React.useEffect(() => {
    form.setFieldsValue({
      ...form,
      created_at: moment(form?.getFieldValue("created_at")).isValid()
        ? moment(form?.getFieldValue("created_at"))
        : undefined,
    });
  }, [show]);

  let { data: Credit, isLoading: CreditLoading } = useQuery(
    ["credit", patientRecord._id],
    () =>
      fetchData({
        url: `/api/patient/credit/show/${patientRecord._id}`,
      })
  );

  useEffect(() => {
    if (mode_of_payment === "Use Credits") {
      form.setFieldValue("amount", Number(Credit?.amount));
    } else {
      form.setFieldValue("amount", 0);
    }
  }, [mode_of_payment, Credit?.amount]);

  const { mutate: addPayment } = useMutation(
    (payload: any) => {
      return postDataNoFormData({
        url: `/api/patient/payment/${patientRecord?._id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding Payment Success",
          description: `Adding Payment Success`,
        });
        form.resetFields();
        onClose();
        setUseCreditAmount(0);
        setSelectedBilling([]);
        queryClient.invalidateQueries({ queryKey: ["payment"] });
        queryClient.invalidateQueries({ queryKey: ["invoice"] });
        queryClient.invalidateQueries({ queryKey: ["invoice-total"] });
        queryClient.invalidateQueries({ queryKey: ["credit"] });
        queryClient.invalidateQueries({
          queryKey: ["treatment-record"],
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["payment"],
        });
        const previousValues = queryClient.getQueryData(["payment"]);
        queryClient.setQueryData(["payment"], (oldData: any) =>
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
        queryClient.setQueryData(["payment"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["payment"] });
        queryClient.invalidateQueries({ queryKey: ["invoice"] });
      },
    }
  );

  const voidHandler = () => {
    const Payload = {
      billings: SelectedBilling.map((item: SelectedBilling) => item.id),
    };
    voidBilling(Payload);
  };

  const { mutate: voidBilling } = useMutation(
    (payload: any) => {
      return postDataNoFormData({
        url: `/api/patient/invoice/void/${patientRecord?._id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Billing Statement has been voided",
          description: `Billing Deleted`,
        });
        form.resetFields();
        onClose();
        setUseCreditAmount(0);
        setSelectedBilling([]);
        queryClient.invalidateQueries({ queryKey: ["payment"] });
        queryClient.invalidateQueries({ queryKey: ["invoice"] });
        queryClient.invalidateQueries({ queryKey: ["invoice-total"] });
        queryClient.invalidateQueries({ queryKey: ["credit"] });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["invoice"],
        });
        const previousValues = queryClient.getQueryData(["invoice"]);
        queryClient.setQueryData(["invoice"], (oldData: any) =>
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
        queryClient.setQueryData(["invoice"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["payment"] });
        queryClient.invalidateQueries({ queryKey: ["invoice"] });
      },
    }
  );

  return (
    <>
      <Modal
        show={show}
        onClose={() => {
          form.resetFields();
          onClose();

          setUseCreditAmount(0);
        }}
        {...rest}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="font-bold text-3xl">Billing Statement</div>
            <div className="flex justify-end items-center gap-4">
              <Button
                appearance=""
                className="max-w-[10rem] text-primary-500 border border-primary-500 shadow-none"
                type="submit"
                onClick={() =>
                  setAddorUseCreditModal({
                    toggle: true,
                    type: "Add",
                  })
                }
              >
                Add Credits
              </Button>
              {/* <Button
                appearance="primary"
                className="max-w-[10rem]"
                type="submit"
                onClick={() =>
                  setAddorUseCreditModal({
                    toggle: true,
                    type: "Use",
                  })
                }
              >
                Use Credits
              </Button> */}
            </div>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={(values: any) => {
              values.amount = removeNumberFormatting(values.amount);
              values.billings = SelectedBilling.map(
                (item: SelectedBilling) => item.id
              );
              values.credits = useCreditAmount;
              values.total = TotalBalance;
              if (values.billings.length > 1 && values.amount < TotalBalance) {
                notification.warning({
                  message: "Must pay exact price",
                  description:
                    "You must pay exact price if you paying more than one invoice",
                });
                return;
              }

              if (
                values.amount > TotalBalance &&
                values.mode_of_payment !== "Use Credits"
              ) {
                notification.warning({
                  message: "Must pay exact price",
                  description:
                    "You inputted so much amount more than the total balance",
                });
                return;
              }

              addPayment(values);
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
            className=" w-full"
          >
            <ul className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <li className="  space-y-4">
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

                <Form.Item
                  label="Mode of Payment"
                  name="mode_of_payment"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                >
                  <Select
                    placeholder="Select Mode of Payment"
                    id="mode_of_payment"
                  >
                    <Select.Option value={"Cash"}>Cash</Select.Option>
                    <Select.Option value={"Credit Card"}>
                      Credit Card
                    </Select.Option>
                    <Select.Option value={"Debit Card"}>
                      Debit Card
                    </Select.Option>
                    <Select.Option value={"Bank Transfer"}>
                      Bank Transfer
                    </Select.Option>
                    <Select.Option value={"Gcash"}>Gcash</Select.Option>
                    <Select.Option value={"Use Credits"}>
                      Use Credits
                    </Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Amount"
                  name="amount"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                  initialValue={0}
                >
                  <NumericFormat
                    customInput={Input}
                    placeholder="Amount"
                    id="amount"
                    prefix={currency}
                    className=" text-end"
                    thousandSeparator
                    disabled={mode_of_payment === "Use Credits"}
                    isAllowed={({ floatValue }: any) => {
                      return (
                        floatValue <= TotalBalance || floatValue === undefined
                      );
                    }}
                  />
                </Form.Item>
                <Form.Item label="Remarks" name="remarks">
                  <Input id="remarks" placeholder="Remarks" />
                </Form.Item>
              </li>
              <li className="  space-y-4">
                <p className=" text-end">
                  Remaining Credit: {currency}{" "}
                  {Credit?.amount !== undefined
                    ? numberSeparator(Credit?.amount, 0)
                    : 0}
                </p>
                {/* <p className=" text-end">
                  Use Credit:{" "}
                  {Credit?.amount !== undefined &&
                    numberSeparator(useCreditAmount, 0)}
                </p> */}
                <div className="p-8 border border-primary-500 rounded-md space-y-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary-500">
                        <th>Procedure:</th>
                        <th className=" text-end">Charge:</th>
                        <th className=" text-end">Remaining Balance:</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SelectedBilling?.map(
                        (item: SelectedBilling, index: number) => (
                          <tr
                            key={index}
                            className=" border-b border-primary-500"
                          >
                            <td className=" py-3">{item.procedure_name}</td>
                            <td className=" py-3 text-end">
                              {currency} {numberSeparator(item.charge, 0)}
                            </td>
                            <td className=" py-3 text-end">
                              {currency} {numberSeparator(item.balance, 0)}
                            </td>
                          </tr>
                        )
                      )}
                      <tr className="">
                        <td className=" py-3">
                          {" "}
                          <p className=" font-bold">Total Amount</p>
                        </td>
                        <td className=" py-3"></td>
                        <td className=" py-3 text-end">
                          Php {numberSeparator(TotalBalance, 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end items-center gap-4">
                  <Button
                    appearance="link"
                    className="p-4 bg-transparent border-none text-casper-500 font-semibold"
                    onClick={() => {
                      form.resetFields();
                      onClose();

                      setUseCreditAmount(0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    appearance="primary"
                    className="max-w-[10rem]"
                    type="submit"
                  >
                    Pay Now
                  </Button>
                </div>
                <div className="flex justify-end items-center gap-4">
                  <Button
                    appearance="danger"
                    className="max-w-[15rem]"
                    onClick={voidHandler}
                  >
                    Void Billing Statement
                  </Button>
                </div>
              </li>
            </ul>
          </Form>
        </div>
        <AddAndUseCredit
          show={addorUseCreditModal.toggle}
          actionType={addorUseCreditModal.type}
          onCloseSecondModal={() => {
            setAddorUseCreditModal({
              type: "",
              toggle: false,
            });
          }}
          remainingCredit={Credit?.amount}
          className="w-[25rem]"
          id="add-or-use-credit"
          patientRecord={patientRecord}
          setUseCreditAmount={setUseCreditAmount}
          currency={currency}
        />
      </Modal>
    </>
  );
}
