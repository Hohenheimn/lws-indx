import React from "react";
import { Checkbox, DatePicker, Form, notification } from "antd";
import { differenceInYears, parse } from "date-fns";
import moment from "moment";
import Image from "next/image";
import { NumericFormat, PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@components/Button";
import Card from "@components/Card";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import { Select } from "@components/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import gender from "@utilities/global-data/gender";
import { getInitialValue } from "@utilities/helpers";


function dataURLtoFile(dataurl: any, filename: any) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

export function PersonalInfo({ patientRecord, tab, pageType }: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);
  const [PersonalInfoForm] = Form.useForm();

  let signatureCanvasRef = React.useRef<any>(null);
  let [isSignatureCleared, setIsSignatureCleared] = React.useState(false);

  React.useEffect(() => {
    if (tab === "Personal Info") {
      PersonalInfoForm.setFieldsValue({
        ...patientRecord,
        entry_date: moment(patientRecord?.created_at).isValid()
          ? moment(patientRecord?.created_at)
          : undefined,
        insurance_effective_date: moment(
          patientRecord?.insurance_effective_date
        ).isValid()
          ? moment(patientRecord?.insurance_effective_date, "MMMM DD, YYYY")
          : undefined,
        birthdate: moment(patientRecord?.birthdate).isValid()
          ? moment(patientRecord?.birthdate)
          : undefined,
        age: moment(patientRecord?.birthdate).isValid()
          ? moment().diff(moment(patientRecord?.birthdate), "years")
          : undefined,
        patient_consent: Boolean(patientRecord?.patient_signature_path),
      });
    }
    // computeAge()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const { mutate: editPatient } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/patient/${patientRecord._id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Personal Information Updated",
          description: `Personal Information Updated`,
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["patient"] });
        const previousValues = queryClient.getQueryData(["patient"]);
        queryClient.setQueryData(["patient"], (oldData: any) =>
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
        queryClient.setQueryData(["patient"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["patient"] });
      },
    }
  );

  const computeAge = (dob: any) => {
    PersonalInfoForm.setFieldsValue({
      age: moment().diff(moment(dob), "years"),
    });
  };

  return (
    <Card className="flex-auto">
      <Form
        form={PersonalInfoForm}
        layout="vertical"
        onFinish={(values) => {
          delete values.entry_date;
          if (
            typeof values.patient_signature_path === "string" &&
            values.patient_signature_path.includes("https")
          ) {
            delete values.patient_signature_path;
          }
          values.insurance_effective_date = moment(
            values.insurance_effective_date
          ).format("MMMM DD, YYYY");
          values.birthdate = moment(values.birthdate).format("MMMM DD, YYYY");

          editPatient(values);
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
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <DatePicker
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  placeholder="Entry Date"
                  disabled={true}
                  format="MMMM DD, YYYY"
                />
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
                <Input
                  id="first_name"
                  disabled={pageType === "view"}
                  placeholder="First Name"
                />
              </Form.Item>
              <Form.Item
                label="Middle Name"
                name="middle_name"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="middle_name"
                  disabled={pageType === "view"}
                  placeholder="Middle Name"
                />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="last_name"
                rules={[{ required: true, message: "Last Name is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="last_name"
                  disabled={pageType === "view"}
                  placeholder="Last Name"
                />
              </Form.Item>
              <Form.Item
                label="Birthdate"
                name="birthdate"
                className="col-span-12 lg:col-span-4"
              >
                <DatePicker
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  disabled={pageType === "view"}
                  placeholder="Birthdate"
                  id="birthdate"
                  format="MMMM DD, YYYY"
                  defaultPickerValue={moment().subtract(3, "year")}
                  disabledDate={(current) => {
                    return current && current >= moment().subtract(3, "year");
                  }}
                  onChange={(dob, dobString) => {
                    computeAge(dob);
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: "Age is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="age" placeholder="Age" disabled={true} />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Gender is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select
                  placeholder="Gender"
                  id="gender"
                  disabled={pageType === "view"}
                >
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
                <InfiniteSelect
                  placeholder="Civil Status"
                  id="civil_status"
                  disabled={pageType === "view"}
                  api={`${process.env.REACT_APP_API_BASE_URL}/api/civil-status?limit=3&for_dropdown=true&page=1`}
                  getInitialValue={{
                    form: PersonalInfoForm,
                    initialValue: "civil_status",
                  }}
                  queryKey={["civil_status"]}
                  displayValueKey="name"
                  returnValueKey="_id"
                />
              </Form.Item>
              <Form.Item
                label="Religion"
                name="religion"
                rules={[{ required: true, message: "Religion is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="religion"
                  disabled={pageType === "view"}
                  placeholder="Religion"
                />
              </Form.Item>
              <Form.Item
                label="Nationality"
                name="nationality"
                rules={[{ required: true, message: "Nationality is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <InfiniteSelect
                  placeholder="Nationality"
                  id="nationality"
                  disabled={pageType === "view"}
                  api={`${process.env.REACT_APP_API_BASE_URL}/api/nationality?limit=3&for_dropdown=true&page=1`}
                  getInitialValue={{
                    form: PersonalInfoForm,
                    initialValue: "nationality",
                  }}
                  queryKey={["nationality"]}
                  displayValueKey="name"
                  returnValueKey="_id"
                />
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
                <Input
                  id="email"
                  disabled={pageType === "view"}
                  placeholder="Email Address"
                />
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
                <NumericFormat
                  customInput={Input}
                  id="landline_no"
                  disabled={pageType === "view"}
                  allowNegative={false}
                  placeholder="Landline Number"
                />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="mobile_no"
                rules={[
                  { required: true, message: "Mobile Number is required" },
                  {
                    pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                    message:
                      "Please use correct format!\n\nFormat:09XX-XXX-XXXXX",
                  },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <PatternFormat
                  customInput={Input}
                  placeholder="09XX-XXX-XXXXX"
                  disabled={pageType === "view"}
                  patternChar="*"
                  format="****-***-****"
                  allowEmptyFormatting={false}
                  id="mobile_no"
                />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4>Address</h4>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Country is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select
                  placeholder="Select Country"
                  id="country"
                  disabled={pageType === "view"}
                >
                  <Select.Option value="Philippines">Philippines</Select.Option>
                </Select>
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
                      name="province"
                      rules={[
                        { required: true, message: "Province is required" },
                      ]}
                    >
                      <InfiniteSelect
                        placeholder="Province"
                        id="province"
                        api={`${process.env.REACT_APP_API_BASE_URL}/api/location/province?limit=3&for_dropdown=true&page=1`}
                        getInitialValue={{
                          form: PersonalInfoForm,
                          initialValue: "province",
                        }}
                        queryKey={["province"]}
                        displayValueKey="name"
                        returnValueKey="_id"
                        disabled={
                          Boolean(!getFieldValue("country")) ||
                          pageType === "view"
                        }
                        onChange={() => {
                          resetFields(["city", "barangay"]);
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
                      name="city"
                      rules={[{ required: true, message: "City is required" }]}
                    >
                      <InfiniteSelect
                        placeholder="City"
                        id="city"
                        api={`${
                          process.env.REACT_APP_API_BASE_URL
                        }/api/location/city?limit=3&for_dropdown=true&page=1&province_code=${getFieldValue(
                          "province"
                        )}`}
                        getInitialValue={{
                          form: PersonalInfoForm,
                          initialValue: "city",
                        }}
                        queryKey={["city", getFieldValue("province")]}
                        displayValueKey="name"
                        returnValueKey="_id"
                        disabled={
                          Boolean(
                            !getFieldValue("country") ||
                              !getFieldValue("province")
                          ) || pageType === "view"
                        }
                        onChange={() => {
                          resetFields(["barangay"]);
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
                      name="barangay"
                      rules={[{ required: true, message: "City is required" }]}
                    >
                      <InfiniteSelect
                        placeholder="Barangay"
                        id="barangay"
                        api={`${
                          process.env.REACT_APP_API_BASE_URL
                        }/api/location/barangay?limit=3&for_dropdown=true&page=1&province_code=${getFieldValue(
                          "province"
                        )}&city_code=${getFieldValue("city")}`}
                        getInitialValue={{
                          form: PersonalInfoForm,
                          initialValue: "barangay",
                        }}
                        queryKey={["barangay", getFieldValue("city")]}
                        displayValueKey="name"
                        returnValueKey="_id"
                        disabled={
                          Boolean(
                            !getFieldValue("country") ||
                              !getFieldValue("province") ||
                              !getFieldValue("city")
                          ) || pageType === "view"
                        }
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
              <Form.Item
                label="Street"
                name="street"
                rules={[{ required: true, message: "Street is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="street"
                  placeholder="Add street name"
                  disabled={pageType === "view"}
                />
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
                  disabled={pageType === "view"}
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
                name="occupation_position"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="occupation_position"
                  disabled={pageType === "view"}
                  placeholder="Position"
                />
              </Form.Item>
              <Form.Item
                label="Company Name"
                name="company_name"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="company_name"
                  disabled={pageType === "view"}
                  placeholder="Company Name"
                />
              </Form.Item>
              <Form.Item
                label="Email Address"
                name="occupation_email"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="occupation_email"
                  disabled={pageType === "view"}
                  placeholder="Email Address"
                />
              </Form.Item>
              <Form.Item
                label="Landline Number"
                name="occupation_landline_no"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <NumericFormat
                  customInput={Input}
                  id="occupation_landline_no"
                  allowNegative={false}
                  placeholder="Landline Number"
                  disabled={pageType === "view"}
                />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="occupation_mobile_no"
                rules={[
                  {
                    pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                    message:
                      "Please use correct format!\n\nFormat:09XX-XXX-XXXXX",
                  },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <PatternFormat
                  customInput={Input}
                  placeholder="09XX-XXX-XXXXX"
                  patternChar="*"
                  format="****-***-****"
                  allowEmptyFormatting={false}
                  id="occupation_mobile_no"
                  disabled={pageType === "view"}
                />
              </Form.Item>
              <Form.Item
                label="Zip Code"
                name="zip_code"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <NumericFormat
                  customInput={Input}
                  id="zip_code"
                  allowNegative={false}
                  disabled={pageType === "view"}
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
                label="Country"
                name="office_country"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Select
                  placeholder="Select Country"
                  id="office_country"
                  disabled={pageType === "view"}
                >
                  <Select.Option value="Philippines">Philippines</Select.Option>
                </Select>
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
                    <Form.Item name="office_province">
                      <InfiniteSelect
                        placeholder="Province"
                        id="office_province"
                        api={`${process.env.REACT_APP_API_BASE_URL}/api/location/province?limit=3&for_dropdown=true&page=1`}
                        getInitialValue={{
                          form: PersonalInfoForm,
                          initialValue: "office_province",
                        }}
                        queryKey={["office_province"]}
                        displayValueKey="name"
                        returnValueKey="_id"
                        disabled={
                          Boolean(!getFieldValue("office_country")) ||
                          pageType === "view"
                        }
                        onChange={() => {
                          resetFields(["office_city", "office_barangay"]);
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
                    <Form.Item name="office_city">
                      <InfiniteSelect
                        placeholder="City"
                        id="office_city"
                        api={`${
                          process.env.REACT_APP_API_BASE_URL
                        }/api/location/city?limit=3&for_dropdown=true&page=1&province_code=${getFieldValue(
                          "office_province"
                        )}`}
                        getInitialValue={{
                          form: PersonalInfoForm,
                          initialValue: "office_city",
                        }}
                        queryKey={[
                          "office_city",
                          getFieldValue("office_province"),
                        ]}
                        displayValueKey="name"
                        returnValueKey="_id"
                        disabled={
                          Boolean(!getFieldValue("office_country")) ||
                          Boolean(!getFieldValue("office_province")) ||
                          pageType === "view"
                        }
                        onChange={() => {
                          resetFields(["office_barangay"]);
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
                    <Form.Item name="office_barangay">
                      <InfiniteSelect
                        placeholder="Barangay"
                        id="office_barangay"
                        api={`${
                          process.env.REACT_APP_API_BASE_URL
                        }/api/location/barangay?limit=3&for_dropdown=true&page=1&province_code=${getFieldValue(
                          "office_province"
                        )}&city_code=${getFieldValue("office_city")}`}
                        getInitialValue={{
                          form: PersonalInfoForm,
                          initialValue: "office_barangay",
                        }}
                        queryKey={[
                          "office_barangay",
                          getFieldValue("office_city"),
                        ]}
                        displayValueKey="name"
                        returnValueKey="_id"
                        disabled={
                          Boolean(
                            !getFieldValue("office_country") ||
                              !getFieldValue("office_province") ||
                              !getFieldValue("office_city")
                          ) || pageType === "view"
                        }
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
              <Form.Item
                label="Street"
                name="office_street"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="office_street"
                  placeholder="Add street name"
                  disabled={pageType === "view"}
                />
              </Form.Item>
              <Form.Item
                label="Zip Code"
                name="office_zip_code"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <NumericFormat
                  customInput={Input}
                  id="office_zip_code"
                  allowNegative={false}
                  placeholder="Zip Code"
                  disabled={pageType === "view"}
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
                <Input
                  id="emergency_first_name"
                  disabled={pageType === "view"}
                  placeholder="First Name"
                />
              </Form.Item>
              <Form.Item
                label="Middle Name"
                name="emergency_middle_name"
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="emergency_middle_name"
                  disabled={pageType === "view"}
                  placeholder="Middle Name"
                />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="emergency_last_name"
                rules={[{ required: true, message: "Last Name is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="emergency_last_name"
                  disabled={pageType === "view"}
                  placeholder="Last Name"
                />
              </Form.Item>
              <Form.Item
                label="Email Address"
                name="emergency_email"
                rules={[
                  { type: "email", message: "Must be a valid email" },
                  { required: true, message: "Email Address is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="emergency_email"
                  disabled={pageType === "view"}
                  placeholder="Email Address"
                />
              </Form.Item>
              <Form.Item
                label="Landline Number"
                name="emergency_landline_no"
                // rules={[
                //   { required: true, message: "Landline Number is required" },
                // ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <NumericFormat
                  customInput={Input}
                  id="emergency_landline_no"
                  allowNegative={false}
                  placeholder="Landline Number"
                  disabled={pageType === "view"}
                />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="emergency_mobile_no"
                rules={[
                  { required: true, message: "Mobile Number is required" },
                  {
                    pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                    message:
                      "Please use correct format!\n\nFormat:09XX-XXX-XXXXX",
                  },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <PatternFormat
                  customInput={Input}
                  placeholder="09XX-XXX-XXXXX"
                  patternChar="*"
                  format="****-***-****"
                  allowEmptyFormatting={false}
                  id="emergency_mobile_no"
                  disabled={pageType === "view"}
                />
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
                name="insurance_name"
                rules={[
                  { required: true, message: "Dental Insurance is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="insurance_name"
                  disabled={pageType === "view"}
                  placeholder="Dental Insurance"
                />
              </Form.Item>
              <Form.Item
                label="Effective Date"
                name="insurance_effective_date"
                rules={[
                  { required: true, message: "Effective Date is required" },
                ]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <DatePicker
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  id="insurance_effective_date"
                  placeholder="Effective Date"
                  format="MMMM DD, YYYY"
                  disabled={pageType === "view"}
                />
              </Form.Item>
              <Form.Item
                label="Note"
                name="insurance_note"
                // rules={[{ required: true, message: "Note is required" }]}
                required={false}
                className="col-span-12 lg:col-span-4"
              >
                <Input
                  id="insurance_note"
                  disabled={pageType === "view"}
                  placeholder="Note"
                />
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
                name="referral_name"
                // rules={[{ required: true, message: "Referral is required" }]}
                required={false}
                className="col-span-12 lg:col-span-6"
              >
                <Input
                  id="referral_name"
                  disabled={pageType === "view"}
                  placeholder="Whom may we thank for referring you?"
                />
              </Form.Item>
              <Form.Item
                label="Contact of Referral"
                name="referral_contact"
                rules={[
                  ({ getFieldValue }: any) => ({
                    validator(_: any, value: any) {
                      if (value && !value.match(/^(09)\d{2}-\d{3}-\d{4}$/)) {
                        return Promise.reject(
                          "Please use correct format!\n\nFormat:09XX-XXX-XXXXX"
                        );
                      }

                      return Promise.resolve();
                    },
                  }),
                ]}
                required={false}
                className="col-span-12 lg:col-span-6"
              >
                <PatternFormat
                  customInput={Input}
                  disabled={pageType === "view"}
                  placeholder="09XX-XXX-XXXXX"
                  patternChar="*"
                  format="****-***-****"
                  allowEmptyFormatting={false}
                  id="referral_contact"
                />
              </Form.Item>
              <Form.Item
                label="What is your reason for dental consultation?"
                name="reason_for_consultation"
                // rules={[{ required: true, message: "Reason is required" }]}
                required={false}
                className="col-span-12 lg:col-span-6"
              >
                <Input
                  id="reason_for_consultation"
                  disabled={pageType === "view"}
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
                {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                suscipit vitae justo vel fermentum. Aliquam sed bibendum ligula.
                Nullam dapibus libero convallis, tincidunt erat viverra,
                molestie sem. Nam commodo tellus sed massa rutrum, et consequat
                mauris vulputate. Curabitur feugiat quis tortor quis posuere.
                Donec quis consectetur tellus. Maecenas mauris leo, suscipit a
                ipsum nec, vehicula bibendum nulla. Duis iaculis dignissim
                congue. */}
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
                {pageType === "edit" && (
                  <Checkbox id="patient_consent" className="font-medium">
                    {`Patient's Consent`}
                  </Checkbox>
                )}
              </Form.Item>
              {isSignatureCleared || !patientRecord?.patient_signature_path ? (
                <Form.Item
                  label="Patient Signature"
                  name="patient_signature_path"
                  rules={[
                    {
                      required: true,
                      message: "Patient Signature is required",
                    },
                  ]}
                  className="col-span-full text-base"
                >
                  <SignatureCanvas
                    penColor="#000"
                    canvasProps={{
                      style: {
                        width: "100%",
                        height: "20rem",
                        border: "1px solid #ccc",
                        background: pageType === "edit" ? "white" : "#f5f5f5",
                        userSelect: "none",
                        pointerEvents: pageType === "edit" ? "auto" : "none",
                      },
                    }}
                    ref={signatureCanvasRef}
                    onEnd={() => {
                      PersonalInfoForm.setFieldsValue({
                        patient_signature_path: dataURLtoFile(
                          signatureCanvasRef.current
                            ?.getTrimmedCanvas()
                            .toDataURL("image/png"),
                          `${patientRecord?._id}-signature.png`
                        ),
                      });
                    }}
                    key="canvas"
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  label="Patient Signature"
                  name="patient_signature_path"
                  rules={[
                    {
                      required: true,
                      message: "Patient Signature is required",
                    },
                  ]}
                  className="col-span-full text-base"
                >
                  <div className="relative h-80 col-span-full">
                    <Image
                      src={patientRecord?.patient_signature_path}
                      alt="Patient Signature"
                      fill
                      sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                      className="object-center"
                      objectFit="contain"
                    />
                  </div>
                </Form.Item>
              )}
            </div>
          </div>
          {pageType === "edit" && (
            <>
              <div className="col-span-full flex justify-center items-center mb-4 mt-8">
                <Button
                  appearance="ghost"
                  onClick={() => {
                    signatureCanvasRef?.current?.clear();
                    PersonalInfoForm.resetFields(["patient_signature_path"]);
                    setIsSignatureCleared(true);
                  }}
                  className="max-w-xs p-4"
                >
                  Clear Signature
                </Button>
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
            </>
          )}
        </div>
      </Form>
    </Card>
  );
}

export default PersonalInfo;
