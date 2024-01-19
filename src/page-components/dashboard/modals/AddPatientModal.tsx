import React, { useEffect, useState } from "react";
import { DatePicker, Form, notification } from "antd";
import { format } from "date-fns";
import { differenceInYears, parse } from "date-fns";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoPersonOutline } from "react-icons/io5";
import { NumericFormat, PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import Avatar from "@components/Avatar";
import { Button } from "@components/Button";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { Select } from "@components/Select";
import Uploader from "@components/Uploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import gender from "@utilities/global-data/gender";
import { getBase64, getInitialValue } from "@utilities/helpers";

export default function AddPatientModal({
  show,
  onClose,
  form,
  isScheduleModalOpen,
  ScheduleForm,
  profile,
  ...rest
}: any) {
  const router = useRouter();
  const queryClient = useQueryClient();
  let [image, setImage] = React.useState({
    imageUrl: "",
    error: false,
    file: null,
    loading: false,
  });

  const { setIsAppLoading } = React.useContext(Context);

  useEffect(() => {
    form.setFieldValue("country", profile?.country ? profile?.country : "");
  }, [profile, show]);

  React.useEffect(() => {
    if (!show) {
      form.resetFields();
      setImage({
        imageUrl: "",
        error: false,
        file: null,
        loading: false,
      });
    }
  }, [form, show]);

  const { mutate: register } = useMutation(
    (payload: any) =>
      postData({
        url: "/api/patient",
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: async (res) => {
        if (router.pathname.includes("admin/patient-list")) {
          router.push(`/admin/patient-list/${res._id}?tab=Personal Info`);
        }

        notification.success({
          message: "Registration Successful",
          description: `Registration Successful`,
        });

        if (isScheduleModalOpen) {
          ScheduleForm.setFieldsValue({
            patient_id: res._id,
          });
        }
        form.resetFields();
        onClose();
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

  function handleChange(info: any) {
    if (info.file.status === "uploading") {
      return setImage({ ...image, loading: true, file: null });
    }

    if (info.file.status === "error") {
      return setImage({ ...image, loading: false, error: true });
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setImage({
          ...image,
          imageUrl,
          loading: false,
          file: info.file,
        });
      });
      return info.file.originFileObj;
    }
  }

  const country = Form.useWatch("country", form);
  const province = Form.useWatch("province", form);
  const city = Form.useWatch("city", form);
  const barangay = Form.useWatch("barangay", form);
  return (
    <Modal
      show={show}
      onClose={() => {
        onClose();
      }}
      {...rest}
    >
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">Add New Patient</div>
          <div className="text-base">
            <div className="text-casper-500">Entry Date</div>
            <div>{format(new Date(), "MM/dd/yyyy")}</div>
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            register(values);
          }}
          onFinishFailed={(data) => {
            scroller.scrollTo(data?.errorFields[0]?.name[0].toString(), {
              smooth: true,
              offset: -50,
              containerId: rest?.id,
            });
          }}
          className="space-y-12"
        >
          <div>
            <Form.Item
              name="profile_picture"
              valuePropName="file"
              getValueFromEvent={handleChange}
              rules={[
                {
                  required: true,
                  message: "This field is required",
                },
              ]}
              required={false}
              className="w-fit m-auto [&_.ant-form-item-explain]:text-center [&_.avatar]:[&.ant-form-item-has-error]:border-red-500"
            >
              <Uploader
                image={image}
                setImage={(value: any) => {
                  setImage(value);
                  form.setFieldValue("profile_picture", value.file);
                }}
                capture={true}
                className="[&_.ant-upload]:!border-0"
                id="patient-form-profile_picture"
              >
                <div className="space-y-2 text-center">
                  <Avatar className="h-40 w-40 p-8 overflow-hidden object-cover relative border border-gray-300 avatar transition">
                    {image.imageUrl && image.file ? (
                      <Image
                        src={image.imageUrl}
                        alt="random pics"
                        fill
                        sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                        className="object-center object-cover h-full w-full"
                      />
                    ) : (
                      <IoPersonOutline className="h-full w-full text-white" />
                    )}
                  </Avatar>
                  <div className="text-casper-500">Upload Profile Picture</div>
                </div>
              </Uploader>
            </Form.Item>
          </div>
          <div className="space-y-4">
            <h4>Personal Info</h4>
            <div className="grid lg:grid-cols-3 gap-4">
              <Form.Item
                label="First Name"
                name="first_name"
                rules={[{ required: true, message: "This is required!" }]}
                required={true}
                className="col-span-3 lg:col-span-1"
                initialValue={""}
              >
                <Input id="patient-form-first_name" placeholder="First Name" />
              </Form.Item>
              <Form.Item
                label="Middle Name"
                name="middle_name"
                className="col-span-3 lg:col-span-1"
                initialValue={""}
              >
                <Input
                  id="patient-form-middle_name"
                  placeholder="Middle Name"
                />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="last_name"
                required={true}
                rules={[{ required: true, message: "This is required!" }]}
                className="col-span-3 lg:col-span-1"
                initialValue={""}
              >
                <Input id="patient-form-last_name" placeholder="Last Name" />
              </Form.Item>
              <Form.Item
                label="Birthdate"
                name="birthdate"
                className="col-span-3 lg:col-span-2"
                rules={[{ required: true, message: "Birth Month is required" }]}
                required={true}
              >
                <DatePicker
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  placeholder="Birthdate"
                  id="patient-form-birthdate"
                  format="MMMM DD, YYYY"
                  defaultPickerValue={moment().subtract(0, "year")}
                  disabledDate={(current) => {
                    return current && current >= moment().subtract(0, "year");
                  }}
                  onChange={(dob, dobString) => {
                    const date = parse(dobString, "MMMM dd, yyyy", new Date());

                    form.setFieldsValue({
                      age: differenceInYears(new Date(), date),
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Age"
                name="age"
                rules={[{ required: true, message: "This is required!" }]}
                required={true}
                className="col-span-3 lg:col-span-1"
              >
                <Input
                  id="patient-form-age"
                  placeholder="Age"
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "This is required!" }]}
                required={true}
                className="col-span-3 lg:col-span-1"
              >
                <Select placeholder="Gender" id="patient-form-gender">
                  {gender.map((gender, index) => {
                    return (
                      <Select.Option value={gender} key={index}>
                        {gender}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <h4>Contact Details</h4>
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "This is required!" },
                  { type: "email", message: "Must be a valid email" },
                ]}
                required={true}
                className="col-span-3 lg:col-span-1"
              >
                <Input
                  id="patient-form-email"
                  placeholder="juandelacruz@xxxxx.xxx"
                />
              </Form.Item>
              <Form.Item
                label="Landline Number"
                name="landline_no"
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <NumericFormat
                  customInput={Input}
                  id="patient-form-landline_no"
                  allowNegative={false}
                  placeholder="Landline Number"
                />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="mobile_no"
                rules={[
                  { required: true, message: "This is required!" },
                  {
                    pattern:
                      country === "174" ? /^(09)\d{2}-\d{3}-\d{4}$/ : /^\d+$/,
                    message: "Please use correct format!",
                  },
                ]}
                required={true}
                className="col-span-3 lg:col-span-1"
              >
                {country === "174" ? (
                  <PatternFormat
                    customInput={Input}
                    placeholder={"09XX-XXX-XXXXX"}
                    patternChar="*"
                    format="****-***-****"
                    allowEmptyFormatting={false}
                    id="patient-form-mobile_no"
                  />
                ) : (
                  <NumericFormat
                    customInput={Input}
                    id="patient-form-mobile_no"
                    allowNegative={false}
                    placeholder="Mobile no"
                  />
                )}
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <h4>Address</h4>
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                label="Country"
                required={true}
                className="col-span-full lg:col-span-1"
                shouldUpdate={(prev, curr) => {
                  return true;
                }}
              >
                {({ getFieldValue, resetFields }) => {
                  return (
                    <Form.Item
                      name="country"
                      rules={[
                        { required: true, message: "Country is required" },
                      ]}
                    >
                      <InfiniteSelect
                        placeholder="Country"
                        id="patient-form-country"
                        api={`${process.env.REACT_APP_API_BASE_URL}/api/location/country?limit=3&for_dropdown=true`}
                        getInitialValue={{
                          form,
                          initialValue: "country",
                        }}
                        queryKey={["country", country]}
                        displayValueKey="name"
                        returnValueKey="_id"
                        onChange={(name) => {
                          resetFields(["city", "barangay", "province"]);
                        }}
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
                    required={true}
                    className="col-span-full lg:col-span-1"
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
                            id="patient-form-province"
                            api={`${process.env.REACT_APP_API_BASE_URL}/api/location/province?limit=3&for_dropdown=true`}
                            getInitialValue={{
                              form,
                              initialValue: "province",
                            }}
                            queryKey={["province", country]}
                            displayValueKey="name"
                            returnValueKey="_id"
                            disabled={Boolean(!getFieldValue("country"))}
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
                    required={true}
                    className="col-span-full lg:col-span-1"
                    shouldUpdate={(prev, curr) => {
                      return true;
                    }}
                  >
                    {({ getFieldValue, resetFields }) => {
                      return (
                        <Form.Item
                          name="city"
                          rules={[
                            { required: true, message: "City is required" },
                          ]}
                        >
                          <InfiniteSelect
                            placeholder="City"
                            id="city"
                            api={`${process.env.REACT_APP_API_BASE_URL}/api/location/city?limit=3&for_dropdown=true&province_code=${province}`}
                            getInitialValue={{
                              form,
                              initialValue: "city",
                            }}
                            queryKey={["city", province]}
                            displayValueKey="name"
                            returnValueKey="_id"
                            disabled={Boolean(!country || !province)}
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
                    required={true}
                    className="col-span-full lg:col-span-1"
                    shouldUpdate={(prev, curr) => {
                      return true;
                    }}
                  >
                    {({ getFieldValue, resetFields }) => {
                      return (
                        <Form.Item
                          name="barangay"
                          rules={[
                            { required: true, message: "Barangay is required" },
                          ]}
                        >
                          <InfiniteSelect
                            placeholder="Barangay"
                            id="patient-form-barangay"
                            api={`${process.env.REACT_APP_API_BASE_URL}/api/location/barangay?limit=3&for_dropdown=true&province_code=${province}&city_code=${city}`}
                            getInitialValue={{
                              form,
                              initialValue: "barangay",
                            }}
                            queryKey={["barangay", city, province]}
                            displayValueKey="name"
                            returnValueKey="_id"
                            disabled={Boolean(!province || !city)}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                  <Form.Item
                    label="Street"
                    name="street"
                    rules={[{ required: true, message: "Street is required" }]}
                    required={true}
                    className="col-span-full lg:col-span-1"
                  >
                    <Input
                      id="patient-form-street"
                      placeholder="Add street name"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Zip Code"
                    name="zip_code"
                    className="col-span-full lg:col-span-1"
                  >
                    <NumericFormat
                      customInput={Input}
                      id="patient-form-zip_code"
                      allowNegative={true}
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
                </>
              ) : (
                <>
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: "Address is required" }]}
                    required={true}
                    className="col-span-full lg:col-span-1"
                  >
                    <Input
                      id="patient-form-street"
                      placeholder="Add full address"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Postal Code"
                    name="postal_code"
                    className="col-span-full lg:col-span-1"
                  >
                    <NumericFormat
                      customInput={Input}
                      id="patient-form-postal_code"
                      allowNegative={false}
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
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => onClose()}
              id="patient-form-cancel"
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              className="max-w-[10rem]"
              type="submit"
              id="patient-form-save"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
