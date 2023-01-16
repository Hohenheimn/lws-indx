import { Space, Form, notification, Menu, Card } from "antd";
import dynamic from "next/dynamic";

import React from "react";
import { AnimateContainer, PageContainer } from "../components/animation";
import Image from "next/image";
import Input from "../components/Input";
import { Button } from "../components/Button";
import { CiMedal } from "react-icons/ci";
import Avatar from "../components/Avatar";
import { Input as Inp } from "antd";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { GrLocal, GrMenu } from "react-icons/gr";
import { Drawer } from "antd";
import { twMerge } from "tailwind-merge";
import { scroller } from "react-scroll";
import { fadeIn, stagger, zoomIn } from "../components/animation/animation";
import {
  BsCheckCircle,
  BsHandThumbsUp,
  BsInstagram,
  BsLinkedin,
  BsShieldLock,
} from "react-icons/bs";
import {
  AiOutlineArrowDown,
  AiOutlineIdcard,
  AiOutlineUnlock,
} from "react-icons/ai";
import { MdRunningWithErrors } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { postData } from "../../utils/api";
import { Context } from "../../utils/context/Provider";
import Modal from "../components/Modal";
import { PatternFormat } from "react-number-format";

const { TextArea } = Inp;

type sideMenuProps = {
  label: string;
  link: string;
  appearance: string;
};

const menu: Array<sideMenuProps> = [
  {
    label: "About Indx",
    link: "#about",
    appearance: "link",
  },
  {
    label: "Contact Us",
    link: "#contact-us",
    appearance: "link",
  },
  {
    label: "Register Now",
    link: "/registration",
    appearance: "primary",
  },
];

export default function Website({ router }: any) {
  let [openDrawer, setOpenDrawer] = React.useState(false);
  let [activeHeader, setActiveHeader] = React.useState(false);
  let [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const { setShowLoading } = React.useContext(Context);
  const [ContactForm] = Form.useForm();

  const { mutate: contact } = useMutation(
    (payload: {}) =>
      postData({
        url: "/api/contact-us",
        payload,
        options: {
          isLoading: (show: boolean) => setShowLoading(show),
        },
      }),
    {
      onSuccess: () => {
        setShowSuccessModal(true);
        ContactForm.resetFields();
      },
    }
  );

  return (
    <>
      <Drawer
        open={openDrawer}
        closable={false}
        className="[&>.ant-drawer-content-wrapper]:max-xs:!w-full md:hidden"
      >
        <div className="flex flex-col flex-auto bg-white shadow-lg w-full h-full py-8">
          <div className="space-y-8 flex flex-col flex-1 relative">
            <div className="items-center h-12 w-full relative">
              <Image
                src="/images/logo.png"
                alt="random pics"
                fill
                sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                className="object-center object-contain cursor-pointer"
                onClick={() => router.push("#hero")}
              />
            </div>
            <div className="flex flex-col flex-auto overflow-auto relative space-y-8 p-4">
              {menu.map(({ link, label, appearance }, index) => {
                return (
                  <Button
                    appearance={appearance}
                    key={index}
                    onClick={() => {
                      router.push(link);
                      setOpenDrawer(false);
                    }}
                    className={appearance !== "link" ? "p-4" : ""}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Drawer>
      <div
        className={twMerge(
          "fixed top-0 left-0 flex justify-between items-center py-4 px-[5%] w-full z-50 transition mr-6 duration-300",
          activeHeader ? "bg-white shadow-md" : "bg-transparent"
        )}
      >
        <div className="items-center h-16 w-32 relative">
          <Image
            src="/images/logo.png"
            alt="random pics"
            fill
            sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
            className="object-center object-contain cursor-pointer"
            onClick={() => router.push("#hero")}
          />
        </div>
        <div className="hidden md:flex gap-20 items-center">
          {menu.map(({ label, link, appearance }, index) => (
            <div key={index}>
              <Button
                appearance={appearance}
                className={twMerge(
                  "text-[1.1rem]",
                  appearance !== "link" ? "p-4" : ""
                )}
                onClick={() => {
                  router.push(link);
                }}
              >
                {label}
              </Button>
            </div>
          ))}
        </div>
        <div className="block md:hidden">
          <Button
            appearance="link"
            className="text-2xl"
            onClick={() => setOpenDrawer(true)}
          >
            <GrMenu />
          </Button>
        </div>
      </div>
      <PageContainer
        className="!p-0 text-base bg-white text-default-secondary"
        onScroll={(e: any) => {
          if (
            e.target.scrollHeight - e.target.scrollTop <
            e.target.scrollHeight - 200
          ) {
            setActiveHeader(true);
          } else {
            setActiveHeader(false);
          }
        }}
      >
        <div
          className="relative flex flex-col md:min-h-screen flex-none mt-[5rem] lg:mt-0 mb-8"
          id="hero"
        >
          <div className=" justify-center h-auto lg:h-full w-full lg:max-w-[45rem] flex flex-col items-center lg:items-start lg:text-left text-center space-y-4 xs:space-y-8 p-[2%] xs:p-[5%]">
            <div className="flex flex-col lg:flex-auto justify-center">
              <AnimateContainer variants={fadeIn} className="space-y-8">
                <h2 className="font-normal text-6xl xs:text-7xl">
                  Your Digital <br />
                  <span className="text-primary font-semibold">Index Card</span>
                </h2>
                <div>
                  Clinic management software made simple—Easy patient
                  registration and dental appointments, secured dental records,
                  and smart clinic analytics.
                </div>
                <div className="lg:m-0">
                  <Button
                    appearance="blumine"
                    className="w-full max-w-xs py-4"
                    onClick={() => router.push("/registration")}
                  >
                    Register Now!
                  </Button>
                </div>
                <div className="xs:text-2xl text-blumine">
                  The first fully EMR in the country
                </div>
              </AnimateContainer>
            </div>
          </div>
          <AnimateContainer
            variants={zoomIn}
            rootMargin="-200px 0px"
            className="relative lg:absolute lg:top-0 lg:right-0 h-[100vw] lg:h-full lg:w-1/2 w-full"
          >
            <Image
              src="/images/hero-2.png"
              alt="hero"
              fill
              sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
              className="object-center lg:object-right object-contain lg:pr-2 px-4"
            />
          </AnimateContainer>
        </div>
        <div className="flex flex-col flex-none px-[5%] pb-[5%] relative space-y-12">
          <AnimateContainer variants={fadeIn}>
            <div className="text-center space-y-2">
              <h2 className="font-semibold text-blumine">
                We Understand Your Inconvenience
              </h2>
              <div>
                Managing a clinic is not easy. These struggles are often
                experienced by dentists and clinic managers:
              </div>
            </div>
          </AnimateContainer>
          <AnimateContainer variants={fadeIn}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 text-center">
              <div className="space-y-4 flex flex-col justify-center items-center max-w-sm m-auto">
                <Avatar className="bg-geraldine bg-opacity-40 h-24 w-24 text-4xl text-geraldine">
                  <AiOutlineIdcard />
                </Avatar>
                <h4 className="font-medium text-blumine">
                  Index cards are unreliable
                </h4>
                <div>
                  Dentists have been using index cards or paper records for
                  decades. However, cards and paper may get lost or damaged
                  which can cause delays in treatment, misdiagnosis and waste
                  more time recording information all over again.
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-center items-center max-w-sm m-auto">
                <Avatar className="bg-geraldine bg-opacity-40 h-24 w-24 text-4xl text-geraldine">
                  <AiOutlineUnlock />
                </Avatar>
                <h4 className="font-medium text-blumine">
                  Unsecure paper records
                </h4>
                <div>
                  You can lose a lot of money and credibility if you do not have
                  the right tools to keep your patient records safe. Aside from
                  losing patients, potential legal troubles for data leak may
                  also be faced.
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-center items-center max-w-sm m-auto">
                <Avatar className="bg-geraldine bg-opacity-40 h-24 w-24 text-4xl text-geraldine">
                  <MdRunningWithErrors />
                </Avatar>
                <h4 className="font-medium text-blumine">
                  Paper Records Slows Clinic Operations
                </h4>
                <div>
                  {`Running a dental practice is tough enough. You can't afford to lose your patients, or the time and money spent processing paper records. But it happens all too often. You are losing patients and your productivity is down.`}
                </div>
              </div>
            </div>
          </AnimateContainer>
          {/* <AnimateContainer variants={fadeIn}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-solid border-primary rounded-2xl overflow-hidden min-h-[25rem]">
                <div className="items-center h-48 w-full relative">
                  <Image
                    src="https://picsum.photos/seed/98/1000/500"
                    alt="random pics"
                    fill
                    sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                    className="object-center object-cover"
                  />
                </div>
                <div className="p-[5%]">
                  {`Running a dental practice is tough enough. You can't afford to
                lose your patients, or the time and money spent processing paper
                records.`}
                </div>
              </div>
              <div className="border border-solid border-primary rounded-2xl overflow-hidden min-h-[25rem]">
                <div className="items-center h-48 w-full relative">
                  <Image
                    src="https://picsum.photos/seed/99/1000/500"
                    alt="random pics"
                    fill
                    sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                    className="object-center object-cover"
                  />
                </div>
                <div className="p-[5%]">
                  {`But it happens all too often. You are losing patients and your productivity is down.`}
                </div>
              </div>
              <div className="border border-solid border-primary rounded-2xl overflow-hidden min-h-[25rem]">
                <div className="items-center h-48 w-full relative">
                  <Image
                    src="https://picsum.photos/seed/100/1000/500"
                    alt="random pics"
                    fill
                    sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                    className="object-center object-cover"
                  />
                </div>
                <div className="p-[5%]">
                  {`INDX software is a complete dental management system that integrates with your billing, scheduling and inventory – giving you visibility into all aspects of your business. A smarter, more seamless way to run your practice.`}
                </div>
              </div>
            </div>
          </AnimateContainer> */}
        </div>
        <div
          className="flex flex-col flex-none px-[5%] pb-[5%] relative space-y-12"
          id="about"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 grid-flow-dense gap-8 items-center">
            <AnimateContainer
              variants={zoomIn}
              className="h-[60vw] md:h-[30rem] w-full relative"
            >
              <Image
                src="/images/xray.png"
                alt="random pics"
                fill
                sizes="(max-width: 500px) 100px"
                className="object-center object-contain pr-2"
              />
            </AnimateContainer>
            <AnimateContainer variants={fadeIn}>
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-blumine font-semibold">
                  INDX Take Care of Your Clinic Activities
                </h2>
                <div>
                  Indx is a clinic management software that allows dentists to
                  efficiently run their clinics. Securely keep your records in
                  one place and simply manage it with ease. Schedule
                  appointments seamlessly, keep and access patient records
                  anytime, track finances and more. Let Indx help you take care
                  of your patients, clinic and practice. Focus on growing your
                  practice and maximizing profits while we take care of your
                  clinic activities for you with a simple, secure and easy to
                  use platform.
                </div>
                <Button
                  appearance="blumine"
                  className="md:w-auto py-4"
                  onClick={() => router.push("/registration")}
                >
                  Get Started
                </Button>
              </div>
            </AnimateContainer>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-8 items-center text-center lg:text-left">
            <AnimateContainer variants={fadeIn}>
              <div className="space-y-4">
                <h2 className="text-blumine font-semibold">
                  Why it’s time to choose INDX?
                </h2>
                <div>
                  <div className="font-medium">Simple.Secured.Smart</div>
                  Our software gives you the simplest yet smartest tools for
                  your dental clinic management experience.
                  <br />
                  <br />
                  <div className="font-medium text-blumine">
                    For Dental Clinic Managers
                  </div>
                  <br />
                  Running a dental clinic is not easy, from taking care of
                  patient records to managing every single part of the clinic.
                  Most clinics use manual processes in running their clinics but
                  this leads to slower and inefficient results.
                  <br />
                  <br />
                  You simply need a partner that will help you manage the clinic
                  efficiently. We developed INDX, keeping you in mind. With
                  INDX, every feature was made simpler while giving you more
                  efficient results. Do more with less clicks. Track patient
                  records easily and manage your clinic in one dashboard.
                  <br />
                  <br />
                  <div className="font-medium text-blumine">
                    For Dental Practitioners
                  </div>
                  <br />
                  Managing a dental practice can quickly become overwhelming. No
                  other dental software caters specifically to the needs of
                  resident dentists.
                  <br />
                  <br />
                  INDX uniquely designed Dental Clinic Management software for
                  the busy practicing dentist.
                  <br />
                  <br />
                  Not only does INDX streamline your practice workflow, our
                  intuitive system increases administrative efficiency, saves
                  you time and helps you focus on what matters most - providing
                  the very best in patient care.
                </div>
                <Button
                  appearance="blumine"
                  className="md:w-auto py-4"
                  onClick={() => router.push("/registration")}
                >
                  Get Started
                </Button>
              </div>
            </AnimateContainer>
            <AnimateContainer
              variants={zoomIn}
              className="h-[70vw] md:h-[40rem] w-full relative"
            >
              <Image
                src="/images/mac.png"
                alt="random pics"
                fill
                sizes="(max-width: 500px) 100px"
                className="object-center object-contain pr-2"
              />
            </AnimateContainer>
          </div>
        </div>
        <div className="flex flex-col flex-none px-[5%] relative space-y-12">
          <AnimateContainer variants={fadeIn}>
            <div className="text-center space-y-2 max-w-[45rem] m-auto">
              <h2 className="font-semibold text-blumine">
                3 Smart Benefits Your Clinic Needs
              </h2>
            </div>
          </AnimateContainer>
          <AnimateContainer
            variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left"
          >
            <div className="border-2 border-solid border-primary rounded-2xl flex items-start p-[5%] gap-x-4">
              <div>
                <Avatar className="bg-primary bg-opacity-40 h-20 w-20 xs:h-24 xs:w-24 xs:text-5xl text-blumine">
                  <BsShieldLock />
                </Avatar>
              </div>
              <div>
                <h4 className="font-medium text-blumine max-xs:text-xl mb-4">
                  Security Guaranteed
                </h4>
                <div>
                  Patient data security is our utmost priority. With Indx, you
                  can rest assured that patient records are safely secure with
                  our data healthcare compliance and usage of high security
                  platform for data storage. Indx is the first fully secure
                  clinic management software in the country.
                </div>
              </div>
            </div>
            <div className="border-2 border-solid border-primary rounded-2xl flex items-start p-[5%] gap-x-4">
              <div>
                <Avatar className="bg-primary bg-opacity-40 h-20 w-20 xs:h-24 xs:w-24 xs:text-5xl text-blumine">
                  <BsHandThumbsUp />
                </Avatar>
              </div>
              <div>
                <h4 className="font-medium text-blumine max-xs:text-xl mb-4">
                  User-Friendly/End-to-end Clinic Management
                </h4>
                <div>
                  Providing you ease of use is our goal. Every feature is
                  developed keeping you in mind. Our team of designers and
                  engineers have worked on providing an intuitive process with
                  simple and functional design to give you a quick and easy
                  experience with the most efficient results.
                </div>
              </div>
            </div>
            <div className="border-2 border-solid border-primary rounded-2xl flex items-start p-[5%] gap-x-4">
              <div>
                <Avatar className="bg-primary bg-opacity-40 h-20 w-20 xs:h-24 xs:w-24 xs:text-5xl text-blumine">
                  <AiOutlineArrowDown />
                </Avatar>
              </div>
              <div>
                <h4 className="font-medium text-blumine max-xs:text-xl mb-4">
                  Easy Importing and migration
                </h4>
                <div>
                  Start transforming your paper records to digital records. We
                  understand that manual recording of patient data has been used
                  for ages, that’s why we developed a feature to help you easily
                  migrate your paper records digitally.
                </div>
              </div>
            </div>
          </AnimateContainer>
          <div className="relative !mt-[30vw] lg:!mt-40 !mb-20 grid grid-cols-1 lg:grid-cols-2 lg:text-left text-center">
            <AnimateContainer
              variants={fadeIn}
              rootMargin="0px 0px"
              className="w-full bg-primary text-white rounded-2xl px-[5%] py-[10%]"
            >
              <div className="relative w-full pointer-events-none lg:hidden block h-[50vw] -mt-[30vw] mb-4">
                <Image
                  src="/images/macbook.png"
                  alt="random pics"
                  fill
                  sizes="(max-width: 500px) 100px"
                  className="object-right object-fill"
                />
              </div>
              <h2 className="text-inherit">Get INDX for Your Clinic Now</h2>
              <div className="font-light">
                Reserve a slot today, and get a free 3 months subscription.
              </div>
              <Button
                appearance="primary"
                className="bg-white text-primary md:w-auto mt-8 p-4 px-8 hover:bg-white hover:scale-105 font-medium"
                onClick={() => router.push("/registration")}
              >
                Register Now
              </Button>
            </AnimateContainer>
            <AnimateContainer
              variants={zoomIn}
              className="relative lg:-ml-20 lg:block hidden"
            >
              <div className="absolute top-[50%] -translate-y-[50%] right-0 h-[30vw] w-full pointer-events-none">
                <Image
                  src="/images/macbook.png"
                  alt="random pics"
                  fill
                  sizes="(max-width: 500px) 100px"
                  className="object-right object-fill"
                />
              </div>
            </AnimateContainer>
          </div>
          <AnimateContainer variants={fadeIn}>
            <Card
              className="space-y-12 text-lg rounded-2xl shadow-[0px_0px_.3rem_0px_rgba(0,0,0,.25)] p-4"
              id="contact-us"
            >
              <div className="grid grid-cols-1 md:grid-cols-[40%_1fr] relative grid-flow-row-dense gap-4">
                <div className="row-start-2 md:row-start-1">
                  <div className="space-y-2">
                    <h2 className="text-blumine mb-8">
                      Reach us for questions
                    </h2>
                  </div>
                  <Form
                    form={ContactForm}
                    layout="vertical"
                    onFinish={(values) => {
                      contact(values);
                    }}
                    className="w-full text-left"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[
                          { required: true, message: "First Name is required" },
                        ]}
                        required={false}
                      >
                        <Input
                          id="first_name"
                          placeholder="First Name"
                          className="shadow-none border-2"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Last Name"
                        name="last_name"
                        rules={[
                          { required: true, message: "Last Name is required" },
                        ]}
                        required={false}
                      >
                        <Input
                          id="last_name"
                          placeholder="Last Name"
                          className="shadow-none border-2"
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
                      >
                        <Input
                          id="email_address"
                          placeholder="Email Address"
                          className="shadow-none border-2"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Mobile Number"
                        name="mobile_number"
                        rules={[
                          {
                            required: true,
                            message: "Mobile Number is required",
                          },
                          {
                            pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                            message: "Please use correct format!",
                          },
                        ]}
                        required={false}
                      >
                        <PatternFormat
                          customInput={Input}
                          placeholder="Mobile Number"
                          mask="X"
                          format="####-###-####"
                          allowEmptyFormatting={false}
                          id="mobile_number"
                          className="shadow-none border-2"
                        />
                      </Form.Item>
                      <Form.Item
                        name="message"
                        rules={[
                          { required: true, message: "Message is required" },
                        ]}
                        required={false}
                        className="md:col-span-2"
                      >
                        <TextArea
                          id="message"
                          placeholder="Your Message here"
                          rows={8}
                          className="!border-2"
                        />
                      </Form.Item>
                    </div>
                    <div className="flex justify-center items-center mt-8">
                      <Button
                        type="submit"
                        appearance="blumine"
                        className="md:max-w-[15rem] p-4 hover:scale-105 font-medium"
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </div>
                <div className="h-full min-h-[20rem] pointer-events-none relative">
                  <Image
                    src="/images/macbook-cms.png"
                    alt="random pics"
                    fill
                    sizes="(max-width: 500px) 100px"
                    className="object-right object-fill"
                  />
                </div>
              </div>
            </Card>
          </AnimateContainer>
        </div>
        <AnimateContainer variants={fadeIn} rootMargin="0px 0px">
          <div className="p-8 pt-0 flex justify-center items-center gap-8 flex-none !mt-4 !m-0">
            <Button
              appearance="link"
              className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
              onClick={() =>
                window.open("https://www.facebook.com/indxhealth", "_blank")
              }
            >
              <FaFacebookF />
            </Button>
            <Button
              appearance="link"
              className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/company/indx-health/?viewAsMember=true&original_referer=",
                  "_blank"
                )
              }
            >
              <BsLinkedin />
            </Button>
            <Button
              appearance="link"
              className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
              onClick={() =>
                window.open("https://www.instagram.com/indxhealth/", "_blank")
              }
            >
              <BsInstagram />
            </Button>
          </div>
        </AnimateContainer>
        <AnimateContainer
          variants={fadeIn}
          rootMargin="0px 0px"
          className="!m-0"
        >
          <div className="text-white bg-primary p-4 text-center !m-0">
            ©2022 Copyright | INDX Dental
          </div>
        </AnimateContainer>
      </PageContainer>
      <Modal
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        className="w-[70rem]"
      >
        <div className="space-y-12 text-center text-base max-w-[50rem] m-auto">
          <BsCheckCircle className="text-primary text-9xl m-auto" />
          <div>
            <h2 className="font-normal mb-2">Registration Successful</h2>
            <div className="text-default-secondary">
              Lorem ipsum dolor sit amet consectetur. Adipiscing augue enim
              pharetra massa sollicitudin. Eu diam lorem ullamcorper dui vitae.
              Posuere praesent ut et orci nec. Habitant ipsum aliquam a id{" "}
            </div>
          </div>
          <Button
            appearance="primary"
            className="max-w-[20rem] p-4"
            onClick={() => {
              setShowSuccessModal(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}
