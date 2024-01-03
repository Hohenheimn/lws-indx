import { AiOutlineMenu } from "react-icons/ai";
import { BsCalendarMinus } from "react-icons/bs";

const CalendarTypeIcons = ({
  isCalendarType,
  setCalendarType,
}: {
  isCalendarType: string;
  setCalendarType: Function;
}) => {
  return (
    <div className=" flex justify-end space-x-2 mb-2">
      <AiOutlineMenu
        className={` ${
          isCalendarType === "simple" ? "text-primary-500" : "text-gray-400"
        } text-2xl cursor-pointer `}
        onClick={() => setCalendarType("simple")}
        id={`dashboard-${isCalendarType}-simple`}
      />
      <BsCalendarMinus
        className={` ${
          isCalendarType === "advance" ? "text-primary-500" : "text-gray-400"
        } text-gray-400 text-2xl cursor-pointer`}
        onClick={() => setCalendarType("advance")}
        id={`dashboard-${isCalendarType}-advance`}
      />
    </div>
  );
};

export default CalendarTypeIcons;
