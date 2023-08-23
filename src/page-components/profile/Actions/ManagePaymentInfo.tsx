import React, { useState } from "react";
import { DatePicker, Form, Radio } from "antd";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { scroller } from "react-scroll";
import { Button } from "@src/components/Button";
import Card from "@src/components/Card";
import Input from "@src/components/Input";
import { Select } from "@src/components/Select";

type Props = {
  onBack: () => void;
};

export default function ManagePaymentInfo({ onBack }: Props) {
  const [form] = Form.useForm();
  const [isChangeCredit, setChangeCredit] = useState(false);
  const mode_of_payment = Form.useWatch("mode_of_payment", form);

  return (
    <Card className="flex-auto md:p-12 p-6">
      <h4 className="mb-3">Manage Payment Info</h4>
      <ul className=" flex space-x-3 items-center mb-5">
        <li className=" cursor-pointer" onClick={onBack}>
          Account Details
        </li>
        <li>
          <IoIosArrowForward />
        </li>
        <li
          className={
            !isChangeCredit
              ? " text-primary-500 cursor-pointer"
              : " cursor-pointer"
          }
          onClick={() => setChangeCredit(false)}
        >
          Manage Payment Info
        </li>
        {isChangeCredit && (
          <>
            <li>
              <IoIosArrowForward />
            </li>
            <li className=" text-primary-500 cursor-pointer">Change Credit</li>
          </>
        )}
      </ul>

      {isChangeCredit ? (
        <ChangeCredit />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log(values);
          }}
          onFinishFailed={(data) => {
            scroller.scrollTo(
              data?.errorFields[0]?.name?.join("-")?.toString(),
              {
                smooth: true,
                offset: -50,
              }
            );
          }}
          className=" space-y-10"
        >
          <Form.Item
            name="mode_of_payment"
            required={false}
            className="text-base"
          >
            <Radio.Group>
              <ul className="grid grid-cols-2 gap-4">
                <Radio
                  value="Credit Card"
                  className={` ${
                    mode_of_payment === "Credit Card"
                      ? "border border-primary-500"
                      : "border border-gray-300"
                  } px-3 py-2`}
                >
                  <li className=" flex items-center space-x-3 justify-between">
                    <p>Credit Card</p>
                    <Image
                      src={"/images/visa_icon.png"}
                      width={100}
                      height={50}
                      alt="visa"
                    />
                    <Image
                      src={"/images/credit_card.png"}
                      width={80}
                      height={30}
                      alt="visa"
                    />
                  </li>
                </Radio>

                <Radio
                  value="Paypal"
                  className={` ${
                    mode_of_payment === "Paypal"
                      ? "border border-primary-500"
                      : "border border-gray-300"
                  } px-3 py-2`}
                >
                  <li className=" flex items-center h-full space-x-3 justify-between w-full">
                    <p className={` pt-2 `}>Paypal</p>

                    <Image
                      src={"/images/paypal.png"}
                      width={100}
                      height={50}
                      alt="visa"
                    />
                  </li>
                </Radio>
              </ul>
            </Radio.Group>
          </Form.Item>

          <ul className=" flex justify-between">
            <li className=" flex items-center space-x-4">
              <Image
                src={"/images/visa_text.png"}
                width={100}
                height={50}
                alt="visa"
              />
              <h5>**** **** **** 1332</h5>
            </li>
            <li>
              <p
                className={`cursor-pointer text-primary-500 hover:text-primary-300`}
                onClick={() => setChangeCredit(true)}
              >
                Change Credit
              </p>
            </li>
          </ul>
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => onBack()}
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
      )}
    </Card>
  );
}

const ChangeCredit = ({}) => {
  const [form] = Form.useForm();
  return (
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
      className=" space-y-5 flex flex-col items-start"
    >
      <div>
        <p>Credit Card</p>
        <div className=" px-3 py-2 border-2 border-green-300 bg-green-100 flex items-center justify-around space-x-4">
          <div className=" flex items-center space-x-4">
            <Image
              src="/images/visa_icon.png"
              height={100}
              width={50}
              alt="visa"
            />
            <h5>4123 4567 123 9819</h5>
          </div>
          <BsCheck className=" text-green-500 text-3xl" />
        </div>
      </div>
      <div className=" flex space-x-5 items-end">
        <Form.Item label="Expiration Date" name="year" required={false}>
          <DatePicker
            picker="year"
            getPopupContainer={(triggerNode: any) => {
              return triggerNode.parentNode;
            }}
            format="YYYY"
          />
        </Form.Item>

        <Form.Item name="month" required={false}>
          <DatePicker
            picker="month"
            getPopupContainer={(triggerNode: any) => {
              return triggerNode.parentNode;
            }}
            format="MM"
          />
        </Form.Item>
      </div>
      <Form.Item label="Remarks" name="year" required={false}>
        <div className=" flex items-center space-x-3">
          <Input placeholder="remarks" />
          <AiOutlineQuestionCircle className=" text-2xl text-gray-300" />
        </div>
      </Form.Item>

      <div className=" flex flex-col items-center space-y-5">
        <p className=" text-center">
          By clicking button, you agree to the{" "}
          <Link href={"#"} className=" underline">
            Terms and Conditions
          </Link>
        </p>
        <div>
          <Button appearance="primary">
            <div className="flex items-center">
              Continue <IoIosArrowForward />
            </div>
          </Button>
        </div>
      </div>
    </Form>
  );
};
