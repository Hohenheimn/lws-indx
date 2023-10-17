import React, { useState } from "react";
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
import Modal from "@src/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import gender from "@utilities/global-data/gender";
import religion from "@utilities/global-data/religion";
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

export function PersonalInfo({
  patientRecord,
  tab,
  pageType,
  setImage,
  profile_picture,
}: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);
  const [PersonalInfoForm] = Form.useForm();

  const [isViewTermsAndCondition, setViewTermsAndCondition] = useState(false);

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
        setImage({
          imageUrl: "",
          error: false,
          file: null,
          loading: false,
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

  const country = Form.useWatch("country", PersonalInfoForm);
  const office_country = Form.useWatch("office_country", PersonalInfoForm);

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
          if (profile_picture) {
            values.profile_picture = profile_picture;
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
                required={true}
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
                required={true}
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
                rules={[{ required: true, message: "Birthdate is required" }]}
                required={true}
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
                  defaultPickerValue={moment().subtract(0, "year")}
                  disabledDate={(current) => {
                    return current && current >= moment().subtract(0, "year");
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
                required={true}
                className="col-span-12 lg:col-span-4"
              >
                <Input id="age" placeholder="Age" disabled={true} />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "Gender is required" }]}
                required={true}
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
                  queryKey={[
                    "civil_status",
                    PersonalInfoForm.getFieldValue("civil_status"),
                  ]}
                  displayValueKey="name"
                  returnValueKey="_id"
                />
              </Form.Item>
              <Form.Item
                label="Religion"
                name="religion"
                className="col-span-12 lg:col-span-4"
              >
                <Select
                  id="religion"
                  disabled={pageType === "view"}
                  placeholder="Religion"
                >
                  {religion.map((item, index) => {
                    return (
                      <Select.Option value={item} key={index}>
                        {item}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Nationality"
                name="nationality"
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
                  queryKey={[
                    "nationality",
                    PersonalInfoForm.getFieldValue("nationality"),
                  ]}
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
                required={true}
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
                  {
                    pattern:
                      country === "174" ? /^(09)\d{2}-\d{3}-\d{4}$/ : /\d+/g,
                    message:
                      country === "174"
                        ? "Please use correct format!\n\nFormat:09XX-XXX-XXXXX"
                        : "Please enter a number",
                  },
                ]}
                required={true}
                className="col-span-12 lg:col-span-4"
              >
                {country === "174" ? (
                  <PatternFormat
                    customInput={Input}
                    placeholder="09XX-XXX-XXXXX"
                    disabled={pageType === "view"}
                    patternChar="*"
                    format="****-***-****"
                    allowEmptyFormatting={false}
                    id="mobile_no"
                  />
                ) : (
                  <NumericFormat
                    customInput={Input}
                    id="mobile_no"
                    allowNegative={false}
                    disabled={pageType === "view"}
                    placeholder="Mobile no"
                  />
                )}
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
                className="col-span-12 lg:col-span-4"
                shouldUpdate={(prev, curr) => {
                  return true;
                }}
              >
                {({ getFieldValue, resetFields }) => {
                  return (
                    <Form.Item name="country">
                      <InfiniteSelect
                        placeholder="Country"
                        id="country"
                        api={`${process.env.REACT_APP_API_BASE_URL}/api/location/country?limit=3&for_dropdown=true&page=1`}
                        getInitialValue={{
                          form: PersonalInfoForm,
                          initialValue: "country",
                        }}
                        initialValue={patientRecord?.country}
                        queryKey={["country", country]}
                        displayValueKey="name"
                        returnValueKey="_id"
                        disabled={pageType === "view"}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>

              {country === "Philippines" ||
              country === "174" ||
              country === undefined ||
              country === "" ? (
                <>
                  <Form.Item
                    label="Province"
                    className="col-span-12 lg:col-span-4"
                    shouldUpdate={(prev, curr) => {
                      return true;
                    }}
                  >
                    {({ getFieldValue, resetFields }) => {
                      return (
                        <Form.Item name="province">
                          <InfiniteSelect
                            placeholder="Province"
                            id="province"
                            api={`${process.env.REACT_APP_API_BASE_URL}/api/location/province?limit=3&for_dropdown=true&page=1`}
                            getInitialValue={{
                              form: PersonalInfoForm,
                              initialValue: "province",
                            }}
                            initialValue={patientRecord?.province}
                            queryKey={[
                              "province",
                              PersonalInfoForm.getFieldValue("province"),
                            ]}
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
                    className="col-span-12 lg:col-span-4"
                    shouldUpdate={(prev, curr) => {
                      return true;
                    }}
                  >
                    {({ getFieldValue, resetFields }) => {
                      return (
                        <Form.Item name="city">
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
                            queryKey={[
                              "city",
                              getFieldValue("province"),
                              ,
                              getFieldValue("city"),
                            ]}
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
                    className="col-span-12 lg:col-span-4"
                    shouldUpdate={(prev, curr) => {
                      return true;
                    }}
                  >
                    {({ getFieldValue, resetFields }) => {
                      return (
                        <Form.Item name="barangay">
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
                            queryKey={[
                              "barangay",
                              getFieldValue("city"),
                              ,
                              getFieldValue("barangay"),
                            ]}
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
                    className="col-span-12 lg:col-span-4"
                  >
                    <NumericFormat
                      customInput={Input}
                      id="zip_code"
                      allowNegative={false}
                      placeholder="Zip Code"
                      isAllowed={(values) => {
                        const { floatValue } = values;
                        if (Number(floatValue) > Number(9999999999)) {
                          return false;
                        } else {
                          return true;
                        }
                      }}
                      disabled={pageType === "view"}
                    />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    label="Address"
                    name="address"
                    className="col-span-12 lg:col-span-4"
                  >
                    <Input
                      id="street"
                      placeholder="Add full address"
                      disabled={pageType === "view"}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Postal Code"
                    name="postal_code"
                    className="col-span-12 lg:col-span-4"
                  >
                    <NumericFormat
                      customInput={Input}
                      id="postal_code"
                      allowNegative={false}
                      disabled={pageType === "view"}
                      placeholder="Postal Code"
                      isAllowed={(values) => {
                        const { floatValue } = values;
                        if (Number(floatValue) > Number(9999999999)) {
                          return false;
                        } else {
                          return true;
                        }
                      }}
                    />
                  </Form.Item>
                </>
              )}
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
                className="col-span-12 lg:col-span-4"
              >
                <NumericFormat
                  customInput={Input}
                  id="zip_code"
                  allowNegative={false}
                  disabled={pageType === "view"}
                  placeholder="Zip Code"
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    if (Number(floatValue) > Number(9999999999)) {
                      return false;
                    } else {
                      return true;
                    }
                  }}
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
                className="col-span-12 lg:col-span-4"
                shouldUpdate={(prev, curr) => {
                  return true;
                }}
              >
                {({ getFieldValue, resetFields, setFieldValue }) => {
                  return (
                    <Form.Item name="office_country" initialValue={""}>
                      <InfiniteSelect
                        placeholder="Country"
                        id="office_country"
                        api={`${process.env.REACT_APP_API_BASE_URL}/api/location/country?limit=3&for_dropdown=true&page=1`}
                        getInitialValue={{
                          form: PersonalInfoForm,
                          initialValue: "office_country",
                        }}
                        initialValue={patientRecord?.office_country}
                        queryKey={["office_country", office_country]}
                        displayValueKey="name"
                        disabled={pageType === "view"}
                        returnValueKey="_id"
                        onChange={() => {
                          // resetFields([
                          //   "office_city",
                          //   "office_barangay",
                          //   "office_province",
                          // ]);
                          setFieldValue("office_city", "");
                          setFieldValue("office_barangay", "");
                          setFieldValue("office_province", "");
                        }}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>

              {office_country === "Philippines" ||
              office_country === "174" ||
              office_country === undefined ||
              office_country === "" ? (
                <>
                  <Form.Item
                    label="Province"
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
                            queryKey={[
                              "office_province",
                              getFieldValue("office_province"),
                            ]}
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
                              getFieldValue("office_city"),
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
                    className="col-span-12 lg:col-span-4"
                    shouldUpdate={(prev, curr) => {
                      return true;
                    }}
                  >
                    {({ getFieldValue, resetFields }) => {
                      return (
                        <Form.Item name="office_barangay" initialValue={""}>
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
                              getFieldValue("office_barangay"),
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
                    className="col-span-12 lg:col-span-4"
                  >
                    <NumericFormat
                      customInput={Input}
                      id="office_zip_code"
                      allowNegative={false}
                      placeholder="Zip Code"
                      disabled={pageType === "view"}
                      isAllowed={(values) => {
                        const { floatValue } = values;
                        if (Number(floatValue) > Number(9999999999)) {
                          return false;
                        } else {
                          return true;
                        }
                      }}
                    />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    label="Address"
                    name="office_address"
                    className="col-span-12 lg:col-span-4"
                  >
                    <Input
                      id="street"
                      placeholder="Add full address"
                      disabled={pageType === "view"}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Postal Code"
                    name="office_postal_code"
                    className="col-span-12 lg:col-span-4"
                  >
                    <NumericFormat
                      customInput={Input}
                      id="postal_code"
                      allowNegative={false}
                      disabled={pageType === "view"}
                      placeholder="Postal Code"
                      isAllowed={(values) => {
                        const { floatValue } = values;
                        if (Number(floatValue) > Number(9999999999)) {
                          return false;
                        } else {
                          return true;
                        }
                      }}
                    />
                  </Form.Item>
                </>
              )}
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
                rules={[{ type: "email", message: "Must be a valid email" }]}
                required={true}
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
                  {
                    pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                    message:
                      "Please use correct format!\n\nFormat:09XX-XXX-XXXXX",
                  },
                ]}
                required={true}
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
              <aside className=" flex col-span-12 items-center gap-2 w-full">
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
                  required={true}
                  className="col-span-full text-base"
                >
                  {pageType === "edit" && (
                    <div className=" flex items-center gap-2">
                      <Checkbox
                        id="patient_consent"
                        className="font-medium"
                      ></Checkbox>
                      <div
                        onClick={() => {
                          setViewTermsAndCondition(true);
                        }}
                        className=" text-bold hover:text-primary duration-150 cursor-pointer"
                      >
                        {`Patient's Consent`}
                      </div>
                    </div>
                  )}
                </Form.Item>
              </aside>
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
      <Modal
        show={isViewTermsAndCondition}
        onClose={() => {
          setViewTermsAndCondition(false);
        }}
      >
        <section className=" space-y-5 text-[1rem]">
          <h3>Terms and Condition</h3>
          <p>
            TREATMENT TO BE DONE: I understand and consent to have any treatment
            done by the dentist after the procedure, the risks & benefits & cost
            have been fully explained. These treatments include, but are not
            limited to, x-rays, cleanings, periodontal treatments, fillings,
            crowns, bridges, all types of extraction, root canals, &/or dentures
            local anesthetics & surgical cases.
          </p>
          <p>
            DRUGS & MEDICATIONS I understand that antibiotics, analgesics &
            other medications can cause allergic reactions like rodness &
            swelling of Unsues, pain, itching, vomiting.&/or anaphylactic shock.
          </p>
          <p>
            CHANGES IN TREATMENT PLAN: understand that during treatment it may
            be necessary to change/ add procedures because of conditions found
            while working on the teeth that was not discovered during
            examination. For example, root canal therapy may be needed following
            routine restorative procedures. I give my permission to the dentist
            to make any/all changes and additions as necessary w/ my
            responsibility to pay all the costs agreed.
          </p>
          <p>
            RADIOGRAPH: understand that an x-ray shot or a radiograph maybe
            necessary as part of diagnostic aid to come up with tentative
            diagnosis of my Dental problem and to make a good treatment plan,
            but, this will not give me a 100% assurance for the accuracy of the
            treatment since all dental treatments are subject to unpredictable
            complications that later on may lead to sudden change of treatment
            plan and subject to new charges.
          </p>
          <p>
            REMOVAL OF TEETH: I understand that alternatives to tooth removal
            (root canal therapy, crowns & periodontal surgery, etc.) & I
            completely understand these alternatives, including their risk &
            benefits prior to authorizing the dentist to remove teeth & any
            other structures necessary for reasons above. I understand that
            removing teeth does not always remove all the infections, if
            present, & it may be necessary to have further treatment. I
            understand the risk involved in having teeth removed, such as pain,
            swelling, spread of infection, dry socket, fractured jaw, loss of
            feeling on the teeth, lips, tongue & surrounding tissue that can
            last for an indefinite period of time. I understand that I may need
            further treatment under a specialist if complications arise during
            or following treatment.
          </p>
          <p>
            CROWNS (CAPS) & BRIDGES: Preparing a tooth may irritate the nerve
            tissue in the center of the tooth, leaving the tooth extra sensitive
            to heat. cold & pressure. Treating such irritation may involve using
            special toothpastes, mouth rinses or root canal therapy. I
            understand that sometimes it is not possible to match the color of
            natural teeth exactly with artificial teeth. Ifurther understand
            that I may be wearing temporary crowns, which may come off easily &
            that I must be careful to ensure that they are kept on until the
            permanent crowns are delivered. It is my responsibility to return
            for permanent cementation within 20 days from tooth preparation, as
            excessive days delay may allow for tooth movement, which may
            necessitate a remake of the crown, bridge/ cap. I understand there
            will be additional charges for remakes due to my delaying of
            permanent cementation, & I realize that final opportunity to make
            changes in my new crown, bridges or cap (including shape, fit, size,
            & color) will be before permanent cementation.
          </p>
          <p>
            ENDODONTICS (ROOT CANAL): I understand there is no guarantee that a
            root canal treatment will save a tooth & that complications can
            occur from the treatment & that occasionally root canal filling
            materials may extend through the tooth which does not necessarily
            effect the success of the treatment. I understand that endodontic
            files & drills are very fine instruments & stresses vented in their
            manufacture & calcifications present in teeth can cause them to
            break during use. I understand that referral to the endodontist for
            additional treatments may be necessary following any root canal
            treatment & I agree that I am responsible for any additional cost
            for treatment performed by the endodontist. I understand that a
            tooth may require removal in spite of all efforts
          </p>
          <p>
            PERIODONTAL DISEASE: I understand that periodontal disease is a
            serious condition causing gum & bone inflammation &/or loss & that
            can lead eventually to the loss of my teeth. I understand the
            alternative treatment plans to correct periodontal disease,
            including gum surgery tooth extractions with or without replacement.
            I understand that undertaking any dental procedures may have future
            adverse effect on my periodontal Conditions,
          </p>
          <p>
            FILLINGS: I understand that care must be exercised in chewing on
            fillings, especially during the first 24 hours to avoid breakage. I
            understand that a more extensive filling or a crown may be required,
            as additional decay or fracture may become evident after initial
            excavation. I understand that significant sensitivity is a common,
            but usually temporary, after-effect of a newly placed filling. I
            further understand that filling a tooth may irritate the nerve
            tissue creating sensitivity & treating such sensitivity could
            require root canal therapy or extractions.
          </p>
          <p>
            DENTURES: I understand that wearing of dentures can be difficult.
            Sore spots, altered speech & difficulty in eating are common
            problems, Immediate dentures (placement of denture immediately after
            extractions) may be painful. Immediate dentures may require
            considerable adjusting & s several relines. I understand that it is
            my responsibility to return for delivery of dentures. I understand
            that failure to keep my delivery appointment may result in poorly
            fitted dentures. If a remake is required due to my delays of more
            than 30 days, there will be additional charges. A permanent reline
            will be needed later, which is not included in the initial fee. I
            understand that all adjustment or alterations of any kind after this
            initial period is subject to charges.
          </p>
          <p>
            I understand that dentistry is not an exact science and that no
            dentist can properly guarantee accurate results all the time.
            Thereby authorize any of the doctors/dental auxiliaries to proceed
            with & perform the dental restorations & treatments as explained to
            me. I understand that these are subject to modification depending on
            undiagnosable circumstances that may arise during the course of
            treatment. I understand that regardless of any dental insurance
            coverage I may have, I am responsible for payment of dental fees,
            agree to pay any attorney&apos;s fees, collection fee, or court
            costs that may be incurred to satisfy any obligation to this office.
            All treatment were properly explained to me & any untoward
            circumstances that may arise during the procedure, the attending
            dentist will not be held liable since it is my free will, with full
            trust & confidence in him/her, to undergo dental Treatment under
            his/her care.
          </p>
          <div className=" flex justify-end w-full">
            <div>
              <Button
                appearance="primary"
                className=" inline-block"
                onClick={() => setViewTermsAndCondition(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </section>
      </Modal>
    </Card>
  );
}

export default PersonalInfo;
