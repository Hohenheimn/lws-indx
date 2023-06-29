import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiFillCaretDown } from "react-icons/ai";
import Dropdown from "../components/Dropdown";
import { destroyCookie, setCookie } from "nookies";
import { notification, Menu } from "antd";
import MobileDrawer from "./MobileDrawer";
import { Context } from "../../utils/context/Provider";
import Avatar from "../components/Avatar";
import { IoPersonOutline } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { RxHamburgerMenu } from "react-icons/rx";

interface SideMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  openMenus?: string;
  profile: any;
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

const sideMenu: Array<sideMenuProps> = [
  {
    label: "Dashboard",
    link: "/admin",
    show: true,
  },
  {
    label: "Patient List",
    link: "/admin/patient-list",
    show: true,
  },
  {
    label: "Clinic Management",
    link: "/admin/clinic-management",
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
    link: "/admin/settings",
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

export const SideMenu = ({ openMenus, profile, ...rest }: SideMenuProps) => {
  const router = useRouter();
  const { isDrawerOpen, setIsDrawerOpen } = React.useContext(Context);
  let [isImageError, setIsImageError] = React.useState(false);
  let openedSubMenu = openMenus ? JSON.parse(openMenus) : [];
  let [isSideMenuCollapsed, setIsSideMenuCollapsed] = React.useState(false);

  return (
    <>
      <MobileDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        setIsDrawerOpen={(value: boolean) => setIsDrawerOpen(value)}
        openedSubMenu={openedSubMenu}
        menu={sideMenu}
        closable={false}
      />
      <div
        className={twMerge(
          "relative hidden md:flex flex-row transition-all",
          isSideMenuCollapsed ? "min-w-0 max-w-0" : "max-w-full min-w-[20rem]"
        )}
      >
        <div className={"flex flex-col relative transition-all w-full"}>
          <div className="flex flex-col flex-auto bg-white shadow-lg w-full py-8 px-4">
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
                  selectedKeys={[
                    `/${router.route.split("/")[1]}/${
                      router.route.split("/")[2]
                    }`,
                    router.route,
                  ]}
                  defaultOpenKeys={openedSubMenu}
                  className="styled-menu"
                  onOpenChange={(e) =>
                    setCookie(null, "om", JSON.stringify(e), {
                      path: "/",
                      expires: 0,
                    })
                  }
                >
                  {sideMenu.map(
                    ({ show, subMenu, link, label, disabled, key }) => {
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
                              }) => {
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
                      onClick: () => {
                        router.push("/admin/profile");
                      },
                    },
                    {
                      label: "Logout",
                      onClick: () => {
                        destroyCookie(undefined, "a_t", { path: "/" });
                        router.reload();
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
                    <Avatar className="h-10 w-10 p-2 overflow-hidden relative border border-gray-300 avatar transition">
                      {!profile?.profile_picture || isImageError ? (
                        <IoPersonOutline className="h-full w-full text-white" />
                      ) : (
                        <Image
                          src={`${profile?.profile_picture}`}
                          alt="Profile Picture"
                          fill
                          sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                          className="object-center contain h-full w-full"
                          onError={() => {
                            setIsImageError(true);
                          }}
                        />
                      )}
                    </Avatar>
                    <div className="truncate font-semibold max-w-[70%]">
                      {profile?.first_name} {profile?.last_name}
                    </div>
                    <div>
                      <AiFillCaretDown className="text-gray-400" />
                    </div>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute top-0 left-full z-10 bg-primary bg-opacity-70 text-white p-2 text-2xl mt-8 cursor-pointer rounded-tr-md rounded-br-md"
          onClick={() => setIsSideMenuCollapsed((prevState) => !prevState)}
        >
          <RxHamburgerMenu />
        </div>
      </div>
    </>
  );
};

export default SideMenu;
