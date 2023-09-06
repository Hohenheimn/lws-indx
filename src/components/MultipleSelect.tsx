import React from "react";
import { Select } from "antd";

type Props = {
  Selection: string[] | number[];
  id: any;
  placeholder: string;
};

export default function MultipleSelect({
  id,
  Selection,
  placeholder,
  ...rest
}: Props) {
  return (
    <Select
      id={id}
      placeholder={placeholder}
      {...rest}
      mode="multiple"
      className=" shadow-md"
    >
      {Selection.map((item, index) => (
        <Select.Option key={index} value={item}>
          {item}
        </Select.Option>
      ))}
    </Select>
  );
}
