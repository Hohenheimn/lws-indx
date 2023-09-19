import React, { useEffect, useRef, useState } from "react";

type props = {
  children: React.ReactNode;
  className: string;
};
export default function TLModal({ children, className }: props) {
  const elementRef: any = useRef(null);
  const [isSameHeight, setIsSameHeight] = useState(false);

  useEffect(() => {
    const windowHeight = window.innerHeight;
    const elementHeight = elementRef?.current?.offsetHeight;
    const HandlerResize = () => {
      if (windowHeight - 50 <= elementHeight) {
        setIsSameHeight(true);
      } else {
        setIsSameHeight(false);
      }
    };
    window.addEventListener("resize", HandlerResize);
    HandlerResize();
    return () => {
      window.removeEventListener("resize", HandlerResize);
    };
  });
  return (
    <div
      className={`${className} fixed top-0 left-0 bg-[#00000085] overflow-auto h-screen w-screen py-10 flex justify-center ${
        isSameHeight ? "items-start" : "items-center"
      }`}
    >
      <section ref={elementRef} className={`p-10 bg-white rounded-lg`}>
        {children}
      </section>
    </div>
  );
}
