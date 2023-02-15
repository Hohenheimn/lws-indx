import React from "react";
import { Button } from "../components/Button";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiFillCaretDown } from "react-icons/ai";
import Dropdown from "../components/Dropdown";
import { destroyCookie, setCookie } from "nookies";
import { notification, Drawer, Menu } from "antd";

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

interface MobileDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  closable?: boolean;
  openedSubMenu: string[];
  menu: Array<sideMenuProps>;
  onClose: any;
  setIsDrawerOpen: any;
}

export const MobileDrawer = ({
  menu,
  openedSubMenu,
  setIsDrawerOpen,
  ...rest
}: MobileDrawerProps) => {
  const router = useRouter();
  return (
    <Drawer {...rest} className="block md:hidden">
      <div className="flex flex-col flex-auto bg-white shadow-lg w-full h-full py-8">
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
              selectedKeys={[router.route]}
              defaultOpenKeys={openedSubMenu}
              className="styled-menu"
              onOpenChange={(e) =>
                setCookie(null, "om", JSON.stringify(e), {
                  path: "/",
                })
              }
              onSelect={() => setIsDrawerOpen(false)}
            >
              {menu.map(({ show, subMenu, link, label, disabled, key }) => {
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
              })}
            </Menu>
          </div>
          <div className="flex justify-center align-middle z-100 px-8">
            <Dropdown
              overlayMenu={[
                {
                  label: "My Profile",
                },
                {
                  label: "Logout",
                  onClick: () => {
                    destroyCookie(null, "a_t", { path: "/" });
                    router.reload();
                    notification.success({
                      message: "Logout Succesful",
                      description: "All done! Have a nice day!",
                    });
                  },
                },
              ]}
              placement="top"
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
    </Drawer>
  );
};

export default MobileDrawer;
