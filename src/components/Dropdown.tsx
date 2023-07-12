import { twMerge } from "tailwind-merge";
import { Float } from "@headlessui-float/react";
import { Menu } from "@headlessui/react";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "right"
    | "right-start"
    | "right-end"
    | "left"
    | "left-start"
    | "left-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end";
  overlayMenu: Array<{
    label: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }>;
}

export function Dropdown({
  children,
  className,
  overlayMenu,
  placement = "top",
}: DropdownProps) {
  return (
    <div className="relative w-full">
      <Menu>
        <Float
          placement={placement}
          enter="transition duration-200 ease-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition duration-150 ease-in"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
          flip
          offset={6}
          className={twMerge("[&>div]:w-full flex items-center")}
        >
          <Menu.Button className="w-full">{children}</Menu.Button>
          <Menu.Items
            className={twMerge(
              "min-w-[10rem] w-full bg-white border border-default rounded-md shadow-lg overflow-hidden focus:outline-none flex flex-col items-center justify-center",
              className
            )}
          >
            {overlayMenu.map(({ label, onClick }) => {
              return (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`block w-full p-4 text-left text-base transition tracking-wider font-normal ${
                        active ? "bg-primary-500 text-white" : ""
                      }`}
                      onClick={onClick}
                    >
                      {label}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Float>
      </Menu>
    </div>
  );
}

export default Dropdown;
