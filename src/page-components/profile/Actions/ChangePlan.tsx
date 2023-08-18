import React from "react";
import { Checkbox, Form } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import { scroller } from "react-scroll";
import { Button } from "@src/components/Button";
import Card from "@src/components/Card";

type Props = {
  onBack: () => void;
};

export default function ChangePlan({ onBack }: Props) {
  const [form] = Form.useForm();
  return (
    <Card className="flex-auto md:p-12 p-6">
      <h4 className="mb-3">Change Plan</h4>
      <ul className=" flex space-x-3 items-center mb-3">
        <li className=" cursor-pointer" onClick={onBack}>
          Account Details
        </li>
        <li>
          <IoIosArrowForward />
        </li>
        <li className=" text-primary-500 cursor-pointer">Change Plan</li>
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
        className="space-y-12"
      >
        <Form.Item name="sms_credit" required={false} className="text-base">
          <Checkbox.Group className="w-full">
            <ul className="w-full">
              <li className="flex justify-between border-b border-gray-300 py-5">
                <p className=" text-xl font-semibold">Free</p>
                <Checkbox value="100" />
              </li>
              <li className="flex justify-between border-b border-gray-300 py-5">
                <p className=" text-xl font-semibold">Basic - P499</p>
                <Checkbox value="500" />
              </li>
              <li className="flex justify-between border-b border-gray-300 py-5">
                <p className=" text-xl font-semibold">Standard - P999</p>
                <Checkbox value="1000" />
              </li>
              <li className="flex justify-between py-5">
                <p className=" text-xl font-semibold">Premium - P1,499</p>
                <Checkbox value="2000" />
              </li>
            </ul>
          </Checkbox.Group>
        </Form.Item>
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
