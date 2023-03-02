import React from "react";
import { Combobox, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { Float } from "@headlessui-float/react";
import { Button } from "./Button";

type AutoCompleteOptionProps = {
  value: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  active?: boolean;
  lastChildRef?: any;
  displayValue?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};

interface AutoCompleteProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[];
  label?: string;
  onChange?: any;
  name?: string;
  value?: string;
  loading?: boolean;
  lastChildRef?: any;
  customRender?: React.ReactElement;
  noFilter?: boolean;
  disabled?: boolean;
  onSearch?: any;
  noData?: string;
}

const Option: React.FC<AutoCompleteOptionProps> = ({
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

export function AutoComplete({
  children,
  className,
  onChange,
  onSearch,
  label,
  id,
  value,
  loading = false,
  noFilter = false,
  lastChildRef,
  customRender,
  noData,
  disabled,
  ...rest
}: AutoCompleteProps) {
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
            <Combobox.Input
              key={open.toString()}
              onFocus={() =>
                selectedValue || value ? setIsActive(true) : setIsActive(false)
              }
              onBlur={() => {
                setIsActive(false);
              }}
              displayValue={(value: string) => {
                let displayValue = flattenChildren.find(
                  (val: any) => val.props.value === value
                )?.props?.displayValue;

                if (open) {
                  return "";
                }
                if (displayValue) {
                  return (
                    displayValue?.charAt(0).toUpperCase() +
                    displayValue?.slice(1)
                  );
                }

                if (value) {
                  return value;
                  // return value?.charAt(0).toUpperCase() + value?.slice(1);
                }

                return "";
              }}
              onChange={(event) => {
                if (onSearch) onSearch(event.target.value);
                setQuery(event.target.value);
                event.target.value ? setIsActive(true) : setIsActive(false);
              }}
              className={twMerge(
                "transition focus:ring-0 focus:border-primary-500 hover:border-primary-500 bg-white border border-default w-full rounded-md shadow text-sm leading-[normal] p-4",
                className
              )}
              {...rest}
            />
            <Combobox.Options className="max-h-60 overflow-auto shadow-lg border border-default bg-white rounded-md">
              {childrenWithProps.length > 0 ? (
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
              {customRender}
            </Combobox.Options>
          </Float>
        );
      }}
    </Combobox>
  );
}

AutoComplete.Option = Option;
