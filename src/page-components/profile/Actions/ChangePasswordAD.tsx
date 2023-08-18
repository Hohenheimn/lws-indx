import React from "react";
import { Form } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import { scroller } from "react-scroll";
import { Button } from "@src/components/Button";
import Card from "@src/components/Card";
import Input from "@src/components/Input";

type Props = {
  onBack: () => void;
};

export default function ChangePaswordAD({ onBack }: Props) {
  const [form] = Form.useForm();
  return (
    <Card className="flex-auto md:p-12 p-6">
      <h4 className="mb-3">Change Password</h4>
      <ul className=" flex space-x-3 items-center mb-3">
        <li className=" cursor-pointer" onClick={onBack}>
          Account Details
        </li>
        <li>
          <IoIosArrowForward />
        </li>
        <li className=" text-primary-500 cursor-pointer">Change Password</li>
      </ul>

      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log(values);
        }}
        onFinishFailed={(data) => {
          scroller.scrollTo(data?.errorFields[0]?.name?.join("-")?.toString(), {
            smooth: true,
            offset: -50,
          });
        }}
        className="space-y-4"
      >
        <Form.Item
          name="current_password"
          rules={[
            {
              required: true,
              message: "This is required!",
            },
          ]}
          required={false}
        >
          <Input id="current_password" placeholder="Current Password" />
        </Form.Item>
        <Form.Item
          name="new_password"
          rules={[
            {
              required: true,
              message: "This is required!",
            },
          ]}
          required={false}
        >
          <Input id="new_password" placeholder="New Password" />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          rules={[
            {
              required: true,
              message: "This is required!",
            },
          ]}
          required={false}
        >
          <Input id="confirm_password" placeholder="Confirm Password" />
        </Form.Item>

        <p className=" text-center text-gray-300 py-5">or</p>
        <div className=" flex justify-center items-center flex-col">
          <div>
            <Button appearance="primary" className=" mb-3">
              Generate Temporary Password
            </Button>
          </div>
          <p className=" text-center text-gray-300">
            Your Temporary Password will be sent to your email
          </p>
        </div>
        <div className="flex justify-end items-center gap-4">
          <Button
            appearance="link"
            className="p-4 bg-transparent border-none text-casper-500 font-semibold"
            onClick={() => onBack()}
          >
            Cancel
          </Button>
          <Button appearance="primary" className="max-w-[10rem]" type="submit">
            Save
          </Button>
        </div>
      </Form>
    </Card>
  );
}
