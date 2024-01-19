import React, { useRef } from "react";
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
    <div className=" w-full" id="multilple-dropdown">
      <Select
        id={id}
        placeholder={placeholder}
        {...rest}
        mode="multiple"
        allowClear
        className=" shadow-sm"
        getPopupContainer={() => document.getElementById("multilple-dropdown")!}
      >
        {Selection.map((item, index) => (
          <Select.Option key={index} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
