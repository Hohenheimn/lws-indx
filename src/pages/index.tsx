import React from "react";
import { Space, Form, notification, Menu, Card } from "antd";

import { Input as Inp } from "antd";
import { Drawer } from "antd";
import axios from "axios";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Script from "next/script";
import {
  AiOutlineArrowDown,
  AiOutlineIdcard,
  AiOutlineUnlock,
} from "react-icons/ai";
import {
  BsCheckCircle,
  BsHandThumbsUp,
  BsInstagram,
  BsLinkedin,
  BsShieldLock,
} from "react-icons/bs";
import { CiMedal } from "react-icons/ci";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { GrLocal, GrMenu } from "react-icons/gr";
import { MdBrokenImage, MdRunningWithErrors } from "react-icons/md";
import { PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { twMerge } from "tailwind-merge";
import { AnimateContainer, PageContainer } from "@components/animation";
import {
  fadeIn,
  fadeInUp,
  stagger,
  zoomIn,
} from "@components/animation/animation";
import { countdownTimer } from "@components/animation/animation";
import Avatar from "@components/Avatar";
import { Button } from "@components/Button";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { useMutation } from "@tanstack/react-query";
import { postData } from "@utilities/api";

import { Context } from "@utilities/context/Provider";

import Layout from "../layout";

const { TextArea } = Inp;

type sideMenuProps = {
  label: string;
  link: string;
  appearance: string;
};

const registerUrl = {
  url: "/pre-register",
  label: "Pre-Register",
};
// const registerUrl = "/registration";

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
  // {
  //   label: "Login",
  //   link: "/enter-email",
  //   appearance: "primary",
  // },
  {
    label: registerUrl.label,
    link: registerUrl.url,
    appearance: "primary",
  },
];

const textArray = [
  "Fully secured EMR",
  "Keep your clinic records simple",
  "Easily import paper records to digital",
];
export function Website({ router }: any) {
  let [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  let [isHeaderActive, setIsHeaderActive] = React.useState(false);
  let [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  let [heroTextId, setHeroTextId] = React.useState(0);
  const { setIsAppLoading } = React.useContext(Context);
  const [ContactForm] = Form.useForm();

  React.useEffect(() => {
    setTimeout(() => {
      if (textArray.length === heroTextId + 1) {
        setHeroTextId(0);
      } else {
        setHeroTextId(heroTextId + 1);
      }
    }, 3000);
  }, [heroTextId]);

  const { mutate: contact } = useMutation(
    (payload: {}) =>
      postData({
        url: "/api/contact-us",
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: () => {
        setIsSuccessModalOpen(true);
        ContactForm.resetFields();
      },
    }
  );

  let heroText = textArray[heroTextId];

  return (
    <>
      <Script strategy="lazyOnload" id="indx-messenger-plugin">
        {`
            var chatbox = document.getElementById('fb-customer-chat');
            chatbox.setAttribute("page_id", "150654878314479");
            chatbox.setAttribute("attribution", "biz_inbox");

            window.fbAsyncInit = function() {
              FB.init({
                xfbml            : true,
                version          : 'v13.0'
              });
            };
      
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        `}
      </Script>
      <Drawer
        open={isDrawerOpen}
        closable={false}
        className="[&>.ant-drawer-content-wrapper]:max-xs:!w-full md:hidden"
      >
        <div className="flex flex-col flex-auto bg-white shadow-lg w-full h-full py-8">
          <div className="space-y-8 flex flex-col flex-1 relative">
            <div className="items-center h-12 w-full relative">
              <Image
                src="/images/logo.png"
                alt="Clinic Logo"
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
                      setIsDrawerOpen(false);
                    }}
                    className={appearance !== "link" ? "p-4" : ""}
                    id={`website-mobile-${link.replaceAll("/", "-")}`}
                  >
                    {label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Drawer>
      <Layout>
        <div
          className={twMerge(
            "fixed top-0 left-0 flex justify-between items-center py-4 px-[5%] w-full z-50 transition mr-6 duration-300",
            isHeaderActive ? "bg-white shadow-md" : "bg-transparent"
          )}
        >
          <div className="items-center h-16 w-32 relative">
            <Image
              src="/images/logo.png"
              alt="Clinic Logo"
              fill
              sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
              className="object-center object-contain cursor-pointer"
              onClick={() => router.push("#hero")}
            />
          </div>
          <div className="hidden md:flex gap-3 items-center">
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
                  id={`website-${link.replaceAll("/", "-")}`}
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
              onClick={() => setIsDrawerOpen(true)}
              id={"website-drawer"}
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
              setIsHeaderActive(true);
            } else {
              setIsHeaderActive(false);
            }
          }}
        >
          <div
            className="relative flex flex-col md:min-h-screen flex-none mt-[5rem] lg:mt-0 mb-8 shadow-[inset_0_-200px_150px_0_rgba(88,88,88,0.1)]"
            id="hero"
          >
            <div className=" justify-center h-auto lg:h-full w-full lg:max-w-[45rem] flex flex-col items-center lg:items-start lg:text-left text-center space-y-4 xs:space-y-8 p-[2%] xs:p-[5%]">
              <div className="flex flex-col lg:flex-auto justify-center">
                <AnimateContainer variants={fadeIn} className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="font-bold text-4xl xs:text-5xl">
                      Your Digital
                      <span className="text-primary font-semibold">
                        {" "}
                        Index Card
                      </span>
                    </h2>
                    <AnimatePresence mode="wait">
                      <AnimateContainer
                        variants={
                          textArray.length === heroTextId + 3
                            ? fadeIn
                            : countdownTimer
                        }
                        key={heroText}
                      >
                        <div className="xs:text-2xl text-blumine font-medium">
                          {heroText}
                        </div>
                      </AnimateContainer>
                    </AnimatePresence>
                  </div>
                  <div className="space-y-4">
                    <div>
                      Start running your dental clinic the simplest way. Easily
                      manage patient details, organize dental appointments, and
                      secure dental records with a smart clinic platform.
                    </div>
                    <div className="lg:m-0">
                      <Button
                        appearance="blumine"
                        className="w-full max-w-xs py-4"
                        // onClick={() => router.push("/registration")}
                        onClick={() => router.push(registerUrl.url)}
                        id={"website-register-1"}
                      >
                        {registerUrl.label}
                      </Button>
                    </div>
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
                <h2 className="font-semibold text-blumine">
                  We Understand Your Inconvenience
                </h2>
                <div>
                  Clinic management is a difficult task. Aside from usual
                  day-to-day patient struggles, dentists and clinic managers
                  also experience the following issues:
                </div>
              </div>
            </AnimateContainer>
            <AnimateContainer variants={fadeIn}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 text-center">
                <div className="space-y-4 flex flex-col justify-center items-center max-w-sm m-auto">
                  <Avatar className="bg-geraldine bg-opacity-40 h-24 w-24 text-4xl text-geraldine">
                    <MdBrokenImage />
                  </Avatar>
                  <h4 className="font-medium text-blumine">
                    Index cards are unreliable
                  </h4>
                  <div>
                    Dentists have been using index cards or paper records for
                    decades. However, these physical documents may get lost or
                    damaged which may lead to delays in treatment, misdiagnosis
                    and even time wastage for doing the entire recording process
                    all over again.
                  </div>
                </div>
                <div className="space-y-4 flex flex-col justify-center items-center max-w-sm m-auto">
                  <Avatar className="bg-geraldine bg-opacity-40 h-24 w-24 text-4xl text-geraldine">
                    <AiOutlineUnlock />
                  </Avatar>
                  <h4 className="font-medium text-blumine">
                    Unsecured paper records
                  </h4>
                  <div>
                    You might lose a lot of money and credibility if you do not
                    keep your patient records safe. Worse is that you might face
                    legal actions for leaking their data accidentally.
                  </div>
                </div>
                <div className="space-y-4 flex flex-col justify-center items-center max-w-sm m-auto">
                  <Avatar className="bg-geraldine bg-opacity-40 h-24 w-24 text-4xl text-geraldine">
                    <MdRunningWithErrors />
                  </Avatar>
                  <h4 className="font-medium text-blumine">
                    Paper records slow clinic operations
                  </h4>
                  <div>
                    {`Dental clinic is a fast-paced environment. You can't afford to lose valuable seconds and potential patients just because you're processing patient records manually.`}
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
                  <h2 className="text-blumine font-semibold">
                    INDX Takes Care of Your Clinic Activities
                  </h2>
                  <div>
                    INDX is a clinic management software that allows dentists to
                    run their clinics efficiently. It secures your records in
                    one place and lets you manage them easily. You can even
                    schedule appointments, access patient data, and track your
                    finances wherever you are! Let INDX help you take care of
                    your patients, clinic and practice. Focus on growing your
                    craft and maximize your profits while we take care of your
                    clinic activities with this simple, secured and easy-to-use
                    platform.
                  </div>
                  <Button
                    appearance="blumine"
                    className="md:w-auto py-4"
                    onClick={() => router.push("/registration")}
                    id={"website-register-get-started"}
                  >
                    Get Started
                  </Button>
                </div>
              </AnimateContainer>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-8 items-center text-center lg:text-left">
              <AnimateContainer variants={fadeIn}>
                <div className="space-y-4">
                  <h2 className="text-blumine font-semibold">
                    It’s time to choose INDX
                  </h2>
                  <div>
                    <div className="font-medium">Simple. Secured. Smart</div>
                    Our software gives you the simplest yet smartest tools for
                    your seamless dental clinic management experience.
                    <br />
                    <br />
                    <div className="font-medium text-blumine">
                      For Dental Clinic Managers
                    </div>
                    <br />
                    Running a dental clinic is never easy - from taking patient
                    records, managing day-to-day operations, to meeting business
                    targets. Most managers might even do all these tasks
                    manually leading to slower and inefficient clinic
                    operations.
                    <br />
                    <br />
                    If you’re guilty with the above practice, then you need a
                    partner to help you manage your clinic efficiently - like
                    INDX. <br />
                    <br />
                    With INDX, your dental clinic management duties are now
                    simpler while giving you more for your business. Track
                    patient records, book appointments, and manage your entire
                    clinic in one dashboard.
                    <br />
                    <br />
                    <div className="font-medium text-blumine">
                      For Dental Practitioners
                    </div>
                    <br />
                    Dentists also do a lot while inside their clinics. Aside
                    from providing the best dental care for your patients, you
                    must also do other tasks to fulfill your clinic duties.
                    That’s quite overwhelming for any practitioner doing
                    everything manually.
                    <br />
                    <br />
                    That’s why INDX Clinic Management software was uniquely
                    designed for dental practitioners who want to complete
                    multiple tasks without compromising their patients’ health
                    and safety.
                    <br />
                    <br />
                    Not only does INDX streamline your practice workflow, our
                    intuitive system increases your administrative efficiency,
                    saves you from time-consuming tasks, and helps you focus
                    more on what matters most - provide the best dental care
                    your patient needs.
                    <br />
                    <br />
                    Focus on your dental practice while we securely manage your
                    clinic activities for you.
                  </div>
                  <Button
                    appearance="blumine"
                    className="md:w-auto py-4"
                    onClick={() => router.push("/registration")}
                    id={"website-register-get-started-2"}
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
                  3 Smart Benefits of INDX for Your Clinic Needs
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
                    INDX is a fully-secured clinic management software with
                    patient data security as one of our utmost priorities. With
                    INDX, you are assured that your patient records are safely
                    stored in our high-security platform in accordance with data
                    healthcare compliance regulations.
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
                    User-Friendly and Simplified System
                  </h4>
                  <div>
                    Our goal is to provide you an easy-to-use clinic management
                    system. Our team of designers and engineers developed a
                    simple yet functional design to ensure your hassle-free
                    experience within the platform.
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
                    Start transforming your paper records to digital ones. We
                    understand that manual patient data recording has been used
                    for ages. That’s why we developed a feature to help you
                    easily migrate your paper records digitally.
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
                  Reserve a slot today, and get a free 3-month subscription from
                  us!
                </div>
                <Button
                  appearance="primary"
                  className="bg-white text-primary md:w-auto mt-8 p-4 px-8 hover:bg-white hover:scale-105 font-medium"
                  onClick={() => router.push(registerUrl.url)}
                  id={"website-register-2"}
                >
                  {registerUrl.label}
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
                        Reach Us for Questions
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
                            {
                              required: true,
                              message: "First Name is required",
                            },
                          ]}
                          required={false}
                        >
                          <Input
                            id="website-first_name"
                            placeholder="First Name"
                            className="shadow-none border-2"
                          />
                        </Form.Item>
                        <Form.Item
                          label="Last Name"
                          name="last_name"
                          rules={[
                            {
                              required: true,
                              message: "Last Name is required",
                            },
                          ]}
                          required={false}
                        >
                          <Input
                            id="website-last_name"
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
                            id="website-email-address"
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
                            placeholder="09XX-XXX-XXXXX"
                            patternChar="*"
                            format="****-***-****"
                            allowEmptyFormatting={false}
                            id="website-mobile-number"
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
                            id="website-message"
                            placeholder="Your message here"
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
                          id={"website-submit-contact"}
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
                id={"website-facebook"}
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
                id={"website-linkedin"}
              >
                <BsLinkedin />
              </Button>
              <Button
                appearance="link"
                className="text-3xl bg-primary p-4 rounded-full text-white hover:text-primary-300"
                onClick={() =>
                  window.open("https://www.instagram.com/indxhealth/", "_blank")
                }
                id={"website-instragram"}
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
              ©2023 Copyright | INDX Dental
            </div>
          </AnimateContainer>
        </PageContainer>
      </Layout>
      <Modal
        show={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        className="w-[70rem]"
      >
        <div className="space-y-12 text-center text-base max-w-[50rem] m-auto">
          <BsCheckCircle className="text-primary text-9xl m-auto" />
          <div>
            <h2 className="font-normal mb-2">Thank you!</h2>
            <div className="text-default-secondary">
              {`We've`} received your message and will respond within 24 hours.
              <br />
              In the meantime, make sure to follow us on social!
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
                    window.open(
                      "https://www.instagram.com/indxhealth/",
                      "_blank"
                    )
                  }
                >
                  <BsInstagram />
                </Button>
              </div>
            </AnimateContainer>
          </div>
          <Button
            appearance="primary"
            className="max-w-[20rem] p-4"
            onClick={() => {
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

export const getServerSideProps = async ({ req }: any) => {
  let subdomain =
    req.headers.host.split(".").length > 1
      ? req.headers.host.split(".")[0]
      : null;

  let domainExist = true;
  await axios
    .post(
      `${process.env.REACT_APP_API_BASE_URL}/api/domain-checker?api_key=${process.env.REACT_APP_API_KEY}`,
      {
        email: subdomain?.replace("www.", ""),
      }
    )
    .then((response) => {
      if (response.data) {
        domainExist = true;
      }
    })
    .catch((error) => {
      domainExist = false;
    });

  if (domainExist && subdomain !== "dev" && subdomain !== "staging") {
    return {
      redirect: {
        permanent: false,
        destination: "/admin",
      },
    };
  }

  return { props: {} };
};

export default Website;
