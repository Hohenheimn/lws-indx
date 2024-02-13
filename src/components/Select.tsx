import React from "react";
import { AiOutlineStop } from "react-icons/ai";
import { BiChevronUp } from "react-icons/bi";
import { twMerge } from "tailwind-merge";
import { Float } from "@headlessui-float/react";
import { Combobox, Transition } from "@headlessui/react";

type SelectOptionProps = {
  value: any;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  active?: boolean;
  lastChildRef?: any;
  displayValue?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[];
  label?: string;
  onChange?: any;
  name?: string;
  value?: any;
  loading?: boolean;
  lastChildRef?: any;
  noFilter?: boolean;
  onSearch?: any;
  disabled?: boolean;
  noData?: string;
  hideResetField?: boolean;
  infiniteSelect?: boolean;
}

const Option: React.FC<SelectOptionProps> = ({
  children,
  value,
  active,
  lastChildRef,
  onClick,
  displayValue,
  ...rest
}) => {
  return (
    <Combobox.Option
      value={value}
      className={twMerge(
        "transition bg-white p-4 hover:bg-primary-500 hover:text-white cursor-pointer text-sm",
        `${active ? "bg-primary-500 text-white" : ""}`
      )}
      onClick={onClick}
      {...rest}
    >
      <div ref={lastChildRef}>{children}</div>
    </Combobox.Option>
  );
};

export function Select({
  children,
  className,
  onChange,
  label,
  id,
  value,
  loading = false,
  noFilter = false,
  lastChildRef,
  onSearch,
  hideResetField,
  disabled,
  noData,
  infiniteSelect,
  ...rest
}: SelectProps) {
  let [selectedValue, setSelectedValue] = React.useState("");
  let [query, setQuery] = React.useState("");
  let [isActive, setIsActive] = React.useState(false);

  let childrenArray = React.Children.toArray(children);

  let filteredTypeChildren = Array.isArray(childrenArray)
    ? childrenArray.filter((child: any) => {
        return child;
      })
    : [];

  const filteredChildren: any = !noFilter
    ? filteredTypeChildren.filter(({ props }: any) => {
        return props?.children?.toLowerCase().includes(query.toLowerCase());
      })
    : filteredTypeChildren;

  let flattenChildren: any = Array.isArray(filteredChildren)
    ? filteredChildren.flat(Infinity)
    : filteredChildren;

  const childrenWithProps = React.Children.map(
    flattenChildren,
    (child: any) => {
      let isLastChild =
        Array.isArray(flattenChildren) &&
        flattenChildren?.slice(-1)?.pop()?.key === child?.key;

      if (React.isValidElement<any>(child)) {
        return React.cloneElement(child, {
          active: selectedValue === child.props.value,
          key: child.props.value,
          lastChildRef: isLastChild ? lastChildRef : null,
        });
      }
      return child;
    }
  );

  return (
    <Combobox
      value={value ?? selectedValue}
      onChange={(value) => {
        onChange && onChange(value);
        setSelectedValue(value);
        setQuery("");
      }}
      disabled={disabled}
    >
      {({ open, value }) => {
        return (
          <Float
            placement="bottom-start"
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            flip
            offset={6}
            className="relative w-full [&>div]:w-full"
            as="div"
            show={isActive}
          >
            <Combobox.Button
              className="w-full transition focus-within:border-primary-500 focus-within:shadow-input focus-within:ring-0 shadow rounded-md"
              id={id}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                open && e.preventDefault();
                setIsActive(true);
              }}
            >
              <div
                className={`transition absolute inset-y-0 right-0 px-4 flex items-center text-casper-500 text-lg h-full`}
              >
                {!hideResetField && (
                  <AiOutlineStop
                    onClick={(e) => {
                      onChange && onChange("");
                      setSelectedValue("");
                      e.preventDefault();
                    }}
                    className={`transition ${
                      !value
                        ? "opacity-0 pointer-events-none"
                        : "opacity-1 pointer-events-auto"
                    }`}
                  />
                )}

                <BiChevronUp
                  className={`transition ${open ? "rotate-180" : "rotate-0"}`}
                />
              </div>
              <Combobox.Input
                key={open.toString()}
                // onFocus={() => {
                //   setIsActive(true);
                // }}
                onClick={() => {
                  setIsActive(true);
                }}
                onBlur={() => {
                  setQuery("");
                  setIsActive(false);
                }}
                displayValue={(value: string) => {
                  let displayValue = flattenChildren.find(
                    (val: any) => val.props.value === value
                  )?.props?.displayValue;
                  if (open) {
                    return "";
                  }
                  if (selectedValue && !displayValue && infiniteSelect) {
                    return "loading...";
                  }
                  if (displayValue) {
                    return (
                      displayValue?.charAt(0).toUpperCase() +
                      displayValue?.slice(1)
                    );
                  }

                  if (value) {
                    return value;
                  }

                  return "";
                }}
                onChange={(event) => {
                  if (onSearch) onSearch(event.target.value);
                  setQuery(event.target.value);
                }}
                className={twMerge(
                  "transition focus:ring-0 focus:border-primary-500 hover:border-primary-500 disabled:bg-[#f5f5f5] disabled:pointer-events-none bg-white border border-default w-full rounded-[inherit] text-sm leading-[normal] p-4",
                  className
                )}
                {...rest}
              />
            </Combobox.Button>
            <Combobox.Options className="max-h-60 overflow-auto shadow-lg border border-default bg-white rounded-md">
              {childrenWithProps.length >= 1 ? (
                childrenWithProps
              ) : (
                <div
                  className="p-4 text-casper text-center"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  {noData ? noData : "No Data Found"}
                </div>
              )}
            </Combobox.Options>
          </Float>
        );
      }}
    </Combobox>
  );
}

Select.Option = Option;
