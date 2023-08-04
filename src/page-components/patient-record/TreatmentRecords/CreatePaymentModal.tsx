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

    const amount = Form.useWatch("amount", form);

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
                        <div className="font-bold text-3xl">Create Payment</div>
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
                            <Button
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
                            </Button>
                        </div>
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={(values: any) => {
                            values.amount = removeNumberFormatting(
                                values.amount
                            );
                            values.billings = SelectedBilling.map(
                                (item: SelectedBilling) => item.id
                            );
                            values.credits = useCreditAmount;
                            values.total = TotalBalance;
                            addPayment(values);
                        }}
                        onFinishFailed={(data) => {
                            scroller.scrollTo(
                                data?.errorFields[0]?.name
                                    ?.join("-")
                                    ?.toString(),
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
                                        getPopupContainer={(
                                            triggerNode: any
                                        ) => {
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
                                        <Select.Option
                                            value={"Cash on Deliver"}
                                        >
                                            Cash on Deliver
                                        </Select.Option>

                                        <Select.Option value={"E-Payment"}>
                                            E-Payment
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
                                        prefix="₱"
                                        thousandSeparator
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Remarks"
                                    name="remarks"
                                    rules={[
                                        {
                                            required: true,
                                            message: "This is required!",
                                        },
                                    ]}
                                    required={false}
                                >
                                    <Input id="remarks" placeholder="Remarks" />
                                </Form.Item>
                            </li>
                            <li className="  space-y-4">
                                <p className=" text-end">
                                    Remaining Credit:{" "}
                                    {Credit?.amount !== undefined &&
                                        numberSeparator(Credit?.amount, 0)}
                                </p>
                                <p className=" text-end">
                                    Use Credit:{" "}
                                    {Credit?.amount !== undefined &&
                                        numberSeparator(useCreditAmount, 0)}
                                </p>
                                <div className="p-8 border border-primary-500 rounded-md space-y-4">
                                    <ul className=" space-y-4">
                                        <li className=" pb-2 border-b border-primary-500 flex justify-between">
                                            <p>Procedure:</p>
                                            <p className="pr-4">Charge:</p>
                                        </li>
                                        {SelectedBilling?.map(
                                            (
                                                item: SelectedBilling,
                                                index: number
                                            ) => (
                                                <li
                                                    key={index}
                                                    className=" pb-2 border-b border-primary-500 flex justify-between"
                                                >
                                                    <p>{item.procedure_name}</p>
                                                    <p className="pr-4">
                                                        Php{" "}
                                                        {numberSeparator(
                                                            item.balance,
                                                            0
                                                        )}
                                                    </p>
                                                </li>
                                            )
                                        )}

                                        <li className=" pb-2 flex justify-between">
                                            <p className=" font-bold">
                                                Total Amount
                                            </p>
                                            <p className="pr-4">
                                                Php{" "}
                                                {numberSeparator(
                                                    TotalBalance,
                                                    0
                                                )}
                                            </p>
                                        </li>
                                    </ul>
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
                />
            </Modal>
        </>
    );
}
