import React from "react";
import { Button } from "../components/Button";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiFillCaretDown } from "react-icons/ai";

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
      <div className="flex flex-col h-screen bg-white shadow-md min-w-[20rem] pt-[5rem] pb-8 px-4">
        <div className="space-y-5 flex-1">
          <div className="items-center">
            <h2 className="text-4xl font-bold text-center uppercase">Index</h2>
          </div>
          <div className="flex-1 flex-col space-y-5">
            {sideMenu.map(({ label, link }, index) => {
              return (
                <Button
                  onClick={() => router.push(link)}
                  className="text-left"
                  key={index}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-grow-0 items-center justify-center space-x-5 w-full">
          <div className="h-10 w-10 rounded-full overflow-hidden relative">
            <Image
              src="https://picsum.photos/200/300"
              alt="random pics"
              fill
              sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
              className="object-center"
            />
          </div>
          <div>Kelscey Ortiz</div>
          <div>
            <AiFillCaretDown />
          </div>
        </div>
      </div>
    </div>
  );
}
