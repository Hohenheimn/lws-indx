import React, { useEffect, useState } from "react";
import { Form, notification } from "antd";
import { useRouter } from "next/router";
import { destroyCookie } from "nookies";
import { IoIosArrowForward } from "react-icons/io";
import { scroller } from "react-scroll";
import { Button } from "@src/components/Button";
import Card from "@src/components/Card";
import Input from "@src/components/Input";
import { useMutation } from "@tanstack/react-query";
import {
  postData,
  postDataNoFormData,
  postDataNoSubDomain,
} from "@utilities/api";
import { Context } from "@utilities/context/Provider";

type Props = {
  onBack: () => void;
  profile: any;
};

export default function ChangePaswordAD({ onBack, profile }: Props) {
  const { setIsAppLoading } = React.useContext(Context);
  const [isSubdomain, setSubdomain] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (window?.location?.origin) {
      let getSubDomain: string | string[] = window?.location?.origin.replace(
        "https://",
        ""
      );
      getSubDomain = getSubDomain.replace("http://", "");
      getSubDomain = getSubDomain.replace("https://", "");
      getSubDomain = getSubDomain.split(".");
      getSubDomain = getSubDomain[0];
      setSubdomain(getSubDomain);
    }
  });

  const { mutate: ChangePassword } = useMutation(
    (payload) =>
      postData({
        url: `/api/user/change-password`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
        isSubdomain,
      }),
    {
      onSuccess: async (res) => {
        router.push("/");
        notification.success({
          key: "change password",
          message: "Change Password Successful",
          description: `It's nice to see you`,
        });
        destroyCookie(undefined, "a_t", { path: "/" });
        destroyCookie(undefined, "subdomain", { path: "/" });
        router.reload();
        notification.success({
          message: "Logout Succesful",
          description: "All done! Have a nice day!",
        });
      },
      onError: () => {
        notification.warning({
          key: "login",
          message: `Something went wrong`,
          description: ``,
        });
      },
    }
  );

  const { mutate: generatePassword } = useMutation(
    (payload: any) => {
      return postDataNoSubDomain({
        url: `/api/auth/generate-password?api_key=${process.env.REACT_APP_API_KEY}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
        isSubdomain,
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Temporary password sent successfully",
        });
        form.resetFields();
        destroyCookie(undefined, "a_t", { path: "/" });
        destroyCookie(undefined, "subdomain", { path: "/" });
        router.reload();
        notification.success({
          message: "Logout Succesful",
          description: "All done! Have a nice day!",
        });
      },

      onError: (err: any, _, context: any) => {
        notification.warning({
          message: "Something Went Wrong",
          description: `${
            err.response.data[Object.keys(err.response.data)[0]]
          }`,
        });
      },
    }
  );

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
          values.email = profile.email;
          ChangePassword(values);
        }}
        onFinishFailed={(data) => {
          scroller.scrollTo(data?.errorFields[0]?.name?.join("-")?.toString(), {
            smooth: true,
            offset: -50,
          });
        }}
        className="space-y-4"
      >
        {/* <Form.Item
          name="current_password"
          rules={[
            {
              required: true,
              message: "This is required!",
            },
          ]}
          required={false}
        >
          <Input id="password" type="password" placeholder="Current Password" />
        </Form.Item> */}
        <Form.Item
          name="password"
          rules={[
            {
              pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
              message:
                "Must be 6 character and at least one capital letter with numbers",
            },
            {
              required: true,
              message: "This is required!",
            },
          ]}
          required={false}
        >
          <Input id="password" type="password" placeholder="New Password" />
        </Form.Item>
        <Form.Item
          name="confirm_password"
          rules={[
            {
              pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
              message:
                "Must be 6 character and at least one capital letter with numbers",
            },
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "The two passwords you entered do not match"
                );
              },
            }),
          ]}
          required={false}
        >
          <Input
            id="confirm_password"
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>

        <p className=" text-center text-gray-300 py-5">or</p>
        <div className=" flex justify-center items-center flex-col">
          <div>
            <Button
              appearance="primary"
              className=" mb-3"
              onClick={() =>
                generatePassword({
                  email: profile.email,
                  subdomain: isSubdomain,
                })
              }
            >
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
