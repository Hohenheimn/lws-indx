import { Checkbox, DatePicker, Form, notification } from "antd";
import React from "react";
import { scroller } from "react-scroll";
import { Button } from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { Select } from "../../components/Select";
import { fetchData, postData } from "../../../utils/api";
import { InfiniteSelect } from "../../components/InfiniteSelect";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Context } from "../../../utils/context/Provider";
import moment from "moment";

export function DentalHistory({ patientRecord, tab }: any) {
  const queryClient = useQueryClient();
  const [DentalHistoryForm] = Form.useForm();

  useQuery(
    ["dental-history"],
    () =>
      fetchData({
        url: `/api/patient/dental-history/${patientRecord._id}`,
      }),
    {
      onSuccess: (res) => {
        res.last_visit_date = moment(res.last_visit_date, "MMMM DD, YYYY");
        DentalHistoryForm.setFieldsValue(res);
      },
    }
  );

  const { mutate: addDentalHistory, isLoading } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/patient/dental-history/${patientRecord._id}`,
        payload,
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Updated Dental History",
          description: `Updated Dental History`,
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["dental-history"] });
        const previousValues = queryClient.getQueryData(["dental-history"]);
        queryClient.setQueryData(["dental-history"], (oldData: any) => {
          return oldData ? [oldData, newData] : [];
        });

        return { previousValues };
      },
      onError: (err: any, _, context: any) => {
        notification.warning({
          message: "Something Went Wrong",
          description: `${
            err.response.data[Object.keys(err.response.data)[0]]
          }`,
        });
        queryClient.setQueryData(["dental-history"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["dental-history"] });
      },
    }
  );

  return (
    <Card className="flex-auto md:p-12 p-6">
      <Form
        form={DentalHistoryForm}
        layout="vertical"
        onFinish={(values) => {
          values.last_visit_date = moment(values.last_visit_date).format(
            "MMMM DD, YYYY"
          );
          values.dental_issues = JSON.stringify(values.dental_issues);

          addDentalHistory(values);
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
                name="last_visit_date"
                rules={[
                  { required: true, message: "Last Dentist Visit is required" },
                ]}
                required={false}
                className="col-span-12 md:col-span-6"
              >
                <DatePicker
                  id="last_visit_date"
                  placeholder="Last Dentist Visit"
                  format="MMMM DD, YYYY"
                />
              </Form.Item>
              <Form.Item
                label="Reason for Last Visit"
                name="last_visit_reason"
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
                  id="last_visit_reason"
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
          <div className="space-y-4" id="dental_issues">
            <div className="flex justify-between items-center">
              <h4>Do you have any of the following?</h4>
            </div>
            <Form.Item
              name="dental_issues"
              required={false}
              className="col-span-full text-base"
            >
              <Checkbox.Group className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center py-4 lg:px-[10%] text-lg">
                <Checkbox value="bad_breath">Bad Breath</Checkbox>
                <Checkbox value="food_collection_between_teeth">
                  Food Collection between Teeth
                </Checkbox>
                <Checkbox value="clicking_or_lock_jaw">
                  Clicking or Lock Jaw
                </Checkbox>
                <Checkbox value="loose_teeth_or_broken_fillings">
                  Loose Teeth or Broken Fillings
                </Checkbox>
                <Checkbox value="grinding_teeth">Grinding Teeth</Checkbox>
                <Checkbox value="sensitivity_to_hot_water">
                  Sensitivity to Hot Water
                </Checkbox>
                <Checkbox value="periodental_treatment">
                  Periodental Treatment
                </Checkbox>
                <Checkbox value="sensitivity_to_sweets">
                  Sensitivity to Sweets
                </Checkbox>
                <Checkbox value="sensitivity_to_cold_water">
                  Sensitivity to Cold Water
                </Checkbox>
                <Checkbox value="sores_or_growth_in_your_mouth">
                  Sores Or Growth In Your Mouth
                </Checkbox>
                <Checkbox value="sensitivity_when_biting">
                  Sensitivity when Biting
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </div>
          <div className="flex justify-center items-center">
            <Button
              appearance={!isLoading ? "primary" : "disabled"}
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
