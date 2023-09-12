import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = {
  items: string[];
  onClick: (value: string) => void;
  activeTab: string | undefined | string[];
  className?: string;
};

export default function Tab({ items, onClick, activeTab, className }: Props) {
  const [isTab, setTab] = useState(50);
  const tabContainer = useRef<any>();
  useEffect(() => {
    const ScrollWidth = tabContainer.current.scrollWidth;
    const tabContainerWidth = tabContainer.current.offsetWidth;
    const OverWidth = ScrollWidth - tabContainerWidth;
    setTab(OverWidth);
  }, []);
  return (
    <nav className={`tab-scroll bg-white w-full p-5 ${className}`}>
      <motion.div className=" w-full overflow-auto" ref={tabContainer}>
        <motion.ul
          drag="x"
          dragConstraints={{ right: 0, left: -isTab }}
          whileTap={{ cursor: "grabbing" }}
          className=" w-[200%] flex gap-4 ml-1"
        >
          {items.map((item, index) => (
            <li
              className={` ${activeTab === item &&
                " text-primary-500 scale-105"} whitespace-nowrap text-center cursor-pointer text-[.9rem] lg:text-[1rem] hover:text-primary-500 hover:scale-105 duration-200 ease-in-out`}
              key={index}
              onClick={() => onClick(item)}
            >
              {item}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </nav>
  );
}
