import { Menu } from "@headlessui/react";
import { Float } from "@headlessui-float/react";

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  overlayMenu: Array<{
    label: string;
  }>;
}

export function Dropdown({
  children,
  className,
  overlayMenu,
  ...rest
}: DropdownProps) {
  return (
    <div className="relative">
      <Menu>
        <Float
          placement="top"
          enter="transition duration-200 ease-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition duration-150 ease-in"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
          flip
          offset={6}
          className="[&>div]:w-full"
        >
          <Menu.Button>{children}</Menu.Button>
          <Menu.Items className="min-w-[10rem] w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden focus:outline-none">
            {overlayMenu.map(({ label }) => {
              return (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`block w-full p-4 text-left text-base transition tracking-wider font-medium ${
                        active ? "bg-primary-500 text-white" : ""
                      }`}
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
