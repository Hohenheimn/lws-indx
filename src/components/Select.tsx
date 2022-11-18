import React from "react";
import { Combobox, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { Float } from "@headlessui-float/react";
import { AiOutlineStop } from "react-icons/ai";
import { BiChevronUp } from "react-icons/bi";

type SelectOptionProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: Array<React.ReactNode>;
  label?: string;
  onChange?: any;
  name?: string;
}

const Option: React.FC<SelectOptionProps> = ({ children, value }) => {
  return (
    <Combobox.Option
      key={value}
      value={value}
      className="transition bg-white p-4 hover:bg-primary-500 hover:text-white cursor-pointer"
    >
      {children}
    </Combobox.Option>
  );
};

export function Select({
  children,
  className,
  onChange,
  label,
  id,
  ...rest
}: SelectProps) {
  const [selectedValue, setSelectedValue] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [isActive, setIsActive] = React.useState(false);

  const filteredChildren = children.filter(({ props: { value } }: any) => {
    return value.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <>
      <div className="relative w-full" id={id}>
        <Combobox
          value={isActive ? "" : selectedValue}
          onChange={(value) => {
            setSelectedValue(value);
            onChange(value);
            setQuery("");
          }}
        >
          {({ open, value, ...props }) => {
            return (
              <Float
                placement="bottom-start"
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                flip
                offset={6}
                className="relative w-full [&>div]:w-full"
                as="div"
              >
                <Combobox.Button className="w-full">
                  <div
                    className={`transition absolute inset-y-0 right-2 flex items-center text-gray-300 text-lg h-full`}
                  >
                    <AiOutlineStop
                      onClick={(e) => {
                        onChange("");
                        setSelectedValue("");
                        e.preventDefault();
                      }}
                      className={`transition ${
                        !value ? "opacity-0" : "opacity-1"
                      }`}
                    />
                    <BiChevronUp
                      className={`transition ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                  <Combobox.Input
                    key={open.toString()}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => {
                      setIsActive(false);
                    }}
                    displayValue={(value: string) => {
                      if (open) {
                        return "";
                      }

                      return value;
                    }}
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                    className={twMerge(
                      "transition focus:border-primary-500 focus:ring-primary-500 sm:text-sm placeholder:text-gray-300 p-4 bg-white border border-gray-300 shadow-md rounded-md w-full",
                      className
                    )}
                    {...rest}
                  />
                </Combobox.Button>
                <Combobox.Options className="max-h-60 overflow-auto shadow-lg border border-gray-300 bg-white rounded-md">
                  {filteredChildren}
                </Combobox.Options>
              </Float>
            );
          }}
        </Combobox>
      </div>
    </>
  );
}

Select.Option = Option;
