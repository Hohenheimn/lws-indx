import React, { useEffect } from "react";
import { Checkbox, DatePicker, Form, notification } from "antd";
import { differenceInYears, parse } from "date-fns";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoPersonOutline } from "react-icons/io5";
import { NumericFormat, PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import Avatar from "@components/Avatar";
import { Button } from "@components/Button";
import Card from "@components/Card";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import { Select } from "@components/Select";
import Uploader from "@components/Uploader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import gender from "@utilities/global-data/gender";
import { getBase64 } from "@utilities/helpers";

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

export function ProfileInfo({ profile, tab }: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);
  const [DoctorInfoForm] = Form.useForm();
  const router = useRouter();
  let [image, setImage] = React.useState({
    imageUrl: profile?.profile_picture,
    error: false,
    file: null,
    loading: false,
    edit: false,
  });

  function handleChange(info: any) {
    if (info.file.status === "uploading") {
      return setImage({
        ...image,
        loading: true,
        file: null,
        edit: false,
      });
    }

    if (info.file.status === "error") {
      return setImage({
        ...image,
        loading: false,
        error: true,
        edit: false,
      });
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setImage({
          ...image,
          imageUrl,
          loading: false,
          file: info.file,
          edit: true,
        });
      });
      return info.file.originFileObj;
    }
  }
  const country = Form.useWatch("country", DoctorInfoForm);
  const province = Form.useWatch("province", DoctorInfoForm);
  const city = Form.useWatch("city", DoctorInfoForm);
  const barangay = Form.useWatch("barangay", DoctorInfoForm);
  React.useEffect(() => {
    if (tab === "1") {
      DoctorInfoForm.setFieldsValue({
        ...profile,
        middle_name:
          !profile?.middle_name || profile?.middle_name === null
            ? ""
            : profile?.middle_name,
        entry_date: moment(profile?.created_at).isValid()
          ? moment(profile?.created_at)
          : undefined,
        birthdate: moment(profile?.birthdate).isValid()
          ? moment(profile?.birthdate)
          : undefined,
        age: moment(profile?.birthdate).isValid()
          ? moment().diff(moment(profile?.birthdate), "years")
          : undefined,
        country: profile?.country ? profile?.country : "174",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const { mutate: editAccount } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/account/${payload.id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Editing Account Success",
          description: `Editing Account Success`,
        });
        router.push("/admin/profile");
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["account"] });
        const previousValues = queryClient.getQueryData(["account"]);
        queryClient.setQueryData(["account"], (oldData: any) =>
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
        queryClient.setQueryData(["account"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["account"] });
      },
    }
  );
  return (
    <Card className="flex-auto">
      <Form
        form={DoctorInfoForm}
        layout="vertical"
        onFinish={(values) => {
          let id = DoctorInfoForm.getFieldValue("_id");
          values.permissions = JSON.stringify(values.permissions);
          values.civil_status = "";
          values.id = id;
          values.account_role = profile?.account_role;
          if (typeof values.profile_picture !== "object") {
            delete values.profile_picture;
          }

          editAccount(values);
        }}
        onFinishFailed={(data) => {
          scroller.scrollTo(data?.errorFields[0]?.name[0].toString(), {
            smooth: true,
            offset: -50,
            containerId: "main-container",
          });
        }}
        className="space-y-12"
      >
        <section className="w-full flex justify-between items-center flex-wrap">
          <div className=" w-full xs:w-[38%]">
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
                  DoctorInfoForm.setFieldValue("profile_picture", value.file);
                }}
                className="[&_.ant-upload]:!border-0"
                id="profile_picture"
                capture={true}
              >
                <div className="space-y-2 text-center">
                  <Avatar className="h-40 w-40 p-8 overflow-hidden relative border border-gray-300 avatar transition">
                    {image.imageUrl ? (
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
                  <div className="text-casper-500">
                    {image.imageUrl ? "Change" : "Upload"} Profile Picture
                  </div>
                </div>
              </Uploader>
            </Form.Item>
          </div>
          <div className="w-full xs:w-[58%] space-y-4">
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
              ]}
              required={true}
              className="col-span-6 lg:col-span-2"
              initialValue=""
            >
              <Input id="first_name" placeholder="First Name" />
            </Form.Item>
            <Form.Item
              label="Middle Name"
              name="middle_name"
              className="col-span-6 lg:col-span-2"
              initialValue=""
            >
              <Input id="middle_name" placeholder="Middle Name" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
              ]}
              required={true}
              className="col-span-6 lg:col-span-2"
              initialValue=""
            >
              <Input id="last_name" placeholder="Last Name" />
            </Form.Item>
          </div>
        </section>
        <div className="space-y-4">
          <div className="grid lg:grid-cols-6 gap-4">
            <Form.Item
              label="Birthdate"
              name="birthdate"
              className="col-span-6 lg:col-span-3"
              rules={[
                {
                  required: true,
                  message: "Birth Month is required",
                },
              ]}
              required={true}
            >
              <DatePicker
                getPopupContainer={(triggerNode: any) => {
                  return triggerNode.parentNode;
                }}
                placeholder="Birthdate"
                id="birthdate"
                format="MMMM DD, YYYY"
                defaultPickerValue={moment().subtract(0, "year")}
                disabledDate={(current) => {
                  return current && current >= moment().subtract(0, "year");
                }}
                onChange={(dob, dobString) => {
                  const date = parse(dobString, "MMMM dd, yyyy", new Date());

                  DoctorInfoForm.setFieldsValue({
                    age: differenceInYears(new Date(), date),
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label="Age"
              name="age"
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
              ]}
              required={true}
              className="col-span-6 lg:col-span-1"
            >
              <Input id="age" placeholder="Age" disabled={true} />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
              ]}
              required={true}
              className="col-span-6 lg:col-span-2"
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
              label="License Number"
              name="license_no"
              required={false}
              className="col-span-6 lg:col-span-2"
            >
              <Input id="license_no" placeholder="License Number" />
            </Form.Item>
            <Form.Item
              label="PTR Number"
              name="ptr_no"
              required={false}
              className="col-span-6 lg:col-span-2"
            >
              <Input id="ptr_no" placeholder="PTR Number" />
            </Form.Item>
            <Form.Item
              label="S2 License Number"
              name="s2_no"
              required={false}
              className="col-span-6 lg:col-span-2"
            >
              <Input id="s2_no" placeholder="S2 License Number" />
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
                {
                  required: true,
                  message: "This is required!",
                },
                {
                  type: "email",
                  message: "Must be a valid email",
                },
              ]}
              required={true}
              className="col-span-3 lg:col-span-1"
            >
              <Input id="email" placeholder="juandelacruz@xxxxx.xxx" />
            </Form.Item>
            <Form.Item
              label="Landline Number"
              name="landline_no"
              required={false}
              className="col-span-3 lg:col-span-1"
            >
              <NumericFormat
                customInput={Input}
                id="landline_no"
                allowNegative={false}
                placeholder="Landline Number"
              />
            </Form.Item>
            <Form.Item
              label="Mobile Number"
              name="mobile_no"
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
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
                  placeholder="09XX-XXX-XXXXX"
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
                    rules={[{ required: true, message: "Country is required" }]}
                    required={true}
                  >
                    <InfiniteSelect
                      placeholder="Country"
                      id="country"
                      api={`${process.env.REACT_APP_API_BASE_URL}/api/location/country?limit=3&for_dropdown=true&page=1`}
                      getInitialValue={{
                        form: DoctorInfoForm,
                        initialValue: "country",
                      }}
                      queryKey={["country", country]}
                      displayValueKey="name"
                      returnValueKey="_id"
                      onChange={() => {
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
                        required={true}
                      >
                        <InfiniteSelect
                          placeholder="Province"
                          id="province"
                          api={`${process.env.REACT_APP_API_BASE_URL}/api/location/province?limit=3&for_dropdown=true&page=1`}
                          getInitialValue={{
                            form: DoctorInfoForm,
                            initialValue: "province",
                          }}
                          queryKey={["province", country, province]}
                          displayValueKey="name"
                          returnValueKey="_id"
                          disabled={Boolean(!country)}
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
                        required={true}
                        rules={[
                          { required: true, message: "City is required" },
                        ]}
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
                            form: DoctorInfoForm,
                            initialValue: "city",
                          }}
                          queryKey={["city", province, country, city]}
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
                        required={true}
                        rules={[
                          { required: true, message: "City is required" },
                        ]}
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
                            form: DoctorInfoForm,
                            initialValue: "barangay",
                          }}
                          queryKey={[
                            "barangay",
                            city,
                            province,
                            country,
                            barangay,
                          ]}
                          displayValueKey="name"
                          returnValueKey="_id"
                          disabled={Boolean(!country || !province || !city)}
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
                  <Input id="street" placeholder="Add street name" />
                </Form.Item>
                <Form.Item
                  label="Zip Code"
                  name="zip_code"
                  className="col-span-full lg:col-span-1"
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
                  <Input id="street" placeholder="Add full address" />
                </Form.Item>
                <Form.Item
                  label="Postal Code"
                  name="postal_code"
                  className="col-span-full lg:col-span-1"
                >
                  <NumericFormat
                    customInput={Input}
                    id="postal_code"
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
          <Button appearance="primary" className="max-w-[10rem]" type="submit">
            Save
          </Button>
        </div>
      </Form>
    </Card>
  );
}

export default ProfileInfo;
