import { Checkbox, DatePicker, Form, Radio, notification } from "antd";
import React from "react";
import { scroller } from "react-scroll";
import { AnimateContainer } from "../../components/animation";
import { Button } from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { Select } from "../../components/Select";
import { fadeIn } from "../../components/animation/animation";
import { AnimatePresence } from "framer-motion";
import { NumericFormat } from "react-number-format";
import { getInitialValue, slugify } from "../../../utils/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Context } from "../../../utils/context/Provider";
import { fetchData, postData } from "../../../utils/api";
import { InfiniteSelect } from "../../components/InfiniteSelect";
import moment from "moment";

let medications = [
  { label: "Aspirin, Tylenol, Motrin", name: "medications_injections_1" },
  {
    label: "Anticoagulants (blood thinners, Cournadin, etc.)",
    name: "medications_injections_2",
  },
  {
    label: "Heart Medication (Nitroglycerin, etc.)",
    name: "medications_injections_3",
  },
  {
    label: "Antibiotics (Penicillin, Tetracycline, Erythromycin, etc.)",
    name: "medications_injections_4",
  },
  {
    label: "Steroids (Cortisone, Prednisone, etc.)",
    name: "medications_injections_5",
  },
  {
    label: "Diabetes Medication (Insulin, Orinase, etc.)",
    name: "medications_injections_6",
  },
  {
    label: "Narcotics (Codeine, Percodan, Methadone, etc.)",
    name: "medications_injections_7",
  },
  {
    label: "Tranquilizers or sleeping pills (Valium, etc.)",
    name: "medications_injections_8",
  },
  {
    label: "Birth Control Pills or Hormonal Therapy",
    name: "medications_injections_9",
  },
  {
    label: "Recreational Drugs (Cocaine, Marijuana, etc.)",
    name: "medications_injections_10",
  },
];

let familyDiseaseHistory = [
  "Bleeding Problems",
  "Heart Disease",
  "Anesthetic Complications (Problems Going To Sleep For An Operation)",
];

let healthProblem = [
  "Rheumatic Fever",
  "Hormonal Disorder",
  "Diabetes",
  "Stroke",
  "Hepatitis",
  "Tubercolosis",
  "Asthma",
  "Herpes",
  "Venereal Disease",
  "Jaundice",
  "AIDS",
  "Blood Disorders",
  "Anemia",
  "Stomach Ulcer",
  "Bleeding Problems",
  "Arthritis",
  "Kidney Disease",
  "Sinus Problems",
  "Epilepsy",
  "Neurological Problems",
  "Radiation Treatment",
  "Thyroid",
  "Malignancies",
  "Eye Disorder",
  "Tonsilitis",
  "Prostate Problems",
  "Eating Disorders",
  "Rheumatic Heart Disease",
  "Any Heart Ailments",
  "TMJ (Jaw Joint) Problems",
  "High Blood Pressure",
  "Heart Murmur",
];

export function MedicalHistory({ patientRecord }: any) {
  const [MedicalHistoryForm] = Form.useForm();

  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const { data } = useQuery(
    ["medical-history"],
    () =>
      fetchData({
        url: `/api/patient/medical-history/${patientRecord._id}`,
      }),
    {
      onSuccess: (e) => {
        MedicalHistoryForm.setFieldsValue({
          ...e,
          last_medical_exam_date: moment(e.last_medical_exam_date).isValid()
            ? moment(e.last_medical_exam_date)
            : undefined,
        });
      },
    }
  );

  const { mutate: editMedicalHistory } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/patient/medical-history/${patientRecord._id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Medical History Updated",
          description: `Medical History Updated`,
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["medical-history"] });
        const previousValues = queryClient.getQueryData(["medical-history"]);
        queryClient.setQueryData(["medical-history"], (oldData: any) =>
          oldData ? [oldData, newData] : undefined
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
        queryClient.setQueryData(["medical-history"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["medical-history"] });
      },
    }
  );

  return (
    <Card className="flex-auto md:p-12 p-6">
      <Form
        form={MedicalHistoryForm}
        layout="vertical"
        onFinish={(values) => {
          values.disease_history = JSON.stringify(values.disease_history);
          values.family_disease_history = JSON.stringify(
            values.family_disease_history
          );

          editMedicalHistory(values);
        }}
        onFinishFailed={(data) => {
          scroller.scrollTo(data?.errorFields[0]?.name[0].toString(), {
            smooth: true,
            offset: -50,
            containerId: "main-container",
          });
        }}
        className="w-full !text-sm"
      >
        {data ? (
          <div className="space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
                <h4 className="basis-full md:basis-auto">Medical History</h4>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <Form.Item
                  label="Name of Physician"
                  name="physician_name"
                  rules={[
                    {
                      required: true,
                      message: "Name of Physician is required",
                    },
                  ]}
                  required={false}
                  className="col-span-12 md:col-span-6"
                >
                  <Input id="physician_name" placeholder="Name of Physician" />
                </Form.Item>
                <Form.Item
                  label="Specialty (if Applicable)"
                  name="specialty"
                  required={false}
                  className="col-span-12 md:col-span-6"
                >
                  <Input id="specialty" placeholder="Specialty" />
                </Form.Item>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4>Clinic Address</h4>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <Form.Item
                  label="Country"
                  name="clinic_country"
                  rules={[{ required: true, message: "Country is required" }]}
                  required={false}
                  className="col-span-12 lg:col-span-6"
                >
                  <Select placeholder="Select Country" id="clinic_country">
                    <Select.Option value="Philippines">
                      Philippines
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Region"
                  required={false}
                  className="col-span-12 lg:col-span-6"
                  shouldUpdate={(prev, curr) => {
                    return true;
                  }}
                >
                  {({ getFieldValue, resetFields }) => {
                    return (
                      <Form.Item
                        name="clinic_region"
                        rules={[
                          { required: true, message: "Region is required" },
                        ]}
                      >
                        <InfiniteSelect
                          placeholder="Region"
                          id="clinic_region"
                          api={`${process.env.REACT_APP_API_BASE_URL}/api/location/region?limit=3&for_dropdown=true&page=1`}
                          getInitialValue={{
                            form: MedicalHistoryForm,
                            initialValue: "clinic_region",
                          }}
                          queryKey={[
                            "clinic_region",
                            getFieldValue("clinic_country"),
                          ]}
                          displayValueKey="name"
                          returnValueKey="_id"
                          disabled={Boolean(!getFieldValue("clinic_country"))}
                          onChange={() => {
                            resetFields([
                              "clinic_province",
                              "clinic_city",
                              "clinic_barangay",
                            ]);
                          }}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                <Form.Item
                  label="Province"
                  required={false}
                  className="col-span-12 lg:col-span-4"
                  shouldUpdate={(prev, curr) => {
                    return true;
                  }}
                >
                  {({ getFieldValue, resetFields }) => {
                    return (
                      <Form.Item
                        name="clinic_province"
                        rules={[
                          { required: true, message: "Province is required" },
                        ]}
                      >
                        <InfiniteSelect
                          placeholder="Province"
                          id="clinic_province"
                          api={`${
                            process.env.REACT_APP_API_BASE_URL
                          }/api/location/province?limit=3&for_dropdown=true&page=1&region_code=${getFieldValue(
                            "clinic_region"
                          )}`}
                          getInitialValue={{
                            form: MedicalHistoryForm,
                            initialValue: "clinic_province",
                          }}
                          queryKey={[
                            "clinic_province",
                            getFieldValue("clinic_region"),
                          ]}
                          displayValueKey="name"
                          returnValueKey="_id"
                          disabled={Boolean(!getFieldValue("clinic_region"))}
                          onChange={() => {
                            resetFields(["clinic_city", "clinic_barangay"]);
                          }}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                <Form.Item
                  label="City"
                  required={false}
                  className="col-span-12 lg:col-span-4"
                  shouldUpdate={(prev, curr) => {
                    return true;
                  }}
                >
                  {({ getFieldValue, resetFields }) => {
                    return (
                      <Form.Item
                        name="clinic_city"
                        rules={[
                          { required: true, message: "City is required" },
                        ]}
                      >
                        <InfiniteSelect
                          placeholder="City"
                          id="clinic_city"
                          api={`${
                            process.env.REACT_APP_API_BASE_URL
                          }/api/location/city?limit=3&for_dropdown=true&page=1&region_code=${getFieldValue(
                            "clinic_region"
                          )}&province_code=${getFieldValue("clinic_province")}`}
                          getInitialValue={{
                            form: MedicalHistoryForm,
                            initialValue: "clinic_city",
                          }}
                          queryKey={[
                            "clinic_city",
                            getFieldValue("clinic_province"),
                          ]}
                          displayValueKey="name"
                          returnValueKey="_id"
                          disabled={Boolean(
                            !getFieldValue("clinic_region") ||
                              !getFieldValue("clinic_province")
                          )}
                          onChange={() => {
                            resetFields(["clinic_barangay"]);
                          }}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                <Form.Item
                  label="Barangay"
                  required={false}
                  className="col-span-12 lg:col-span-4"
                  shouldUpdate={(prev, curr) => {
                    return true;
                  }}
                >
                  {({ getFieldValue, resetFields }) => {
                    return (
                      <Form.Item
                        name="clinic_barangay"
                        rules={[
                          { required: true, message: "City is required" },
                        ]}
                      >
                        <InfiniteSelect
                          placeholder="Barangay"
                          id="clinic_barangay"
                          api={`${
                            process.env.REACT_APP_API_BASE_URL
                          }/api/location/barangay?limit=3&for_dropdown=true&page=1&region_code=${getFieldValue(
                            "clinic_region"
                          )}&province_code=${getFieldValue(
                            "clinic_province"
                          )}&city_code=${getFieldValue("clinic_city")}`}
                          getInitialValue={{
                            form: MedicalHistoryForm,
                            initialValue: "clinic_barangay",
                          }}
                          queryKey={[
                            "clinic_barangay",
                            getFieldValue("clinic_city"),
                          ]}
                          displayValueKey="name"
                          returnValueKey="_id"
                          disabled={Boolean(
                            !getFieldValue("clinic_region") ||
                              !getFieldValue("clinic_province") ||
                              !getFieldValue("clinic_city")
                          )}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
                <Form.Item
                  label="Street"
                  name="clinic_street"
                  rules={[{ required: true, message: "Street is required" }]}
                  required={false}
                  className="col-span-12 lg:col-span-8"
                >
                  <Input id="clinic_street" placeholder="Add street name" />
                </Form.Item>
                <Form.Item
                  label="Zip Code"
                  name="clinic_zip_code"
                  rules={[{ required: true, message: "Zip Code is required" }]}
                  required={false}
                  className="col-span-12 lg:col-span-4"
                >
                  <NumericFormat
                    customInput={Input}
                    id="clinic_zip_code"
                    allowNegative={false}
                    placeholder="Zip Code"
                  />
                </Form.Item>
              </div>
            </div>
            <hr />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-xl">
                  There are many situations which can affect or be affected by
                  the procedures or drugs for oral surgery. Therefore, please
                  fill out the following carefully. Thank you!
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <Form.Item
                  label="Referred to this Clinic by"
                  name="referred_by"
                  rules={[
                    {
                      required: true,
                      message: "Referred to this Clinic by is required",
                    },
                  ]}
                  required={false}
                  className="col-span-12 lg:col-span-6"
                >
                  <Input
                    id="referred_by"
                    placeholder="Referred to this Clinic by"
                  />
                </Form.Item>
                <Form.Item
                  label="Date of the Last Medical Exam"
                  name="last_medical_exam_date"
                  rules={[
                    {
                      required: true,
                      message: "Date of the Last Medical Exam is required",
                    },
                  ]}
                  required={false}
                  className="col-span-12 lg:col-span-6"
                >
                  <DatePicker
                    getPopupContainer={(triggerNode: any) => {
                      return triggerNode.parentNode;
                    }}
                    disabledDate={(current) => {
                      return current > moment();
                    }}
                    id="last_medical_exam_date"
                    placeholder="Date of the Last Medical Exam"
                    format="MMMM DD, YYYY"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 text-xl">
              <Form.Item
                label="1. Please list any allergies or sensitivity to any medications or injections."
                name="allergy"
                rules={[
                  {
                    required: true,
                    message: "Allergies is required",
                  },
                ]}
                required={false}
                className="col-span-12"
              >
                <Input id="allergy" placeholder="Allergies" />
              </Form.Item>
              <Form.Item
                label="What medications are you taking?"
                name="medication"
                rules={[
                  {
                    required: true,
                    message: "Medications is required",
                  },
                ]}
                required={false}
                className="col-span-12"
              >
                <Input id="medication" placeholder="Medications" />
              </Form.Item>
            </div>
            <Form.Item
              shouldUpdate={(prevValues, curValues) =>
                prevValues.change_in_health !== curValues.change_in_health
              }
            >
              {({ getFieldValue, resetFields }) => {
                return (
                  <div className="grid grid-cols-12 gap-4 text-xl">
                    <Form.Item
                      label="2. Has there been any change in your health in the last six months?"
                      name="change_in_health"
                      rules={[
                        {
                          required: true,
                          message: "Change is required",
                        },
                      ]}
                      required={false}
                      className="col-span-12"
                    >
                      <Radio.Group
                        className="lg:p-4 py-4 space-x-12"
                        id="change_in_health"
                      >
                        <Radio value="1">Yes</Radio>
                        <Radio value="0">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <AnimatePresence mode="wait">
                      {getFieldValue("change_in_health") === "1" && (
                        <AnimateContainer
                          variants={fadeIn}
                          className="col-span-12"
                        >
                          <Form.Item
                            label="If yes, please explain"
                            name="change_explanation"
                            rules={[
                              {
                                required: true,
                                message: "Explanation is required",
                              },
                            ]}
                            required={false}
                          >
                            <Input
                              id="change_explanation"
                              placeholder="Explanation"
                            />
                          </Form.Item>
                        </AnimateContainer>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }}
            </Form.Item>
            <Form.Item
              shouldUpdate={(prevValues, curValues) =>
                prevValues.been_hospitalized !== curValues.been_hospitalized
              }
            >
              {({ getFieldValue, resetFields }) => {
                return (
                  <div className="grid grid-cols-12 gap-4 text-xl">
                    <Form.Item
                      label="3. Have you ever been hospitalized?"
                      name="been_hospitalized"
                      rules={[
                        {
                          required: true,
                          message: "Hospitalized is required",
                        },
                      ]}
                      required={false}
                      className="col-span-12"
                    >
                      <Radio.Group
                        className="lg:p-4 py-4 space-x-12"
                        id="been_hospitalized"
                      >
                        <Radio value="1">Yes</Radio>
                        <Radio value="0">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <AnimatePresence mode="wait">
                      {getFieldValue("been_hospitalized") === "1" && (
                        <AnimateContainer
                          variants={fadeIn}
                          className="col-span-12"
                        >
                          <Form.Item
                            label="If yes, for what reason?"
                            name="hospitalized_reason"
                            rules={[
                              {
                                required: true,
                                message: "This is required",
                              },
                            ]}
                            required={false}
                          >
                            <Input
                              id="hospitalized_reason"
                              placeholder="Reason"
                            />
                          </Form.Item>
                        </AnimateContainer>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }}
            </Form.Item>
            <div className="grid grid-cols-12 gap-4 text-xl">
              <Form.Item
                label="4. Have you or are you taking any of the following medications or injections?"
                className="col-span-12 mb-0"
              >
                {medications.map(({ label, name }, index) => (
                  <div
                    className="grid grid-cols-2 max-lg:grid-cols-1 gap-4 mt-8"
                    key={index}
                  >
                    <span>{label}</span>
                    <Form.Item
                      name={name}
                      rules={[
                        {
                          required: true,
                          message: "Medication is required",
                        },
                      ]}
                      required={false}
                      className="lg:justify-self-end"
                    >
                      <Radio.Group className="space-x-12">
                        <Radio value="1">Yes</Radio>
                        <Radio value="0">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                ))}
              </Form.Item>
            </div>
            <div
              className="grid grid-cols-12 gap-4 text-xl"
              id="disease_history"
            >
              <Form.Item
                label="5. Do you have or have you had any of the following? Indicate with a check."
                name="disease_history"
                className="col-span-12 mb-0"
              >
                <Checkbox.Group className="grid grid-cols-3 max-lg:grid-cols-1 gap-4 text-xl mt-8">
                  {healthProblem.map((health, index) => {
                    return (
                      <Checkbox key={index} value={slugify(health)}>
                        {health}
                      </Checkbox>
                    );
                  })}
                </Checkbox.Group>
              </Form.Item>
            </div>
            <div className="grid grid-cols-12 gap-4 text-xl">
              <Form.Item
                label="6. Do you have or have you had any of the following? Indicate with a check."
                name="family_disease_history"
                className="col-span-12 mb-0"
              >
                <Checkbox.Group className="grid grid-cols-1 gap-4 text-xl mt-8">
                  {familyDiseaseHistory.map((disease, index) => {
                    return (
                      <Checkbox value={slugify(disease)} key={index}>
                        {disease}
                      </Checkbox>
                    );
                  })}
                </Checkbox.Group>
              </Form.Item>
            </div>
            <div className="grid grid-cols-12 gap-4 text-xl">
              <Form.Item
                label="7. Do you Smoke?"
                name="is_smoking"
                rules={[
                  {
                    required: true,
                    message: "Change is required",
                  },
                ]}
                required={false}
                className="col-span-12"
              >
                <Radio.Group className="lg:p-4 py-4 space-x-12" id="is_smoking">
                  <Radio value="1">Yes</Radio>
                  <Radio value="0">No</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="grid grid-cols-12 gap-4 text-xl">
              <Form.Item
                label="8. Other Sickness"
                name="other_sickness"
                // rules={[
                //   {
                //     required: true,
                //     message: "Other Sickness is required",
                //   },
                // ]}
                required={false}
                className="col-span-12"
              >
                <Input id="other_sickness" placeholder="Other Sickness" />
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
        ) : (
          <h4>Fetching Information</h4>
        )}
      </Form>
    </Card>
  );
}

export default MedicalHistory;
