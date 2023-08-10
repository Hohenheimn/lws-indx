import React from "react";
import { Form } from "antd";
import Image from "next/image";
import { scroller } from "react-scroll";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import Avatar from "@components/Avatar";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Select } from "@components/Select";
import Uploader from "@src/components/Uploader";
import { getBase64 } from "@utilities/helpers";
import { NextPageProps } from "@utilities/types/NextPageProps";

export function ApplicationSettings({}: NextPageProps) {
  const [applicationSettingsForm] = Form.useForm();

  const iconUrl = applicationSettingsForm.getFieldValue("icon");

  let [image, setImage] = React.useState({
    imageUrl: iconUrl ? iconUrl : "",
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

  return (
    <PageContainer>
      <div className="flex justify-between items-center gap-4">
        <h3 className="basis-auto whitespace-nowrap">Application Settings</h3>
      </div>
      <Form
        form={applicationSettingsForm}
        layout="vertical"
        onFinish={(values) => {
          console.log(values);
        }}
        onFinishFailed={(data) => {
          scroller.scrollTo(data?.errorFields[0]?.name?.join("-")?.toString(), {
            smooth: true,
            offset: -50,
            containerId: "main-container",
          });
        }}
        className="space-y-12"
      >
        <Card className="px-[5%] py-20 flex flex-col flex-auto justify-between gap-6">
          <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="basis-full sm:basis-[35%] hidden sm:block">
              <h5>Clinic Logo</h5>
            </div>
            <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
              <Form.Item
                name="icon"
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
                  id="icon"
                >
                  <div className="space-y-2 text-center">
                    <Avatar className="h-40 w-40 p-8 overflow-hidden bg-white relative border border-gray-300 avatar transition">
                      {image.imageUrl ? (
                        <Image
                          src={image.imageUrl ? image.imageUrl : "/"}
                          alt="dentist icons"
                          fill
                          sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                          objectFit="contain"
                          className="object-center contain h-full w-full"
                        />
                      ) : (
                        <Image
                          src={"/images/default_dentist.png"}
                          alt="dentist icons"
                          fill
                          sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                          objectFit="contain"
                          className="object-center contain h-full w-full"
                        />
                      )}
                    </Avatar>
                    <div className="text-casper-500">
                      {image.imageUrl ? "Change " : "Upload "}
                      Clinic Icon
                    </div>
                  </div>
                </Uploader>
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="basis-full sm:basis-[35%] space-y-4">
              <h5>SMS Appointment Reminder</h5>
              <div className="text-base">
                Sends SMS reminder to patients who scheduled an appointment
              </div>
            </div>
            <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
              <Form.Item
                label=""
                name="sms_appointment_reminder"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "This is required!",
                  },
                ]}
                required={false}
              >
                <Select id="sms_appointment_reminder">
                  <Select.Option value="Enable" key="Enable">
                    Enable
                  </Select.Option>
                  <Select.Option value="Disable" key="Disable">
                    Disable
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="basis-full sm:basis-[35%] space-y-4">
              <h5>Email Appointment Reminder</h5>
              <div className="text-base">
                Sends Email reminder to patients who scheduled an appointment
              </div>
            </div>
            <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
              <Form.Item
                label=""
                name="email_appointment_reminder"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "This is required!",
                  },
                ]}
                required={false}
              >
                <Select id="email_appointment_reminder">
                  <Select.Option value="Enable" key="Enable">
                    Enable
                  </Select.Option>
                  <Select.Option value="Disable" key="Disable">
                    Disable
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="basis-full sm:basis-[35%] space-y-4">
              <h5>SMS Birthday Reminder</h5>
              <div className="text-base">
                Sends SMS reminder to patients who scheduled an birthday
              </div>
            </div>
            <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
              <Form.Item
                label=""
                name="sms_birthday_reminder"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "This is required!",
                  },
                ]}
                required={false}
              >
                <Select id="sms_birthday_reminder">
                  <Select.Option value="Enable" key="Enable">
                    Enable
                  </Select.Option>
                  <Select.Option value="Disable" key="Disable">
                    Disable
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="basis-full sm:basis-[35%] space-y-4">
              <h5>Email Birthday Reminder</h5>
              <div className="text-base">
                Sends Email reminder to patients who scheduled an birthday
              </div>
            </div>
            <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
              <Form.Item
                label=""
                name="email_birthday_reminder"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "This is required!",
                  },
                ]}
                required={false}
              >
                <Select id="email_birthday_reminder">
                  <Select.Option value="Enable" key="Enable">
                    Enable
                  </Select.Option>
                  <Select.Option value="Disable" key="Disable">
                    Disable
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <hr />

          <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="basis-full sm:basis-[35%] space-y-4">
              <h5>SMS Reminder Frequency</h5>
              <div className="text-base">
                How many day/s before sending the appointment reminder.
              </div>
            </div>
            <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
              <Form.Item
                label=""
                name="sms_reminder_frequency"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "This is required!",
                  },
                ]}
                required={false}
              >
                <Select id="sms_reminder_frequency">
                  <Select.Option value="1 Day Before" key="1 Day Before">
                    1 Day Before
                  </Select.Option>
                  <Select.Option value="2 Days Before" key="2 Days Before">
                    2 Days Before
                  </Select.Option>
                  <Select.Option value="3 Days Before" key="3 Days Before">
                    3 Days Before
                  </Select.Option>
                  <Select.Option value="4 Days Before" key="4 Days Before">
                    4 Days Before
                  </Select.Option>
                  <Select.Option value="5 Days Before" key="5 Days Before">
                    5 Days Before
                  </Select.Option>
                  <Select.Option value="6 Days Before" key="6 Days Before">
                    6 Days Before
                  </Select.Option>
                  <Select.Option value="7 Days Before" key="7 Days Before">
                    7 Days Before
                  </Select.Option>
                  <Select.Option value="1 Month Before" key="1 Month Before">
                    1 Month Before
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="basis-full sm:basis-[35%] space-y-4">
              <h5>Email Reminder Frequency</h5>
              <div className="text-base">
                How many day/s before sending the appointment reminder.
              </div>
            </div>
            <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
              <Form.Item
                label=""
                name="email_reminder_frequency"
                className="w-full"
                rules={[
                  {
                    required: true,
                    message: "This is required!",
                  },
                ]}
                required={false}
              >
                <Select id="email_reminder_frequency">
                  <Select.Option value="1 Day Before" key="1 Day Before">
                    1 Day Before
                  </Select.Option>
                  <Select.Option value="2 Days Before" key="2 Days Before">
                    2 Days Before
                  </Select.Option>
                  <Select.Option value="3 Days Before" key="3 Days Before">
                    3 Days Before
                  </Select.Option>
                  <Select.Option value="4 Days Before" key="4 Days Before">
                    4 Days Before
                  </Select.Option>
                  <Select.Option value="5 Days Before" key="5 Days Before">
                    5 Days Before
                  </Select.Option>
                  <Select.Option value="6 Days Before" key="6 Days Before">
                    6 Days Before
                  </Select.Option>
                  <Select.Option value="7 Days Before" key="7 Days Before">
                    7 Days Before
                  </Select.Option>
                  <Select.Option value="1 Month Before" key="1 Month Before">
                    1 Month Before
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="flex-auto sm:max-w-[12rem]">
              <Button appearance="primary" type="submit" className="p-3">
                Save
              </Button>
            </div>
          </div>
        </Card>
      </Form>
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(ApplicationSettings);
