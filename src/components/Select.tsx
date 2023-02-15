import React from "react";
import { Combobox, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { Float } from "@headlessui-float/react";
import { AiOutlineStop } from "react-icons/ai";
import { BiChevronUp } from "react-icons/bi";

type SelectOptionProps = {
  value: any;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  active?: boolean;
  lastChildRef?: any;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[];
  label?: string;
  onChange?: any;
  name?: string;
  value?: string;
  loading?: boolean;
  lastChildRef?: any;
  noFilter?: boolean;
  onSearch?: any;
  displayValueKey?: any;
}

const Option: React.FC<SelectOptionProps> = ({
  children,
  value,
  active,
  lastChildRef,
  onClick,
  ...rest
}) => {
  return (
    <Combobox.Option
      key={value}
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
  displayValueKey,
  ...rest
}: SelectProps) {
  const [selectedValue, setSelectedValue] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [isActive, setIsActive] = React.useState(false);

  let filteredTypeChildren = Array.isArray(children)
    ? children.filter((child: any) => {
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
        onChange(value);
        setSelectedValue(value);
        setQuery("");
      }}
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
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                open && e.preventDefault()
              }
            >
              <div
                className={`transition absolute inset-y-0 right-0 px-4 flex items-center text-casper-500 text-lg h-full`}
              >
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
                <BiChevronUp
                  className={`transition ${open ? "rotate-180" : "rotate-0"}`}
                />
              </div>
              <Combobox.Input
                key={open.toString()}
                onFocus={() => setIsActive(true)}
                onBlur={() => {
                  setQuery("");
                  setIsActive(false);
                }}
                displayValue={(value: string) => {
                  if (open) {
                    return "";
                  }
                  if (value) {
                    if (displayValueKey) {
                      return (
                        value[displayValueKey]?.charAt(0).toUpperCase() +
                        value[displayValueKey]?.slice(1)
                      );
                    } else {
                      return value?.charAt(0).toUpperCase() + value?.slice(1);
                    }
                  }

                  return "";
                }}
                onChange={(event) => {
                  if (onSearch) onSearch(event.target.value);
                  setQuery(event.target.value);
                }}
                className={twMerge(
                  "transition focus:ring-0 focus:border-primary-500 hover:border-primary-500 bg-white border border-default w-full rounded-[inherit] text-sm leading-[normal] p-4",
                  className
                )}
                {...rest}
              />
            </Combobox.Button>
            <Combobox.Options className="max-h-60 overflow-auto shadow-lg border border-default bg-white rounded-md">
              {childrenWithProps}
            </Combobox.Options>
          </Float>
        );
      }}
    </Combobox>
  );
}

Select.Option = Option;
