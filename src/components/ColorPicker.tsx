import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { ColorResult, SketchPicker } from "react-color";

import { fadeIn } from "./animation/animation";
import Input from "./Input";

type Props = {
  onChange: (value: string) => void;
  id?: any;
  disabled?: boolean;
};

export default function ColorPicker({
  id,
  onChange,
  disabled,
  ...rest
}: Props) {
  const [show, setShow] = useState(false);
  const restValue: any = rest;
  // close by clicking outside
  const Container = useRef<any>();

  useEffect(() => {
    const clickOutSide = (e: any) => {
      if (!Container.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", clickOutSide);
    return () => {
      document.removeEventListener("mousedown", clickOutSide);
    };
  });

  const onChangeHandler = (
    color: typeof ColorResult,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onChange(color.hex);
  };

  return (
    <div className=" flex gap-3 relative z-20" ref={Container}>
      <div className=" w-full relative ">
        <Input
          {...rest}
          disabled={disabled}
          id={id}
          placeholder="Pick Color"
          value={restValue?.value}
          onClick={() => setShow(true)}
        />
        {/* <input type="color" /> */}
        <div
          style={{
            backgroundColor: restValue.value || "white",
          }}
          className=" w-5 h-5 rounded-full border absolute top-[50%] right-3 translate-y-[-50%]"
        ></div>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
            className=" absolute bottom-[110%] inline-block right-0 bg-white shadow-md"
          >
            <div className=" w-full">
              <SketchPicker
                color={restValue?.value}
                onChangeComplete={onChangeHandler}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
