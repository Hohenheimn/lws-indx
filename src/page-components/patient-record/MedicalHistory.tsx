import { Checkbox, DatePicker, Form, Radio } from "antd";
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

let medications = [
  { label: "Aspirin, Tylenol, Motrin", name: "category_1" },
  {
    label: "Anticoagulants (blood thinners, Cournadin, etc.)",
    name: "category_2",
  },
  { label: "Heart Medication (Nitroglycerin, etc.)", name: "category_3" },
  {
    label: "Antibiotics (Penicillin, Tetracycline, Erythromycin, etc.)",
    name: "category_4",
  },
  { label: "Steroids (Cortisone, Prednisone, etc.)", name: "category_5" },
  { label: "Diabetes Medication (Insulin, Orinase, etc.)", name: "category_6" },
  {
    label: "Narcotics (Codeine, Percodan, Methadone, etc.)",
    name: "category_7",
  },
  {
    label: "Tranquilizers or sleeping pills (Valium, etc.)",
    name: "category_8",
  },
  { label: "Birth Control Pills or Hormonal Therapy", name: "category_9" },
  {
    label: "Recreational Drugs (Cocaine, Marijuana, etc.)",
    name: "category_10",
  },
];

let healthProblem = [
  { label: "Rheumatic Fever", value: "1" },
  { label: "Hormonal Disorder", value: "2" },
  { label: "Diabetes", value: "3" },
  { label: "Stroke", value: "4" },
  { label: "Hepatitis", value: "5" },
  { label: "Tubercolosis", value: "6" },
  { label: "Asthma", value: "7" },
  { label: "Herpes", value: "8" },
  { label: "Venereal Disease", value: "9" },
  { label: "Jaundice", value: "10" },
  { label: "AIDS", value: "11" },
  { label: "Blood Disorders", value: "12" },
  { label: "Anemia", value: "13" },
  { label: "Stomach Ulcer", value: "14" },
  { label: "Bleeding Problems", value: "15" },
  { label: "Arthritis", value: "16" },
  { label: "Kidney Disease", value: "17" },
  { label: "Sinus Problems", value: "18" },
  { label: "Epilepsy", value: "19" },
  { label: "Neurological Problems", value: "20" },
  { label: "Radiation Treatment", value: "21" },
  { label: "Thyroid", value: "22" },
  { label: "Malignancies", value: "23" },
  { label: "Eye Disorder", value: "24" },
  { label: "Tonsilitis", value: "25" },
  { label: "Prostate Problems", value: "26" },
  { label: "Eating Disorders", value: "27" },
  { label: "Rheumatic Heart Disease", value: "28" },
  { label: "Any Heart Ailments", value: "29" },
  { label: "TMJ (Jaw Joint) Problems", value: "30" },
  { label: "High Blood Pressure", value: "31" },
  { label: "Heart Murmur", value: "32" },
];

export function MedicalHistory({ patientRecord }: any) {
  const [MedicalHistoryForm] = Form.useForm();
  return (
    <Card className="flex-auto md:p-12 p-6">
      <Form
        form={MedicalHistoryForm}
        layout="vertical"
        onFinish={(values) => {
          console.log(values);
        }}
        onFinishFailed={(data) => {
          scroller.scrollTo(data?.errorFields[0]?.name[0].toString(), {
            smooth: true,
            offset: -50,
            containerId: "patient-record-container",
          });
        }}
        className="w-full !text-sm"
      >
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
              <h4 className="basis-full md:basis-auto">Medical History</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Name of Physician"
                name="name_of_physician"
                rules={[
                  { required: true, message: "Name of Physician is required" },
                ]}
                required={false}
                className="col-span-12 md:col-span-6"
              >
                <Input id="name_of_physician" placeholder="Name of Physician" />
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
                label="Street"
                name="clinic_street"
                rules={[{ required: true, message: "Street is required" }]}
                required={false}
                className="col-span-12 lg:col-span-8"
              >
                <Input id="clinic_street" placeholder="Add street name" />
              </Form.Item>
              <Form.Item
                label="Barangay"
                name="clinic_barangay"
                rules={[{ required: true, message: "Barangay is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="clinic_barangay" placeholder="Barangay" />
              </Form.Item>
              <Form.Item
                label="City"
                name="clinic_city"
                rules={[{ required: true, message: "City is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select placeholder="Select City" id="clinic_city">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Country"
                name="clinic_country"
                rules={[{ required: true, message: "Country is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select placeholder="Select Country" id="clinic_country">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
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
                There are many situations which can affect or be affected by the
                procedures or drugs for oral surgery. Therefore, please fill out
                the following carefully. Thank you!
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Referred to this Clinic by"
                name="referred_to_clinic"
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
                  id="referred_to_clinic"
                  placeholder="Referred to this Clinic by"
                />
              </Form.Item>
              <Form.Item
                label="Date of the Last Medical Exam"
                name="date_of_the_last_medical_exam"
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
                  id="date_of_the_last_medical_exam"
                  placeholder="Date of the Last Medical Exam"
                />
              </Form.Item>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 text-xl">
            <Form.Item
              label="1. Please list any allergies or sensitivity to any medications or injections."
              name="allergies"
              rules={[
                {
                  required: true,
                  message: "Allergies is required",
                },
              ]}
              required={false}
              className="col-span-12 lg:col-span-8"
            >
              <Input id="allergies" placeholder="Allergies" />
            </Form.Item>
            <Form.Item
              label="What medications are you taking?"
              name="medications"
              rules={[
                {
                  required: true,
                  message: "Medications is required",
                },
              ]}
              required={false}
              className="col-span-12 lg:col-span-8"
            >
              <Input id="medications" placeholder="Medications" />
            </Form.Item>
          </div>
          <Form.Item
            shouldUpdate={(prevValues, curValues) =>
              prevValues.change !== curValues.change
            }
          >
            {({ getFieldValue }) => {
              return (
                <div className="grid grid-cols-12 gap-4 text-xl">
                  <Form.Item
                    label="2. Has there been any change in your health in the last six months?"
                    name="change"
                    rules={[
                      {
                        required: true,
                        message: "Change is required",
                      },
                    ]}
                    required={false}
                    className="col-span-12 lg:col-span-8"
                  >
                    <Radio.Group className="lg:p-4 py-4 space-x-12">
                      <Radio value="1">Yes</Radio>
                      <Radio value="2">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <AnimatePresence mode="wait">
                    {getFieldValue("change") === "1" && (
                      <AnimateContainer
                        variants={fadeIn}
                        className="col-span-12 lg:col-span-8"
                      >
                        <Form.Item
                          label="If yes, please explain"
                          name="change_reason"
                          rules={[
                            {
                              required: true,
                              message: "Medications is required",
                            },
                          ]}
                          required={false}
                        >
                          <Input id="change_reason" placeholder="Medications" />
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
              prevValues.hospitalized !== curValues.hospitalized
            }
          >
            {({ getFieldValue }) => {
              return (
                <div className="grid grid-cols-12 gap-4 text-xl">
                  <Form.Item
                    label="3. Have you ever been hospitalized?"
                    name="hospitalized"
                    rules={[
                      {
                        required: true,
                        message: "Hospitalized is required",
                      },
                    ]}
                    required={false}
                    className="col-span-12 lg:col-span-8"
                  >
                    <Radio.Group className="lg:p-4 py-4 space-x-12">
                      <Radio value="1">Yes</Radio>
                      <Radio value="2">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <AnimatePresence mode="wait">
                    {getFieldValue("hospitalized") === "1" && (
                      <AnimateContainer
                        variants={fadeIn}
                        className="col-span-12 lg:col-span-8"
                      >
                        <Form.Item
                          label="If yes, for what reason?"
                          name="hospitalized_reason"
                          rules={[
                            {
                              required: true,
                              message: "Medications is required",
                            },
                          ]}
                          required={false}
                        >
                          <Input
                            id="hospitalized_reason"
                            placeholder="Medications"
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
              className="col-span-12 lg:col-span-10 mb-0"
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
                      <Radio value="2">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ))}
            </Form.Item>
          </div>
          <div className="grid grid-cols-12 gap-4 text-xl">
            <Form.Item
              label="5. Do you have or have you had any of the following? Indicate with a check."
              name="health_problem_1"
              className="col-span-12 mb-0"
              valuePropName="checked"
            >
              <Checkbox.Group className="grid grid-cols-3 max-lg:grid-cols-1 gap-4 text-xl mt-8">
                {healthProblem.map(({ label, value }, index) => (
                  <Checkbox key={index} value={value}>
                    {label}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </div>
          <div className="grid grid-cols-12 gap-4 text-xl">
            <Form.Item
              label="6. Do you have or have you had any of the following? Indicate with a check."
              name="health_problem_2"
              className="col-span-12 mb-0"
              valuePropName="checked"
            >
              <Checkbox.Group className="grid grid-cols-1 gap-4 text-xl mt-8">
                <Checkbox value={"1"}>Bleeding Problems</Checkbox>
                <Checkbox value={"2"}>Heart Disease</Checkbox>
                <Checkbox value={"3"}>
                  Anesthetic Complications (Problems Going To Sleep For An
                  Operation)
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </div>
          <div className="grid grid-cols-12 gap-4 text-xl">
            <Form.Item
              label="7. Do you Smoke?"
              name="smoking"
              rules={[
                {
                  required: true,
                  message: "Change is required",
                },
              ]}
              required={false}
              className="col-span-12 lg:col-span-8"
            >
              <Radio.Group className="lg:p-4 py-4 space-x-12">
                <Radio value="1">Yes</Radio>
                <Radio value="2">No</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className="grid grid-cols-12 gap-4 text-xl">
            <Form.Item
              label="8. Other Sickness"
              name="other_sickness"
              rules={[
                {
                  required: true,
                  message: "Other Sickness is required",
                },
              ]}
              required={false}
              className="col-span-12 lg:col-span-8"
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
      </Form>
    </Card>
  );
}

export default MedicalHistory;
