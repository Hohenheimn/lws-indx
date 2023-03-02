import { Checkbox, DatePicker, Form } from "antd";
import React from "react";
import { scroller } from "react-scroll";
import { Button } from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { Select } from "../../components/Select";
import { fetchData } from "../../../utils/api";
import { useQuery } from "@tanstack/react-query";
import { InfiniteSelect } from "../../components/InfiniteSelect";

export function DentalHistory({ patientRecord }: any) {
  const [DentalHistoryForm] = Form.useForm();

  const { data: dentalHistory, isFetching: isDentalHistoryLoading } = useQuery(
    ["patient", patientRecord],
    () =>
      fetchData({
        url: `/api/patient/dental-history/${patientRecord._id}`,
      }),
    {
      onSuccess: (res) => {
        DentalHistoryForm.setFieldsValue(res);
      },
    }
  );

  return (
    <Card className="flex-auto md:p-12 p-6">
      <Form
        form={DentalHistoryForm}
        layout="vertical"
        onFinish={(values) => {
          console.log(values);
        }}
        onFinishFailed={(data) => {
          console.log(data?.errorFields[0]);
          scroller.scrollTo(data?.errorFields[0]?.name[0].toString(), {
            smooth: true,
            offset: -50,
            containerId: "main-container",
          });
        }}
        className="w-full !text-sm"
      >
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
              <h4 className="basis-full md:basis-auto">Dental History</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Previous Dentist"
                name="previous_dentist"
                rules={[
                  { required: true, message: "Previous Dentist is required" },
                ]}
                required={false}
                className="col-span-12 md:col-span-6"
              >
                <Input id="previous_dentist" placeholder="Previous Dentist" />
              </Form.Item>
              <Form.Item
                label="Last Dentist Visit"
                name="last_dentist_visit"
                rules={[
                  { required: true, message: "Last Dentist Visit is required" },
                ]}
                required={false}
                className="col-span-12 md:col-span-6"
              >
                <DatePicker
                  id="last_dentist_visit"
                  placeholder="Last Dentist Visit"
                />
              </Form.Item>
              <Form.Item
                label="Reason for Last Visit"
                name="reason_for_visit"
                rules={[
                  {
                    required: true,
                    message: "Reason for Last Visit is required",
                  },
                ]}
                required={false}
                className="col-span-12"
              >
                <InfiniteSelect
                  placeholder="Select Reason for Visit"
                  id="reason_for_visit"
                  api={`${process.env.REACT_APP_API_BASE_URL}/api/procedure?limit=3&for_dropdown=true&page=1`}
                  queryKey={["procedure"]}
                  displayValueKey="name"
                  returnValueKey="_id"
                />
              </Form.Item>
              <Form.Item
                label="Chief Complaint"
                name="chief_complaint"
                rules={[
                  {
                    required: true,
                    message: "Chief Complaint is required",
                  },
                ]}
                required={false}
                className="col-span-12"
              >
                <Input id="chief_complaint" placeholder="Chief Complaint" />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Do you have any of the following?</h4>
            </div>
            <Form.Item
              name="concern"
              valuePropName="checked"
              required={false}
              className="col-span-full text-base"
            >
              <Checkbox.Group className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center py-4 lg:px-[10%] text-lg">
                <Checkbox value="1">Bad Breath</Checkbox>
                <Checkbox value="2">Food Collection between Teeth</Checkbox>
                <Checkbox value="3">Clicking or Lock Jaw</Checkbox>
                <Checkbox value="4">Loose Teeth or Broken Fillings</Checkbox>
                <Checkbox value="5">Grinding Teeth</Checkbox>
                <Checkbox value="6">Sensitivity to Hot Water</Checkbox>
                <Checkbox value="7">Periodental Treatment</Checkbox>
                <Checkbox value="8">Sensitivity to Sweets</Checkbox>
                <Checkbox value="9">Sensitivity to Cold Water</Checkbox>
                <Checkbox value="10">Sores Or Growth In Your Mouth</Checkbox>
                <Checkbox value="11">Sensitivity when Biting</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </div>
          <div className="flex justify-center items-center">
            <Button
              appearance="primary"
              type="submit"
              className="max-w-md py-4"
            >
              Save
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
}

export default DentalHistory;
