import React, { useState } from "react";
import { Form, Table } from "antd";
import moment from "moment";
import { AiOutlineSearch } from "react-icons/ai";
import { Button } from "@components/Button";
import Input from "@components/Input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";




import ChartingModal from "./ChartingModal";




const columns: any = [
  {
    title: "Charting",
    dataIndex: "chart_name",
    width: "10rem",
    align: "center",
  },
  {
    title: "Date Created",
    dataIndex: "created_at",
    width: "10rem",
    align: "center",
    render: (created_at: Date) => moment(created_at).format("MMMM DD, YYYY"),
  },
];

export function Charting({ patientRecord, pageType }: any) {
  const [ChartingForm] = Form.useForm();
  let [page, setPage] = React.useState(1);
  let [search, setSearch] = React.useState("");

  let [isChartingModalOpen, setIsChartingModalOpen] = React.useState(false);

  const [defaultAnnotation, setdefaultAnnotation] = useState([]);

  let { data: charting, isLoading: chartingIsLoading } = useQuery(
    ["charting-list", page, search],
    () =>
      fetchData({
        url: `/api/patient/charting/${patientRecord._id}?limit=5&page=${page}&search=${search}`,
      })
  );


  return (
    <>
      <div className="flex flex-auto">
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={charting?.data}
          showHeader={true}
          tableLayout="fixed"
          loading={chartingIsLoading}
          title={() => (
            <div className="space-y-4 md:p-12 p-6 !pb-0">
              <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
                <h4 className="basis-full md:basis-auto">Charting</h4>
              </div>
              <div className="flex justify-between align-middle gap-4">
                <div className="basis-1/2">
                  <Input
                    placeholder="Search"
                    prefix={
                      <AiOutlineSearch className="text-lg text-casper-500" />
                    }
                    className="rounded-full text-base shadow-none"
                    onChange={(e: any) => setSearch(e.target.value)}
                  />
                </div>
                <div>
                  <Button
                    className="p-3 max-w-xs"
                    appearance="primary"
                    onClick={() => setIsChartingModalOpen(true)}
                  >
                    New Chart
                  </Button>
                </div>
              </div>
            </div>
          )}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            showSizeChanger: false,
            total: charting?.meta?.total,
            onChange: (page) => setPage(page),
          }}
          components={{
            table: ({ ...rest }: any) => {
              let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
              // let tableFlexGrow = 1;
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
                let selectedRow = charting?.data?.find(
                  ({ _id }: any) => _id === rest["data-row-key"]
                );

                return (
                  <tr
                    {...rest}
                    onClick={() => {
                      ChartingForm.setFieldsValue({
                        ...selectedRow,
                        _id: selectedRow._id,
                      });
                      const getProcedures = selectedRow.procedures.map(
                        (itemMap: any) => {
                          return {
                            annotations: itemMap.annotations,
                            tooth_position: itemMap.tooth_position,
                            tooth_no: itemMap.tooth_no,
                          };
                        }
                      );
                      setdefaultAnnotation(getProcedures);

                      setIsChartingModalOpen(true);
                    }}
                  />
                );
              },
            },
          }}
          className="[&.ant-table]:!rounded-none"
        />
      </div>

      <ChartingModal
        show={isChartingModalOpen}
        onClose={() => {
          setIsChartingModalOpen(false);
          ChartingForm.resetFields();
        }}
        className="w-full"
        id="charting-modal"
        patientRecord={patientRecord}
        form={ChartingForm}
        defaultAnnotation={defaultAnnotation}
        pageType={pageType}
      />
    </>
  );
}

export default Charting;
