import React from "react";
import { Form, notification } from "antd";
import { useRouter } from "next/router";
import { Button } from "@src/components/Button";
import Input from "@src/components/Input";
import { useMutation } from "@tanstack/react-query";
import { postDataNoToken } from "@utilities/api";

function EnterEmail({ setLoading }: { setLoading: Function }) {
  const [checkDomain] = Form.useForm();
  const router = useRouter();
  const { mutate: checkEmail } = useMutation(
    (payload: any) =>
      postDataNoToken({
        url: `/api/auth/find-account?api_key=${process.env.REACT_APP_API_KEY}`,
        payload,
        options: {
          isLoading: (show: boolean) => setLoading(show),
        },
      }),
    {
      onSuccess: (res) => {
        if (res) {
          router.push(
            `/forgot-password?recovery=true&email=${res?.email}&subdomain=${res?.registered_account?.indx_url}`
          );
        } else {
          notification.warning({
            key: "find-account",
            message: "Invalid Email",
            description: "Email does not exist",
          });
        }
      },
      onError: (err: { [key: string]: string }) => {
        notification.warning({
          key: "find-account",
          message: "No Search Results",
          description: "Invalid email",
        });
      },
    }
  );
  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="font-['Mulish'] mb-2">Enter your Email</h2>
        <p className=" text-[1rem]">
          Please enter your email or mobile number to search for your account.
        </p>
      </div>
      <Form
        form={checkDomain}
        layout="vertical"
        onFinish={(values) => {
          checkEmail(values);
        }}
        className="w-full"
      >
        <div>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Enter email to proceed",
              },
            ]}
            required={false}
          >
            <Input id="email" placeholder="Email" />
          </Form.Item>
        </div>
        <div className="space-y-4 mt-10">
          <Button className="py-4" appearance="blumine" type="submit">
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default EnterEmail;
