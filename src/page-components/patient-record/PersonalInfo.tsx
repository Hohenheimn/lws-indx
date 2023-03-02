import { Checkbox, DatePicker, Form } from "antd";
import React from "react";
import { scroller } from "react-scroll";
import { Button } from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { Select } from "../../components/Select";
import { differenceInYears, parse } from "date-fns";
import gender from "../../../utils/global-data/gender";
import moment from "moment";
import { NumericFormat } from "react-number-format";

export function PersonalInfo({ patientRecord }: any) {
  const [PersonalInfoForm] = Form.useForm();

  React.useEffect(() => {
    PersonalInfoForm.setFieldsValue({
      ...patientRecord,
      birthdate: moment(patientRecord?.birthdate, "MM-DD-YYYY"),
      age: differenceInYears(new Date(), new Date(patientRecord?.birthdate)),
    });
  });

  return (
    <Card className="flex-auto">
      <Form
        form={PersonalInfoForm}
        layout="vertical"
        onFinish={(values) => {
          console.log(values);
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
        <div className="space-y-12">
          <div className="space-y-4">
            <div className="grid grid-cols-12 justify-between items-center gap-4">
              <h4 className="col-span-12 lg:col-span-8">Personal Info</h4>
              <Form.Item
                label="Entry Date"
                name="entry_date"
                rules={[{ required: true, message: "Entry Date is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <DatePicker id="entry_date" placeholder="Entry Date" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="First Name"
                name="first_name"
                rules={[{ required: true, message: "First Name is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="first_name" placeholder="First Name" />
              </Form.Item>
              <Form.Item
                label="Middle Name"
                name="middle_name"
                rules={[{ required: true, message: "Middle Name is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="middle_name" placeholder="Middle Name" />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="last_name"
                rules={[{ required: true, message: "Last Name is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="last_name" placeholder="Last Name" />
              </Form.Item>
              <Form.Item
                label="Birthdate"
                name="birthdate"
                className="col-span-12 lg:col-span-8"
              >
                <DatePicker
                  placeholder="Birthdate"
                  id="birthdate"
                  format="MMMM DD, YYYY"
                  onChange={(dob, dobString) => {
                    const date = parse(dobString, "MMMM dd, yyyy", new Date());

                    PersonalInfoForm.setFieldsValue({
                      age: differenceInYears(new Date(), date),
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: "Age is required" }]}
                required={false}
                className="col-span-12 lg:col-span-2"
              >
                <Input id="age" placeholder="Age" disabled={true} />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Gender is required" }]}
                required={false}
                className="col-span-12 lg:col-span-2"
              >
                <Select placeholder="Gender" id="gender">
                  {gender.map((gender, index) => {
                    return (
                      <Select.Option value={gender} key={index}>
                        {gender}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Civil Status"
                name="civil_status"
                rules={[
                  { required: true, message: "Civil Status is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select placeholder="Select Civil Status">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Religion"
                name="religion"
                rules={[{ required: true, message: "Religion is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select placeholder="Select Religion">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Nationality"
                name="nationality"
                rules={[{ required: true, message: "Nationality is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select placeholder="Select Nationality">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Contact Details</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { type: "email", message: "Must be a valid email" },
                  { required: true, message: "Email Address is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="email" placeholder="Email Address" />
              </Form.Item>
              <Form.Item
                label="Landline Number"
                name="landline_no"
                rules={[
                  { required: true, message: "Landline Number is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="landline_no" placeholder="Landline Number" />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="mobile_no"
                rules={[
                  { required: true, message: "Mobile Number is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="mobile_no" placeholder="Mobile Number" />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Address</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Street"
                name="street"
                rules={[{ required: true, message: "Street is required" }]}
                required={false}
                className="col-span-12 lg:col-span-8"
              >
                <Input id="street" placeholder="Add street name" />
              </Form.Item>
              <Form.Item
                label="Barangay"
                name="barangay"
                rules={[{ required: true, message: "Barangay is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="barangay" placeholder="Barangay" />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "City is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select placeholder="Select City">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Country is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select placeholder="Select Country">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Zip Code"
                name="zip_code"
                rules={[{ required: true, message: "Zip Code is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <NumericFormat
                  customInput={Input}
                  id="zip_code"
                  allowNegative={false}
                  placeholder="Zip Code"
                />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Occupation</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Position"
                name="position"
                rules={[{ required: true, message: "Position is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="position" placeholder="Position" />
              </Form.Item>
              <Form.Item
                label="Company Name"
                name="company_name"
                rules={[
                  { required: true, message: "Company Name is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-8"
              >
                <Input id="company_name" placeholder="Company Name" />
              </Form.Item>
              <Form.Item
                label="Landline Number"
                name="landline_number"
                rules={[
                  { required: true, message: "Landline Number is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="landline_number" placeholder="Landline Number" />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="mobile_number"
                rules={[
                  { required: true, message: "Mobile Number is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="mobile_number" placeholder="Mobile Number" />
              </Form.Item>
              <Form.Item
                label="Zip Code"
                name="zip_code"
                rules={[{ required: true, message: "Zip Code is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <NumericFormat
                  customInput={Input}
                  id="zip_code"
                  allowNegative={false}
                  placeholder="Zip Code"
                />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Office Address</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Street"
                name="office_street"
                rules={[{ required: true, message: "Street is required" }]}
                required={false}
                className="col-span-12 lg:col-span-8"
              >
                <Input id="office_street" placeholder="Add street name" />
              </Form.Item>
              <Form.Item
                label="Barangay"
                name="office_barangay"
                rules={[{ required: true, message: "Barangay is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="office_barangay" placeholder="Barangay" />
              </Form.Item>
              <Form.Item
                label="City"
                name="office_city"
                rules={[{ required: true, message: "City is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select placeholder="Select City" id="office_city">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Country"
                name="office_country"
                rules={[{ required: true, message: "Country is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select placeholder="Select Country" id="office_country">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Zip Code"
                name="office_zip_code"
                rules={[{ required: true, message: "Zip Code is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <NumericFormat
                  customInput={Input}
                  id="office_zip_code"
                  allowNegative={false}
                  placeholder="Zip Code"
                />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Emergency Contact</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="First Name"
                name="emergency_first_name"
                rules={[{ required: true, message: "First Name is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="emergency_first_name" placeholder="First Name" />
              </Form.Item>
              <Form.Item
                label="Middle Name"
                name="emergency_middle_name"
                rules={[{ required: true, message: "Middle Name is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="emergency_middle_name" placeholder="Middle Name" />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="emergency_last_name"
                rules={[{ required: true, message: "Last Name is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="emergency_last_name" placeholder="Last Name" />
              </Form.Item>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { type: "email", message: "Must be a valid email" },
                  { required: true, message: "Email Address is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="email" placeholder="Email Address" />
              </Form.Item>
              <Form.Item
                label="Landline Number"
                name="landline_number"
                rules={[
                  { required: true, message: "Landline Number is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="landline_number" placeholder="Landline Number" />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="mobile_number"
                rules={[
                  { required: true, message: "Mobile Number is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="mobile_number" placeholder="Mobile Number" />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Insurance</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Dental Insurance"
                name="dental_insurance"
                rules={[
                  { required: true, message: "Dental Insurance is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="dental_insurance" placeholder="Dental Insurance" />
              </Form.Item>
              <Form.Item
                label="Effective Date"
                name="effective_date"
                rules={[
                  { required: true, message: "Effective Date is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <DatePicker id="effective_date" placeholder="Effective Date" />
              </Form.Item>
              <Form.Item
                label="Note"
                name="note"
                rules={[{ required: true, message: "Note is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="note" placeholder="Note" />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Others</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Whom may we thank for referring you?"
                name="referral"
                rules={[{ required: true, message: "Referral is required" }]}
                required={false}
                className="col-span-12 lg:col-span-6"
              >
                <Input
                  id="referral"
                  placeholder="Whom may we thank for referring you?"
                />
              </Form.Item>
              <Form.Item
                label="Contact of Referral"
                name="referral_contact"
                rules={[
                  {
                    required: true,
                    message: "Contact of Referral is required",
                  },
                ]}
                required={false}
                className="col-span-12 lg:col-span-6"
              >
                <DatePicker
                  id="referral_contact"
                  placeholder="Contact of Referral"
                />
              </Form.Item>
              <Form.Item
                label="What is your reason for dental consultation?"
                name="reason"
                rules={[{ required: true, message: "Reason is required" }]}
                required={false}
                className="col-span-12 lg:col-span-6"
              >
                <Input
                  id="reason"
                  placeholder="What is your reason for dental consultation?"
                />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Terms and Conditions</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-full">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                suscipit vitae justo vel fermentum. Aliquam sed bibendum ligula.
                Nullam dapibus libero convallis, tincidunt erat viverra,
                molestie sem. Nam commodo tellus sed massa rutrum, et consequat
                mauris vulputate. Curabitur feugiat quis tortor quis posuere.
                Donec quis consectetur tellus. Maecenas mauris leo, suscipit a
                ipsum nec, vehicula bibendum nulla. Duis iaculis dignissim
                congue.
              </div>
              <Form.Item
                name="patient_consent"
                valuePropName="checked"
                rules={[
                  {
                    required: true,
                    transform: (value: any) => value || undefined,
                    type: "boolean",
                    message: "Must accept patient's consent to submit.",
                  },
                ]}
                required={false}
                className="col-span-full text-base"
              >
                <Checkbox id="patient_consent" className="font-medium">
                  {`Patient's Consent`}
                </Checkbox>
              </Form.Item>
            </div>
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

export default PersonalInfo;
