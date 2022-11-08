import React from "react";
import { Button } from "../components/Button";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiFillCaretDown } from "react-icons/ai";
import { Menu } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import Dropdown from "../components/Dropdown";

const sideMenu = [
  {
    label: "Dashboard",
    link: "/",
  },
  {
    label: "Doctor Management",
    link: "/doctor-management",
  },
  {
    label: "Admin Management",
    link: "/admin-management",
  },
  {
    label: "Account Types",
    link: "/account-types",
  },
  {
    label: "Account Profile",
    link: "/account-profile",
  },
];

export default function SideBar() {
  const router = useRouter();

  return (
    <div className="hidden md:block">
      <div className="flex flex-col h-screen overflow-y-auto overflow-x-hidden bg-white shadow-lg w-[20rem] pt-14 pb-7 px-4">
        <div className="space-y-5 flex-1">
          <div className="items-center h-10 w-full relative mb-14">
            <Image
              src="/images/logo.png"
              alt="random pics"
              fill
              sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
              className="object-center object-contain"
            />
          </div>
          <div className="flex-1 flex-col space-y-5">
            {sideMenu.map(({ label, link }, index) => {
              const activeRoute = `/${router.route.split("/")[1]}` === link;
              return (
                <Button
                  onClick={() => router.push(link)}
                  className={`text-left px-8 py-3 text-lg font-medium border-none ${
                    !activeRoute &&
                    "bg-transparent text-default-text hover:text-white shadow-none min-[172px]"
                  }`}
                  key={index}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* <Button.Group>
          <Button>asdf</Button>
          <Button>asdf</Button>
          <Button>asdf</Button>
        </Button.Group> */}

        <div className="flex justify-center align-middle">
          <Dropdown
            overlayMenu={[
              {
                label: "Information",
              },
              {
                label: "Edit Profile",
              },
              {
                label: "Logout",
              },
            ]}
          >
            <div className="flex flex-grow-0 items-center justify-center w-full cursor-pointer text-default-text text-base space-x-4">
              <div className="relative w-10 h-10">
                <Image
                  src="https://picsum.photos/500/500"
                  alt="random pics"
                  fill
                  sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                  className="object-center rounded-full"
                />
              </div>
              <div className="truncate font-medium max-w-[70%]">
                Kelscey Ortiz
              </div>
              <div>
                <AiFillCaretDown />
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
