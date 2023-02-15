import React from "react";
import { Checkbox, DatePicker, Form, notification } from "antd";
import Input from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Select";
import Modal from "../../../components/Modal";
import { NumericFormat, PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import Uploader from "../../../components/Uploader";
import Avatar from "../../../components/Avatar";
import { IoPersonOutline } from "react-icons/io5";
import Image from "next/image";
import gender from "../../../../utils/global-data/gender";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData, updateData } from "../../../../utils/api";
import { format } from "date-fns";
import { Context } from "../../../../utils/context/Provider";
import { differenceInYears, parse } from "date-fns";
import accountRole from "../../../../utils/global-data/accountRole";

function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default function AddClinicAccountModal({
  show,
  onClose,
  form,
  ...rest
}: any) {
  const queryClient = useQueryClient();
  let [image, setImage] = React.useState({
    imageUrl: "",
    error: false,
    file: null,
    loading: false,
  });
  const { setIsAppLoading } = React.useContext(Context);

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

  const { mutate: addAccount } = useMutation(
    (payload: any) => {
      return postData({
        url: "/api/account",
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding New Clinic Account Success",
          description: `Adding New Clinic Account Success`,
        });
        form.resetFields();
        onClose();
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

  const { mutate: editAccount } = useMutation(
    (payload: any) => {
      return updateData({
        url: `/api/account/${payload.id}`,
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
        form.resetFields();
        onClose();
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
          <div className="font-semibold text-3xl">Add Clinic Account</div>
          <div className="text-base">
            <div className="text-casper-500">Entry Date</div>
            <div>{format(new Date(), "MM/dd/yyyy")}</div>
          </div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            let id = form.getFieldsValue(["_id"])._id;

            values.civil_status = "";
            // values.clinic_analytics = true;
            // values.financials = false;
            // values.inventory = false;
            // values.sms_management = false;
            // values.procedure_management = true;
            // values.prescription_management = false;
            // values.clinic_accounts = true;
            // values.branch_management = false;
            // values.application_settings = false;
            // values.personal_info = false;
            // values.dental_history = false;
            // values.medical_history = false;
            // values.treatment_plan = false;
            // values.charting = false;
            // values.treatment_records = false;
            // values.medical_gallery = false;
            // values.prescription = false;
            if (!id) {
              addAccount(values);
            } else {
              values.id = id;
              editAccount(values);
            }
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
                setImage={(value: any) => setImage(value)}
                className="[&_.ant-upload]:!border-0"
                id="profile_picture"
              >
                <div className="space-y-2 text-center">
                  <Avatar className="h-40 w-40 p-8 overflow-hidden relative border border-gray-300 avatar transition">
                    {image.imageUrl && image.file ? (
                      <Image
                        src={image.imageUrl}
                        alt="random pics"
                        fill
                        sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                        className="object-center contain h-full w-full"
                      />
                    ) : (
                      <IoPersonOutline className="h-full w-full text-white" />
                    )}
                  </Avatar>
                  <div className="text-casper-500">Upload Profile Picture</div>
                </div>
              </Uploader>
            </Form.Item>
            <Form.Item
              label="Account Type"
              name="account_role"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Select placeholder="Account Type" id="account_role">
                {accountRole.map((role, index) => {
                  return (
                    <Select.Option value={role} key={index}>
                      {role}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
          <div className="space-y-4">
            <h4>Personal Info</h4>
            <div className="grid lg:grid-cols-6 gap-4">
              <Form.Item
                label="First Name"
                name="first_name"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
                className="col-span-6 lg:col-span-2"
              >
                <Input id="first_name" placeholder="First Name" />
              </Form.Item>
              <Form.Item
                label="Middle Name"
                name="middle_name"
                className="col-span-6 lg:col-span-2"
              >
                <Input id="middle_name" placeholder="Middle Name" />
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="last_name"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
                className="col-span-6 lg:col-span-2"
              >
                <Input id="last_name" placeholder="Last Name" />
              </Form.Item>
              <Form.Item
                label="Birthdate"
                name="birthdate"
                className="col-span-6 lg:col-span-3"
                rules={[{ required: true, message: "Birth Month is required" }]}
                required={false}
              >
                <DatePicker
                  placeholder="Birthdate"
                  id="birthdate"
                  format="MMMM DD, YYYY"
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
                required={false}
                className="col-span-6 lg:col-span-1"
              >
                <Input id="age" placeholder="Age" disabled={true} />
              </Form.Item>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
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
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
                className="col-span-6 lg:col-span-2"
              >
                <Input id="license_no" placeholder="License Number" />
              </Form.Item>
              <Form.Item
                label="PTR Number"
                name="ptr_no"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
                className="col-span-6 lg:col-span-2"
              >
                <Input id="ptr_no" placeholder="PTR Number" />
              </Form.Item>
              <Form.Item
                label="S2 License Number"
                name="s2_no"
                rules={[{ required: true, message: "This is required!" }]}
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
                  { required: true, message: "This is required!" },
                  { type: "email", message: "Must be a valid email" },
                ]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <Input id="email" placeholder="juandelacruz@xxxxx.xxx" />
              </Form.Item>
              <Form.Item
                label="Landline Number"
                name="landline_no"
                rules={[{ required: true, message: "This is required!" }]}
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
                  { required: true, message: "This is required!" },
                  {
                    pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                    message: "Please use correct format!",
                  },
                ]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <PatternFormat
                  customInput={Input}
                  placeholder="09XX-XXX-XXXXX"
                  mask="X"
                  format="####-###-####"
                  allowEmptyFormatting={false}
                  id="mobile_no"
                />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <h4>Address</h4>
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                label="Street"
                name="street"
                rules={[{ required: true, message: "Street is required" }]}
                required={false}
                className="col-span-3 lg:col-span-2"
              >
                <Input id="street" placeholder="Add street name" />
              </Form.Item>
              <Form.Item
                label="Barangay"
                name="barangay"
                rules={[{ required: true, message: "Barangay is required" }]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <Input id="barangay" placeholder="Barangay" />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "City is required" }]}
                required={false}
                className="col-span-3 lg:col-span-1"
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
                className="col-span-3 lg:col-span-1"
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
                className="col-span-3 lg:col-span-1"
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
            <h4>Account Access</h4>
            <div className="grid grid-cols-3 gap-4" id="account_access">
              <Form.Item
                name="account_access"
                valuePropName="checked"
                required={false}
                className="col-span-full text-base"
              >
                <Checkbox.Group className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-base">
                  <Checkbox value="clinic_analytics">Clinic Analytic</Checkbox>
                  <Checkbox value="sms-manager">SMS Manager</Checkbox>
                  <Checkbox value="clinic_accounts">Clinic Accounts</Checkbox>
                  <Checkbox value="financials">Financials</Checkbox>
                  <Checkbox value="procedure_management">
                    Procedure Management
                  </Checkbox>
                  <Checkbox value="branch_management">
                    Branch Managements
                  </Checkbox>
                  <Checkbox value="inventory">Inventory</Checkbox>
                  <Checkbox value="prescription_management">
                    Prescription Management
                  </Checkbox>
                  <Checkbox value="application_settings">
                    Application Settings
                  </Checkbox>
                  <Checkbox value="personal_info">Personal Info</Checkbox>
                  <Checkbox value="treatment_plan">Treatment Plan</Checkbox>
                  <Checkbox value="medical_gallery">Medical Gallery</Checkbox>
                  <Checkbox value="dental_history">Dental History</Checkbox>
                  <Checkbox value="charting">Charting</Checkbox>
                  <Checkbox value="prescription">Prescription</Checkbox>
                  <Checkbox value="medical_history">Medical History</Checkbox>
                  <Checkbox value="treatment_records">
                    Treatment Records
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              className="max-w-[10rem]"
              type="submit"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
