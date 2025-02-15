import React, { useEffect, useState } from "react";
import { Space, Form, notification, Checkbox } from "antd";

import { motion } from "framer-motion";
// import { useMutation } from "react-query";
import Image from "next/image";
import { BsCheckCircle } from "react-icons/bs";
import { PatternFormat } from "react-number-format";
import { Button } from "@components/Button";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { AnimateContainer, PageContainer } from "@src/components/animation";
import { fadeIn } from "@src/components/animation/animation";
import LoadingScreen from "@src/layout/LoadingScreen";
import SubscriptionAccount, {
  registrationAccount,
} from "@src/page-components/registration/SubscriptionAccount";
import { useMutation } from "@tanstack/react-query";
import { postDataNoToken } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { slugify } from "@utilities/helpers";

export default function Registration({ router }: any) {
  const [RegistrationForm] = Form.useForm();
  const { setIsAppLoading } = React.useContext(Context);
  let [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);

  const [isSubscription, setSubscription] = useState<boolean>(false);

  const { mutate: register, isLoading } = useMutation(
    (payload: {}) =>
      postDataNoToken({
        url: `/api/auth/register?api_key=${process.env.REACT_APP_API_KEY}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: () => {
        setIsSuccessModalOpen(true);
        setSubscription(true);
        RegistrationForm.resetFields();
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

  const clinicName = Form.useWatch("clinic_name", RegistrationForm);
  useEffect(() => {
    RegistrationForm.setFieldValue("indx_url", slugify(clinicName));
  }, [clinicName]);

  if (isSubscription) {
    return (
      <section className=" w-screen h-screen flex justify-center items-center flex-col bg-primary text-white">
        <Image
          src={"/images/white-logo.png"}
          alt="random pics"
          width={300}
          height={100}
          className="object-center mb-10"
        />
        <h2 className=" text-white mb-3">Thank you for the registration </h2>
        <p className=" text-[1.5rem] text-center">
          Please check your email for the link and credentials of your account
        </p>
      </section>
    );
  }

  return (
    <>
      {isLoading && (
        <AnimateContainer
          variants={fadeIn}
          rootMargin="0px"
          className="fixed h-screen w-full top-0 left-0 z-[9999] bg-black bg-opacity-80 flex justify-center items-center"
        >
          <LoadingScreen message="Creating your account..." />
        </AnimateContainer>
      )}
      <PageContainer className="md:p-0">
        <div className="flex flex-auto overflow-hidden">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{
              x: 0,
              transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
            }}
            exit={{ x: "-100%" }}
            className=" hidden md:flex relative h-screen basis-full md:basis-[60%] bg-primary p-[4vw]"
          >
            <div className="w-full h-full relative">
              <Image
                src="/images/white-logo.png"
                alt="random pics"
                fill
                sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                className="object-center object-contain"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ x: "100%" }}
            animate={{
              x: 0,
              transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
            }}
            exit={{
              x: "100%",
              transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
            }}
            className=" overflow-auto h-screen flex flex-col items-center flex-auto p-[5%] md:p-20 bg-white"
          >
            <div className="space-y-6 w-full">
              <aside className=" flex justify-center">
                <div className=" relative h-[7rem] aspect-[2/1]">
                  <Image
                    src="/images/logo.png"
                    alt="random pics"
                    className=" h-full w-full object-contain"
                    fill
                  />
                </div>
              </aside>
              <h3 className="font-['Mulish']">Dentist Registration</h3>
              <Form
                form={RegistrationForm}
                layout="vertical"
                onFinish={(values) => {
                  delete values.subdomain;
                  register(values);
                }}
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[
                      { required: true, message: "First Name is required" },
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <Input
                      id="registration-first-name"
                      placeholder="First Name"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[
                      { required: true, message: "Last Name is required" },
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <Input
                      id="registration-last-name"
                      placeholder="Last Name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email Address"
                    name="email_address"
                    rules={[
                      {
                        required: true,
                        message: "Email Address is required",
                      },
                      { type: "email", message: "Must be a valid email" },
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <Input
                      id="registration-email-address"
                      placeholder="Email Address"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Mobile Number"
                    name="mobile_number"
                    rules={[
                      { required: true, message: "Mobile Number is required" },
                      {
                        pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                        message: "Please use correct format!",
                      },
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <PatternFormat
                      customInput={Input}
                      placeholder="09XX-XXX-XXXXX"
                      patternChar="*"
                      format="****-***-****"
                      allowEmptyFormatting={false}
                      id="registration-mobile-number"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Clinic Name"
                    name="clinic_name"
                    rules={[
                      { required: true, message: "Clinic Name is required" },
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <Input
                      id="registration-clinic-name"
                      placeholder="Clinic Name"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Clinic Address"
                    name="clinic_address"
                    rules={[
                      { required: true, message: "Clinic Address is required" },
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <Input
                      id="registration-clinic-address"
                      placeholder="Clinic Address"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Index Url"
                    name="indx_url"
                    rules={[
                      { required: true, message: "Index Url is required" },
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <Input
                      id="registration-indx-url"
                      disabled
                      placeholder="Index Url"
                    />
                  </Form.Item>
                  {/* <Form.Item
                    label="Index Url Slug"
                    name="indx_url"
                    rules={[
                      { required: true, message: "Index Url Slug is required" },
                      // {
                      //   pattern: /^[a-zA-Z-_]+$/,
                      //   message:
                      //     "Index Url only accept - or _ for more than 2 words",
                      // },
                    ]}
                    required={false}
                    className="col-span-full"
                  >
                    <Input placeholder="Index Url" />
                  </Form.Item> */}

                  <Form.Item
                    name="terms"
                    valuePropName="checked"
                    rules={[
                      {
                        required: true,
                        transform: (value: any) => value || undefined,
                        type: "boolean",
                        message: "Must accept terms & agreement to submit.",
                      },
                    ]}
                    required={false}
                    className="col-span-full text-sm mt-4"
                  >
                    <Checkbox id="registration-terms">
                      By clicking the submit button below, I hereby agree to and
                      accept the following{" "}
                      <a
                        className="underline font-semibold"
                        onClick={() => router.push("/terms-and-conditions")}
                        id="registration-terms-conditions"
                      >
                        Terms and Conditions
                      </a>{" "}
                      governing my use of Indx Health website and services. I
                      further reaffirm my acceptance of the {`website's`}{" "}
                      <a
                        className="underline font-semibold"
                        onClick={() => router.push("/privacy-policy")}
                        id="registration-privacy-policy"
                      >
                        Privacy Policy
                      </a>
                      .
                    </Checkbox>
                  </Form.Item>
                </div>
                <div className="space-y-4 mt-10">
                  <Button
                    className="py-4"
                    appearance="blumine"
                    type="submit"
                    id="registration-submit"
                  >
                    Register Now!
                  </Button>
                </div>
              </Form>
            </div>
          </motion.div>
        </div>
      </PageContainer>
      <Modal
        show={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        className="w-[70rem]"
      >
        <div className="space-y-12 text-center text-base max-w-[50rem] m-auto">
          <BsCheckCircle className="text-primary text-9xl m-auto" />
          <div>
            <h2 className="font-normal mb-2">Registration Successful</h2>
            <div className="text-default-secondary">
              Your registration has been confirmed. Your temporary password and
              link account will send to your email.
            </div>
          </div>
          <Button
            appearance="primary"
            className="max-w-[20rem] p-4"
            onClick={() => {
              // router.push("/");
              setIsSuccessModalOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}

// export const getServerSideProps = async ({ req }: any) => {
//   return {
//     redirect: {
//       destination: "/pre-register",
//       permanent: false, // Set to true if it's a permanent redirect
//     },
//   };
// };
