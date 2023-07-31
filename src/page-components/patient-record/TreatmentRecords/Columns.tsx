import { useEffect, useState } from "react";
import { Checkbox } from "antd";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import { paymentStatusPalette } from "@utilities/helpers";

import {
    treatmentRecord,
    SelectedTreatment,
    SelectedBilling,
    Invoice,
} from "./types";

export const RecordColumns = (
    SelectedTreatments: SelectedTreatment[],
    setSelectedTreatments: Function
) => {
    const columns: any = [
        {
            title: "",
            dataIndex: "checkbox",
            render: (_: any, record: treatmentRecord) => (
                <Checkbox
                    checked={SelectedTreatments.some(
                        (someItem) =>
                            someItem.procedure_id === record.procedure_id
                    )}
                    onChange={(e) => {
                        // Handle checkbox change event here
                        if (
                            !SelectedTreatments.some(
                                (someItem) =>
                                    someItem.procedure_id ===
                                    record.procedure_id
                            )
                        ) {
                            setSelectedTreatments([
                                ...SelectedTreatments,
                                {
                                    amount: Number(record.amount),
                                    procedure_name: record.procedure_name,
                                    procedure_id: record.procedure_id,
                                },
                            ]);
                        }
                        if (
                            SelectedTreatments.some(
                                (someItem) =>
                                    someItem.procedure_id ===
                                    record.procedure_id
                            )
                        ) {
                            const fitler = SelectedTreatments.filter(
                                (filter) =>
                                    filter.procedure_id !== record.procedure_id
                            );
                            setSelectedTreatments(fitler);
                        }
                    }}
                />
            ),
            width: "10rem",
            align: "center",
        },
        {
            title: "Date Created",
            dataIndex: "created_at",
            width: "10rem",
            align: "center",
            render: (created_at: Date) =>
                moment(created_at).format("MMMM DD, YYYY"),
        },
        {
            title: "Dentist",
            dataIndex: "doctor_name",
            width: "10rem",
            align: "center",
        },
        {
            title: "Branch",
            dataIndex: "branch_name",
            width: "10rem",
            align: "center",
        },
        {
            title: "Tooth No.",
            dataIndex: "tooth_no",
            width: "10rem",
            align: "center",
        },
        {
            title: "Surface",
            dataIndex: "surface",
            width: "10rem",
            align: "center",
        },
        {
            title: "Procedure",
            dataIndex: "procedure_name",
            width: "10rem",
            align: "center",
        },
        {
            title: "Status",
            dataIndex: "status",
            width: "10rem",
            align: "center",
            render: (status: string) => (
                <div
                    className={twMerge(
                        "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs ",
                        paymentStatusPalette(
                            status === null ? "no payment" : status
                        )
                    )}
                >
                    {status}
                </div>
            ),
        },
    ];
    return columns;
};

export const BillingColumns = (
    SelectedBilling: SelectedBilling[],
    setSelectedBilling: Function
) => {
    const columns: any = [
        {
            title: "",
            dataIndex: "checkbox",
            render: (_: any, record: Invoice) => (
                <Checkbox
                    checked={SelectedBilling.some(
                        (someItem) => someItem.id === record._id
                    )}
                    onChange={(e) => {
                        // Handle checkbox change event here
                        if (
                            !SelectedBilling.some(
                                (someItem) => someItem.id === record._id
                            )
                        ) {
                            setSelectedBilling([
                                ...SelectedBilling,
                                {
                                    id: record._id,
                                    discount: record.discount,
                                },
                            ]);
                        }
                        if (
                            SelectedBilling.some(
                                (someItem) => someItem.id === record._id
                            )
                        ) {
                            const fitler = SelectedBilling.filter(
                                (filter) => filter.id !== record._id
                            );
                            setSelectedBilling(fitler);
                        }
                    }}
                />
            ),
            width: "10rem",
            align: "center",
        },
        {
            title: "Date Created",
            dataIndex: "created_at",
            width: "10rem",
            align: "center",
            render: (created_at: Date) =>
                moment(created_at).format("MMMM DD, YYYY"),
        },
        {
            title: "Branch",
            dataIndex: "branch_name",
            width: "10rem",
            align: "center",
        },
        {
            title: "Procedure",
            dataIndex: "procedure_name",
            width: "10rem",
            align: "center",
        },
        {
            title: "Charge",
            dataIndex: "total",
            width: "10rem",
            align: "center",
        },
        {
            title: "Remaining Balance",
            dataIndex: "pending_balance",
            width: "10rem",
            align: "center",
        },
        {
            title: "Status",
            dataIndex: "status",
            width: "10rem",
            align: "center",
            render: (status: string) => (
                <div
                    className={twMerge(
                        "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs ",
                        paymentStatusPalette(
                            status === null ? "no payment" : status
                        )
                    )}
                >
                    {status}
                </div>
            ),
        },
    ];
    return columns;
};

export const PaymentColumns = () => {
    const columns: any = [
        {
            title: "Payment Date",
            dataIndex: "payment_date",
            width: "10rem",
            align: "center",
            render: (created_at: Date) =>
                moment(created_at).format("MMMM DD, YYYY"),
        },
        {
            title: "Branch",
            dataIndex: "branch_name",
            width: "10rem",
            align: "center",
        },
        {
            title: "Procedure",
            dataIndex: "procedure_name",
            width: "10rem",
            align: "center",
        },
        {
            title: "Payment Method",
            dataIndex: "payment_method",
            width: "10rem",
            align: "center",
        },
        {
            title: "Amount Paid",
            dataIndex: "pending_balance",
            width: "10rem",
            align: "center",
        },
    ];
    return columns;
};
