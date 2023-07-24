import React, { useState } from "react";
import { Checkbox, DatePicker, Form, Popover, Table, notification } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { scroller } from "react-scroll";
import { twMerge } from "tailwind-merge";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Select } from "@components/Select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "@utilities/api";
import { numberSeparator, paymentStatusPalette } from "@utilities/helpers";

import { NextPageProps } from "@utilities/types/NextPageProps";

import AddTreatmentRecordModal from "./AddTreatmentRecordModal";

let fakeData = [
    {
        id: 1,
        invoice_number: "Inv-001",
        date_created: "01/02/2022",
        total_amount: 1000,
        mode_of_payment: "GCash",
        payment_status: "pending",
    },
    {
        id: 2,
        invoice_number: "Inv-002",
        date_created: "01/02/2022",
        total_amount: 1000,
        mode_of_payment: "GCash",
        payment_status: "partial payment",
    },
    {
        id: 3,
        invoice_number: "Inv-003",
        date_created: "01/02/2022",
        total_amount: 1000,
        mode_of_payment: "GCash",
        payment_status: "pending",
    },
    {
        id: 4,
        invoice_number: "Inv-004",
        date_created: "01/02/2022",
        total_amount: 1000,
        mode_of_payment: "GCash",
        payment_status: "paid",
    },
    {
        id: 5,
        invoice_number: "Inv-005",
        date_created: "01/02/2022",
        total_amount: 1000,
        mode_of_payment: "GCash",
        payment_status: "pending",
    },
];

const columns: any = [
    {
        title: "",
        dataIndex: "checkbox",
        render: (_: any, record: any) => (
            <Checkbox
                onChange={(e) => {
                    // Handle checkbox change event here
                    console.log(e.target.checked, record);
                }}
            />
        ),
        width: "10rem",
        align: "center",
    },
    {
        title: "Invoice Number",
        dataIndex: "invoice_number",
        width: "10rem",
        align: "center",
    },
    {
        title: "Date Created",
        dataIndex: "date_created",
        width: "10rem",
        align: "center",
    },
    {
        title: "Amount",
        dataIndex: "total_amount",
        width: "10rem",
        align: "center",
    },
    {
        title: "Mode of Payment",
        dataIndex: "mode_of_payment",
        width: "10rem",
        align: "center",
    },
    {
        title: "Payment Status",
        dataIndex: "payment_status",
        width: "10rem",
        align: "center",
        render: (status: string) => (
            <div
                className={twMerge(
                    "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs",
                    paymentStatusPalette(status)
                )}
            >
                {status}
            </div>
        ),
    },
];

export function TreatmentRecords({ patientRecord }: any) {
    const [TreatmentRecordForm] = Form.useForm();

    let [
        isTreatmentRecordModalOpen,
        setIsTreatmentRecordModalOpen,
    ] = React.useState(false);

    const tabs = ["Records", "Billings", "Payments"];

    const [isTabActive, setTabActive] = useState("Records");

    const [SelectedIDs, setSelectedIDs] = useState<number[]>([]);

    let [search, setSearch] = React.useState("");

    let [page, setPage] = React.useState(1);

    const queryClient = useQueryClient();

    let { data: treatmentPlan, isLoading: treatmentPlanIsLoading } = useQuery(
        ["treatment-record", page, search],
        () =>
            fetchData({
                url: `/api/patient/treatment-record/${patientRecord._id}?limit=5&page=${page}&search=${search}`,
            })
    );

    const { mutate: deleteTreatmentRecord }: any = useMutation(
        (treatment_plan_id: number) =>
            deleteData({
                url: `/api/patient/treatment-plan/${treatment_plan_id}`,
            }),
        {
            onSuccess: async (res) => {
                notification.success({
                    message: "Treatment Record Deleted",
                    description: "Treatment Record has been deleted",
                });
            },
            onMutate: async (newData) => {
                await queryClient.cancelQueries({
                    queryKey: ["treatment-record"],
                });
                const previousValues = queryClient.getQueryData([
                    "treatment-record",
                ]);
                queryClient.setQueryData(["treatment-record"], (oldData: any) =>
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
                queryClient.setQueryData(
                    ["treatment-record"],
                    context.previousValues
                );
            },
            onSettled: async () => {
                queryClient.invalidateQueries({
                    queryKey: ["treatment-record"],
                });
            },
        }
    );

    return (
        <>
            <div className=" flex justify-start">
                <Card className="px-8 py-4 mb-5 bg-primary-500">
                    <p className="text-white">Current Remaining Balance</p>
                    <h1 className="text-white my-1">
                        P {numberSeparator(100000, 0)}
                    </h1>
                    <h5 className="text-white text-lg cursor-pointer font-semibold border-b border-white inline">
                        Pay Certain Amount
                    </h5>
                </Card>
            </div>
            <Card className="flex-auto p-0">
                <div className="space-y-8 h-full flex flex-col">
                    <div className="space-y-4 md:p-12 p-6 !pb-0">
                        <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
                            <h4 className="basis-full md:basis-auto">
                                Treatment Records
                            </h4>
                        </div>
                        <div className="flex justify-between w-full">
                            <div>
                                <Input
                                    placeholder="Search"
                                    prefix={
                                        <AiOutlineSearch className="text-lg text-casper-500" />
                                    }
                                    className="rounded-full text-base shadow-none"
                                    onChange={(e: any) =>
                                        setSearch(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Button
                                    className="p-3 max-w-xs"
                                    appearance="primary"
                                    onClick={() => {
                                        setIsTreatmentRecordModalOpen(true);
                                    }}
                                >
                                    Create New Treatment
                                </Button>
                            </div>
                        </div>
                    </div>

                    <ul className="flex flex-auto md:px-12 px-6">
                        {tabs.map((row, index) => (
                            <li
                                key={index}
                                className={`cursor-pointer mr-5 ${row ===
                                    isTabActive &&
                                    " text-primary-500 border-b border-primary-500"}`}
                                onClick={() => setTabActive(row)}
                            >
                                {row}
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-auto">
                        <Table
                            rowKey="id"
                            columns={columns}
                            dataSource={fakeData}
                            showHeader={true}
                            tableLayout="fixed"
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
                                                flex: `${
                                                    tableFlexGrow
                                                        ? tableFlexGrow
                                                        : 1
                                                } 1 auto`,
                                            }}
                                        />
                                    );
                                },
                                body: {
                                    row: ({ ...rest }: any) => {
                                        let selectedRow: any = fakeData?.find(
                                            ({ _id }: any) =>
                                                _id === rest["data-row-key"]
                                        );
                                        return (
                                            <Popover
                                                placement="bottom"
                                                showArrow={false}
                                                content={
                                                    <div className="grid grid-cols-1 gap-2">
                                                        <Button
                                                            appearance="link"
                                                            className="text-casper-500 p-2"
                                                            onClick={() => {
                                                                TreatmentRecordForm.setFieldsValue(
                                                                    {
                                                                        ...selectedRow,
                                                                        _id:
                                                                            selectedRow.id,
                                                                    }
                                                                );

                                                                setIsTreatmentRecordModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <BsPencilSquare className="text-base" />
                                                                <div>Edit</div>
                                                            </div>
                                                        </Button>
                                                        <Button
                                                            appearance="link"
                                                            className="text-casper-500 p-2"
                                                            onClick={() =>
                                                                deleteTreatmentRecord(
                                                                    rest[
                                                                        "data-row-key"
                                                                    ]
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <BsTrashFill className="text-base" />
                                                                <div>
                                                                    Delete
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    </div>
                                                }
                                                trigger="click"
                                            >
                                                <tr {...rest} />
                                            </Popover>
                                        );
                                    },
                                },
                            }}
                            className="[&.ant-table]:!rounded-none"
                        />
                    </div>
                </div>
            </Card>
            <AddTreatmentRecordModal
                show={isTreatmentRecordModalOpen}
                onClose={() => {
                    setIsTreatmentRecordModalOpen(false);
                    TreatmentRecordForm.resetFields();
                }}
                className="w-[75rem]"
                id="treatment-record-modal"
                patientRecord={patientRecord}
                form={TreatmentRecordForm}
            />
        </>
    );
}

export default TreatmentRecords;
