import { Space, Form, notification, Menu } from "antd";
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
import { GrMenu } from "react-icons/gr";
import { Drawer } from "antd";
import { twMerge } from "tailwind-merge";
import { scroller } from "react-scroll";
import { fadeIn, stagger, zoomIn } from "../components/animation/animation";

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
    appearance: "disabled",
  },
];

export default function Website({ router }: any) {
  let [openDrawer, setOpenDrawer] = React.useState(false);
  let [activeHeader, setActiveHeader] = React.useState(false);
  const [ContactForm] = Form.useForm();

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
              <AnimateContainer variants={fadeIn} className="space-y-4">
                <h1 className="font-normal text-6xl xs:text-7xl">
                  Your Digital <br />
                  <span className="text-primary font-semibold">Index Card</span>
                </h1>
                <div>
                  Lorem ipsum dolor sit amet consectetur. Adipiscing augue enim
                  pharetra massa sollicitudin. Eu diam lorem ullamcorper dui
                  vitae. Posuere praesent ut et orci nec. Habitant ipsum aliquam
                  a id
                </div>
                <div className="lg:m-0">
                  <Button appearance="primary" className="w-full max-w-xs py-4">
                    Register Now!
                  </Button>
                </div>
              </AnimateContainer>
            </div>
            <div className="xs:text-2xl text-blumine">
              <AnimateContainer variants={fadeIn}>
                <div>
                  <CiMedal className="inline-block text-[2em] mr-2" />
                  The first fully EMR in the country
                </div>
                <div className="font-light">
                  Hassle-Free. Simplified Clinic Management Tool.
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
              src="/images/hero.png"
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
              <h1 className="font-semibold text-blumine">Challenges</h1>
              <div>Every Dental Clinics struggle with this 3 key areas:</div>
            </div>
          </AnimateContainer>
          <AnimateContainer variants={fadeIn}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 text-center">
              <div className="space-y-4 flex flex-col justify-center items-center max-w-sm m-auto">
                <Avatar className="bg-primary bg-opacity-30 h-24 w-24 text-4xl">
                  P
                </Avatar>
                <h3 className="font-medium text-blumine">
                  Using index cards for
                  <br />
                  patient record profiling
                </h3>
                <div>
                  Dentists have been using index cards for decades to profile
                  their patients. And it was quite successful until the cards
                  got lost or damaged. And this can cause delays in treatment,
                  misdiagnosis and over-treatment.
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-center items-center max-w-sm m-auto">
                <Avatar className="bg-primary bg-opacity-30 h-24 w-24 text-4xl">
                  P
                </Avatar>
                <h3 className="font-medium text-blumine">
                  Patient Record Safety
                  <br /> and Security.
                </h3>
                <div>
                  You can lose a lot of money if you do not have the right tools
                  to keep your patient records safe. However, it is not just
                  legal troubles you face. Patients could also bring potential
                  lawsuits against you in the event of a data leak or hack.
                </div>
              </div>
              <div className="space-y-4 flex flex-col justify-center items-center max-w-sm m-auto">
                <Avatar className="bg-primary bg-opacity-30 h-24 w-24 text-4xl">
                  P
                </Avatar>
                <h3 className="font-medium text-blumine">
                  Time Management of
                  <br /> Clinic Operations
                </h3>
                <div>
                  {`Running a dental practice is tough enough. You can't afford to
                lose your patients, or the time and money spent processing paper
                records. But it happens all too often. You are losing patients
                and your productivity is down.`}
                </div>
              </div>
            </div>
          </AnimateContainer>
          <AnimateContainer variants={fadeIn}>
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
          </AnimateContainer>
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
                <h1 className="text-blumine font-semibold">What is INDX</h1>
                <div>
                  INDX is an EMR platform that provides a smarter clinic
                  management experience for dentists and patients. From the easy
                  consultation process to conveniently accessing patient
                  records, INDX makes healthcare simpler and more efficient.
                  <br />
                  <br />
                  INDX is dental software that helps you manage your practice
                  more efficiently. With easy-to-use checklists, templates and
                  other productivity tools, you can get and stay organized,
                  schedule appointments efficiently, track patient communication
                  and finances, improve relations and marketing through
                  electronic forms, and more.
                </div>
                <Button appearance="primary" className="md:w-auto py-4">
                  Get Started
                </Button>
              </div>
            </AnimateContainer>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-8 items-center text-center lg:text-left">
            <AnimateContainer variants={fadeIn}>
              <div className="space-y-4">
                <h1 className="text-blumine font-semibold">Why choose INDX</h1>
                <div>
                  <div className="font-medium">Simple.Secured.Smart</div>
                  Our software gives you the simple yet smartest tools for your
                  dental clinic management experience.
                  <br />
                  <br />
                  <div className="font-medium text-blumine">
                    For Dental Clinic Managers
                  </div>
                  <br />
                  INDX is dental software that helps you manage your practice
                  more efficiently. With easy-to-use checklists, templates and
                  other productivity tools, you can get and stay organized,
                  schedule appointments efficiently, track patient communication
                  and finances, improve relations and marketing through
                  electronic forms, and more.
                  <br />
                  <br />
                  <div className="font-medium text-blumine">
                    For Resident Doctors
                  </div>
                  <br />• Accessibility 24/7
                  <br /> • Convenience
                </div>
                <Button appearance="primary" className="md:w-auto py-4">
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
        <div className="flex flex-col flex-none px-[5%] pb-[5%] relative space-y-12">
          <AnimateContainer variants={fadeIn}>
            <div className="text-center space-y-2 max-w-[45rem] m-auto">
              <h1 className="font-semibold text-blumine">3 Key Features</h1>
              <div>
                Lorem ipsum dolor sit amet consectetur. Adipiscing augue enim
                pharetra massa sollicitudin. Eu diam lorem ullamcorper dui
                vitae. Posuere praesent ut et orci nec. Habitant ipsum aliquam a
                id
              </div>
            </div>
          </AnimateContainer>
          <AnimateContainer
            variants={fadeIn}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left"
          >
            <div className="border-2 border-solid border-primary rounded-2xl flex items-center p-[5%] gap-x-4">
              <div>
                <Avatar className="bg-primary bg-opacity-30 h-20 w-20 xs:h-24 xs:w-24 xs:text-3xl">
                  P
                </Avatar>
              </div>
              <h4 className="font-medium text-blumine max-xs:text-xl">
                Security Guaranteed
              </h4>
            </div>
            <div className="border-2 border-solid border-primary rounded-2xl flex items-center p-[5%] gap-x-4">
              <div>
                <Avatar className="bg-primary bg-opacity-30 h-20 w-20 xs:h-24 xs:w-24 xs:text-3xl">
                  P
                </Avatar>
              </div>
              <h4 className="font-medium text-blumine max-xs:text-xl">
                User-Friendly/End-to-end Clinic Management
              </h4>
            </div>
            <div className="border-2 border-solid border-primary rounded-2xl flex items-center p-[5%] gap-x-4">
              <div>
                <Avatar className="bg-primary bg-opacity-30 h-20 w-20 xs:h-24 xs:w-24 xs:text-3xl">
                  P
                </Avatar>
              </div>
              <h4 className="font-medium text-blumine max-xs:text-xl">
                Easy Importing and migration
              </h4>
            </div>
          </AnimateContainer>
          <div className="relative !mt-[30vw] lg:!mt-40 !mb-20 grid grid-cols-1 lg:grid-cols-2 lg:text-left text-center">
            <AnimateContainer
              variants={fadeIn}
              rootMargin="0px 0px"
              className="w-full bg-primary text-white rounded-2xl p-[5%]"
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
              <h2 className="text-inherit">Secure your slot now!</h2>
              <div className="font-light">
                Reserve a slot today, and get a free subscription for 3 months.
              </div>
              <Button
                appearance="primary"
                className="bg-white text-primary md:w-auto p-4 px-8 hover:bg-white hover:scale-105 font-medium"
              >
                Register Now!
              </Button>
              <div>BE THE FIRST TO EXPERIENCE!</div>
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
        </div>
        <AnimateContainer variants={fadeIn}>
          <div
            className="bg-primary text-white md:min-h-screen flex flex-col flex-none py-[10%] px-[5%] relative space-y-12 text-lg text-center justify-center"
            id="contact-us"
          >
            <div className="space-y-2">
              <h1 className="text-inherit font-semibold relative w-fit m-auto after:content-[''] after:absolute after:w-[40%] after:h-full after:border-b-2 border-b-white after:left-[50%] after:-translate-x-[50%] after:top-0 after:z-10">
                Get in touch
              </h1>
              <div>Ask us anything or just say hi</div>
            </div>
            <Form
              form={ContactForm}
              layout="vertical"
              onFinish={(values) => {
                console.log(values);
              }}
              className="w-full text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="first_name"
                  rules={[
                    { required: true, message: "First Name is required" },
                  ]}
                  required={false}
                >
                  <Input
                    id="first_name"
                    placeholder="First Name"
                    className="!bg-transparent text-white !border-white hover:!border-primary-300 focus:!border-primary-300 !shadow-none placeholder:!text-primary-300"
                  />
                </Form.Item>
                <Form.Item
                  name="last_name"
                  rules={[{ required: true, message: "Last Name is required" }]}
                  required={false}
                >
                  <Input
                    id="last_name"
                    placeholder="Last Name"
                    className="!bg-transparent text-white !border-white hover:!border-primary-300 focus:!border-primary-300 !shadow-none placeholder:!text-primary-300"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Email Address is required" },
                  ]}
                  required={false}
                >
                  <Input
                    id="email"
                    placeholder="Email Address"
                    className="!bg-transparent text-white !border-white hover:!border-primary-300 focus:!border-primary-300 !shadow-none placeholder:!text-primary-300"
                  />
                </Form.Item>
                <Form.Item
                  name="contact_number"
                  rules={[
                    { required: true, message: "Contact Number is required" },
                  ]}
                  required={false}
                >
                  <Input
                    id="contact_number"
                    placeholder="Contact Number"
                    className="!bg-transparent text-white !border-white hover:!border-primary-300 focus:!border-primary-300 !shadow-none placeholder:!text-primary-300"
                  />
                </Form.Item>
                <Form.Item
                  name="message"
                  rules={[{ required: true, message: "Message is required" }]}
                  required={false}
                  className="md:col-span-2"
                >
                  <TextArea
                    id="message"
                    placeholder="Your Message here"
                    rows={8}
                    className="!bg-transparent !text-white !border-white hover:!border-primary-300 focus:!border-primary-300 !shadow-none placeholder:!text-primary-300"
                  />
                </Form.Item>
              </div>
              <div className="flex justify-center items-center mt-8">
                <Button
                  type="submit"
                  appearance="primary"
                  className="!bg-white text-primary md:max-w-[15rem] p-4 md:p-6 hover:bg-white hover:scale-105 font-medium"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </AnimateContainer>
        <AnimateContainer variants={fadeIn} rootMargin="0px 0px">
          <div className="bg-white p-8 flex justify-center items-center gap-8 flex-none !m-0">
            <Button
              appearance="link"
              className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
            >
              <FaFacebookF />
            </Button>
            <Button
              appearance="link"
              className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
            >
              <FaTwitter />
            </Button>
            <Button
              appearance="link"
              className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
            >
              <FaInstagram />
            </Button>
          </div>
        </AnimateContainer>
        <AnimateContainer variants={fadeIn} rootMargin="0px 0px">
          <div className="text-white bg-blumine p-4 text-center !m-0">
            ©2022 Copyright | INDX Dental
          </div>
        </AnimateContainer>
      </PageContainer>
    </>
  );
}
