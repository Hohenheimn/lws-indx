import React, { useEffect, useState } from "react";
import {
  Checkbox,
  DatePicker,
  Form,
  Radio,
  Table,
  TimePicker,
  notification,
} from "antd";
import { Select } from "antd";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, postData, postDataNoFormData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import {
  getInitialValue,
  numberSeparator,
  removeNumberFormatting,
} from "@utilities/helpers";

import { SelectedTreatment } from "./types";

export default function CreateBillingStatementModal({
  show,
  onClose,
  patientRecord,
  SelectedTreatments,
  setSelectedTreatments,
  currency,
  ...rest
}: any) {
  const columns: any = [
    {
      title: "Procedure",
      dataIndex: "procedure_name",
      width: "10rem",
      align: "center",
      render: (_: string, record: SelectedTreatment) => {
        return (
          <div>
            {`(${record?.quantity}x)`} {record?.procedure_name}
          </div>
        );
      },
    },
    {
      title: "Charge",
      dataIndex: "amount",
      width: "10rem",
      align: "center",
      render: (amount: number) => {
        if (amount) {
          return `${currency} ${numberSeparator(amount, 0)}`;
        }
      },
    },
  ];
  const [form] = Form.useForm();

  const [Treatments, setTreatments] = useState(SelectedTreatments);

  const vatInclusive = Form.useWatch("vat_inclusive", form);
  const seniorPwdDiscount = Form.useWatch("senior_pwd_discount", form);

  const enterDiscount = Form.useWatch("discount", form);

  const type_discount = Form.useWatch("discount_type", form);

  const queryClient = useQueryClient();

  const { setIsAppLoading } = React.useContext(Context);

  const [isProcedureTotal, setProcedureTotal] = useState(0);

  const [isAVatInclusive, setVatInclusive] = useState(0);

  const [senior_discount, setSenior_discount] = useState(0);

  const [discountAmount, setDiscountAmount] = useState(0);

  React.useEffect(() => {
    setTreatments(SelectedTreatments);
  }, [SelectedTreatments]);

  React.useEffect(() => {
    setProcedureTotal(0);
    setVatInclusive(0);
    setSenior_discount(0);
    setDiscountAmount(0);
    let total = 0;
    Treatments.map((item: SelectedTreatment) => {
      total = total + Number(item.amount);
    });
    let senior_discount = total * 0.2; // 20%
    let senior_discount_value = 0;
    let vat_inclusive = total - total / 1.12;
    let vat_inclusive_value = 0;
    let discounted = 0;

    if (seniorPwdDiscount?.includes("Senior Citizen Discount")) {
      senior_discount_value = senior_discount;
      setSenior_discount(senior_discount);
    }
    if (type_discount === "Amount") {
      discounted = Number(removeNumberFormatting(enterDiscount));
      setDiscountAmount(discounted);
    }
    if (type_discount === "Percent") {
      const getPercentage = Number(removeNumberFormatting(enterDiscount)) / 100;
      discounted = total * getPercentage;
      setDiscountAmount(discounted);
    }
    if (vatInclusive?.includes("VAT")) {
      vat_inclusive_value = vat_inclusive;
      setVatInclusive(vat_inclusive);
    }
    total = total - senior_discount_value - discounted + vat_inclusive_value;
    setProcedureTotal(total);
  }, [
    Treatments,
    seniorPwdDiscount,
    vatInclusive,
    enterDiscount,
    type_discount,
  ]);

  React.useEffect(() => {
    form.setFieldsValue({
      ...form,
      created_at: moment(form?.getFieldValue("created_at")).isValid()
        ? moment(form?.getFieldValue("created_at"))
        : undefined,
    });
  }, [show]);

  const { mutate: addInvoice } = useMutation(
    (payload: any) => {
      return postDataNoFormData({
        url: `/api/patient/invoice/${patientRecord?._id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Applied Billing Invoice Success",
          description: `Applied Billing Invoice Success`,
        });
        queryClient.invalidateQueries({
          queryKey: ["invoice"],
        });
        queryClient.invalidateQueries({
          queryKey: ["invoice-total"],
        });
        queryClient.invalidateQueries({
          queryKey: ["treatment-record"],
        });
        form.resetFields();
        setSelectedTreatments([]);
        onClose();
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
        queryClient.invalidateQueries({
          queryKey: ["invoice"],
        });
      },
    }
  );

  return (
    <Modal
      show={show}
      onClose={() => {
        form.resetFields();
        onClose();
      }}
      {...rest}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">Create Billing Statement</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values: any) => {
            values.discount = removeNumberFormatting(values.discount);
            values.total = isProcedureTotal.toFixed(2);
            values.vat_exclusive = isAVatInclusive > 0 ? true : false;
            values.vat = Number(isAVatInclusive.toFixed(2));
            values.senior_discount = senior_discount > 0 ? true : false;
            values.treatments = Treatments.map((item: SelectedTreatment) => {
              return {
                treatment_id: item.treatment_id,
              };
            });
            delete values.vat_and_discount;

            addInvoice(values);
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
          className=" w-full space-y-8"
        >
          <Form.Item label="Date Created" name="created_at" required={false}>
            <DatePicker
              getPopupContainer={(triggerNode: any) => {
                return triggerNode.parentNode;
              }}
              placeholder="Date Created"
              disabled={true}
              format="MMMM DD, YYYY"
            />
          </Form.Item>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={Treatments}
            showHeader={true}
            tableLayout="fixed"
            bordered
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true,
              showSizeChanger: false,
            }}
            components={{
              table: ({ ...rest }: any) => {
                // let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
                let tableFlexGrow = 1;
                return (
                  <table
                    {...rest}
                    style={{
                      flex: `${tableFlexGrow ? tableFlexGrow : 1} 1 auto`,
                    }}
                  />
                );
              },
              body: {
                row: ({ ...rest }: any) => {
                  return <tr {...rest} />;
                },
              },
            }}
          />
          <div>
            <h4>Deductions</h4>
            <Form.Item
              name="senior_pwd_discount"
              required={false}
              className="text-base"
              initialValue={[]}
            >
              <Checkbox.Group className="grid grid-cols-1 gap-1 justify-center text-lg">
                <Checkbox value="Senior Citizen Discount">
                  Senior Citizen / PWD Discount
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </div>
          <div>
            <p className="mb-1">Choose Type of Discount</p>
            <Form.Item
              name="discount_type"
              required={false}
              className="text-base"
              initialValue={""}
            >
              <Radio.Group
                id="discount_type"
                className="grid grid-cols-1 gap-1 text-lg"
              >
                <Radio value="Amount">Amount Discount</Radio>
                <Radio value="Percent">Percent Discount</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item
            name="discount"
            required={false}
            className="text-base"
            initialValue={0}
          >
            <NumericFormat
              disabled={!type_discount}
              customInput={Input}
              placeholder={
                type_discount === "Amount"
                  ? "Enter discount amount"
                  : "Enter discount percentage"
              }
              className=" text-end"
              id="discount"
              prefix={type_discount === "Amount" ? currency : ""}
              suffix={type_discount === "Percent" ? "%" : ""}
              thousandSeparator
              isAllowed={({ floatValue }: any) => {
                if (type_discount === "Percent") {
                  return floatValue <= 99 || floatValue === undefined;
                } else {
                  return (
                    floatValue <= isProcedureTotal || floatValue === undefined
                  );
                }
              }}
            />
          </Form.Item>
          <Form.Item
            name="vat_inclusive"
            required={false}
            className="text-base"
            initialValue={[]}
          >
            <Checkbox.Group className="grid grid-cols-1 gap-1 justify-center text-lg">
              <Checkbox value="VAT">VAT Inclusive</Checkbox>
            </Checkbox.Group>
          </Form.Item>
          <div className=" border-t-2 border-gray-300 space-y-2 pt-5">
            {senior_discount > 0 && (
              <div className="flex justify-end">
                <p className=" text-lg text-gray-400">
                  Senior Discount (20%): - {currency}{" "}
                  {numberSeparator(senior_discount, 0)}
                </p>
              </div>
            )}
            {discountAmount > 0 && (
              <div className="flex justify-end">
                <p className=" text-lg text-gray-400">
                  Entered Discount: -{currency}{" "}
                  {numberSeparator(discountAmount, 0)}
                </p>
              </div>
            )}
            {isAVatInclusive > 0 && (
              <div className="flex justify-end">
                <p className=" text-lg text-gray-400">
                  VAT Inclusive (12% of Total Charge): + {currency}{" "}
                  {numberSeparator(isAVatInclusive, 0)}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <h4>
                Total: {currency} {numberSeparator(isProcedureTotal, 0)}
              </h4>
            </div>
          </div>

          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => {
                form.resetFields();
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
