import React from "react";
import { BsTrash } from "react-icons/bs";

type Props = {
  deleteHandler: () => void;
  label: string;
};

export default function DeleteButton({ deleteHandler, label }: Props) {
  return (
    <div className=" w-full flex justify-end">
      <p
        onClick={deleteHandler}
        className="cursor-pointer flex space-x-2 text-primary-500 border-b border-primary-500 pb-1"
      >
        <BsTrash className=" text-lg" />
        {label}
      </p>
    </div>
  );
}
