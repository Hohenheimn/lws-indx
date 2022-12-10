import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiFillCaretDown } from "react-icons/ai";
import Dropdown from "../components/Dropdown";
import { destroyCookie, setCookie } from "nookies";
import { notification, Menu } from "antd";
import MobileDrawer from "./MobileDrawer";
import { Context } from "../../utils/context/Provider";

interface SideBarProps extends React.HTMLAttributes<HTMLDivElement> {
  openMenus?: string;
}

type sideMenuProps = {
  label: string;
  link: string;
  show: boolean;
  disabled?: boolean;
  key?: string;
  subMenu?: Array<{
    subMenuLabel: string;
    subMenuLink: string;
    showSubMenu: boolean;
    disabledSubMenu?: boolean;
  }>;
};

const sideMenu = [
  {
    label: "Dashboard",
    link: "/",
    show: true,
  },
  {
    label: "Patient List",
    link: "/patient-list",
    show: true,
  },
  {
    label: "Clinic Management",
    link: "/clinic-management",
    key: "1",
    subMenu: [
      {
        subMenuLabel: "Clinic Analytics",
        subMenuLink: "clinic-analytics",
        showSubMenu: true,
      },
      {
        subMenuLabel: "Financials",
        subMenuLink: "financials",
        showSubMenu: true,
      },
      {
        subMenuLabel: "Inventory",
        subMenuLink: "inventory",
        showSubMenu: true,
      },
    ],
    show: true,
  },
  {
    label: "Settings",
    link: "/settings",
    key: "2",
    subMenu: [
      {
        subMenuLabel: "SMS Manager",
        subMenuLink: "sms-manager",
        showSubMenu: true,
      },
      {
        subMenuLabel: "Procedure Management",
        subMenuLink: "procedure-management",
        showSubMenu: true,
      },
      {
        subMenuLabel: "Prescription Management",
        subMenuLink: "prescription-management",
        showSubMenu: true,
      },
      {
        subMenuLabel: "Clinic Accounts",
        subMenuLink: "clinic-accounts",
        showSubMenu: true,
      },
      {
        subMenuLabel: "Branch Management",
        subMenuLink: "branch-management",
        showSubMenu: true,
      },
      {
        subMenuLabel: "Application Settings",
        subMenuLink: "application-settings",
        showSubMenu: true,
      },
    ],
    show: true,
  },
];

export const SideBar = ({ openMenus, ...rest }: SideBarProps) => {
  const router = useRouter();
  const { openDrawer, setOpenDrawer } = React.useContext(Context);
  let openedSubMenu = openMenus ? JSON.parse(openMenus) : [];

  return (
    <>
      asdf
      {/* <MobileDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        setOpenDrawer={(value: boolean) => setOpenDrawer(value)}
        openedSubMenu={openedSubMenu}
        menu={sideMenu}
        closable={false}
      />
      <div className="hidden md:flex flex-col">
        <div className="flex flex-col flex-auto bg-white shadow-lg w-[20rem] py-8">
          <div className="space-y-8 flex flex-col flex-1 relative">
            <div className="items-center h-12 w-full relative">
              <Image
                src="/images/logo.png"
                alt="random pics"
                fill
                sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                className="object-center object-contain"
              />
            </div>
            <div className="flex flex-col flex-auto overflow-auto relative ">
              <Menu
                mode="inline"
                selectedKeys={[`/${router.route.split("/")[1]}`, router.route]}
                defaultOpenKeys={openedSubMenu}
                className="styled-menu"
                onOpenChange={(e) =>
                  setCookie(null, "om", JSON.stringify(e), {
                    path: "/",
                  })
                }
              >
                {sideMenu.map(
                  ({ show, subMenu, link, label, disabled, key }: any) => {
                    if (!show) {
                      return null;
                    }
                    if (subMenu) {
                      return (
                        <Menu.SubMenu key={link} title={label}>
                          {subMenu.map(
                            ({
                              subMenuLink,
                              subMenuLabel,
                              disabledSubMenu,
                              showSubMenu,
                            }: any) => {
                              if (!showSubMenu) {
                                return null;
                              }
                              return (
                                <Menu.Item
                                  key={`${link}/${subMenuLink}`}
                                  onClick={() => {
                                    router.push(`${link}/${subMenuLink}`);
                                  }}
                                  disabled={disabledSubMenu}
                                  data-ping="normal"
                                  data-ping-type="primary"
                                >
                                  <div className="flex justify-between items-center gap-4">
                                    <div>{subMenuLabel}</div>
                                  </div>
                                </Menu.Item>
                              );
                            }
                          )}
                        </Menu.SubMenu>
                      );
                    }
                    return (
                      <Menu.Item
                        key={link}
                        onClick={() => {
                          router.push(link);
                        }}
                        disabled={disabled}
                        data-ping="normal"
                        data-ping-type="primary"
                      >
                        <div className="flex justify-between items-center gap-4">
                          <div>{label}</div>
                        </div>
                      </Menu.Item>
                    );
                  }
                )}
              </Menu>
            </div>
            <div className="flex justify-center align-middle z-100">
              <Dropdown
                overlayMenu={[
                  {
                    label: "My Profile",
                  },
                  {
                    label: "Logout",
                    onClick: () => {
                      destroyCookie(null, "a_t");
                      router.push(router.route);
                      notification.success({
                        message: "Logout Succesful",
                        description: "All done! Have a nice day!",
                      });
                    },
                  },
                ]}
                placement="right-end"
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
                  <div className="truncate font-semibold max-w-[70%]">
                    Kelscey Ortiz
                  </div>
                  <div>
                    <AiFillCaretDown className="text-gray-400" />
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default SideBar;
