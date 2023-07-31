import React from "react";
import { Table } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";

export default function TreatmentRecordTable({
    TableColumns,
    Endpoint,
    patientRecord,
    search,
}: {
    TableColumns: any;
    Endpoint: string;
    patientRecord: any;
    search: string;
}) {
    let [page, setPage] = React.useState(1);

    let { data: TableData, isLoading: TableLoading } = useQuery(
        [Endpoint, page, search],
        () =>
            fetchData({
                url: `/api/${Endpoint}/${patientRecord._id}?limit=5&page=${page}&search=${search}`,
            })
    );

    return (
        <>
            <Table
                rowKey="id"
                columns={TableColumns}
                dataSource={TableData?.data}
                showHeader={true}
                loading={TableLoading}
                tableLayout="fixed"
                pagination={{
                    pageSize: 5,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                    total: TableData?.meta?.total,
                    onChange: (page) => setPage(page),
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
                                        tableFlexGrow ? tableFlexGrow : 1
                                    } 1 auto`,
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
                className="[&.ant-table]:!rounded-none"
            />
        </>
    );
}
