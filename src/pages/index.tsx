import React from "react";
import { PageContainer } from "../components/animation";
// import DatePicker from "antd/lib/date-picker";
import Card from "../components/Card";

const dummyData = [
  { content: "102", description: "Total Registered Users" },
  { content: "75", description: "Total Paid Subscribers" },
  { content: "329", description: "Total Patient Records" },
  { content: "10", description: "Total Cancelled Subscribers" },
];
export default function Dashboard() {
  return (
    <PageContainer>
      <div className="flex justify-between align-middle">
        <h3>Dashboard</h3>
        {/* <div>
          <DatePicker.RangePicker />
        </div> */}
        <div className="flex items-center justify-center">
          <div className="datepicker relative form-floating mb-3 xl:w-96">
            <input
              type="text"
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Select a date"
            />
            <label htmlFor="floatingInput" className="text-gray-700">
              Select a date
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6">
        {dummyData.map(({ content, description }, index) => {
          return (
            <Card key={index} className="text-center">
              <h4>{content}</h4>
              <div className="text-base max-w-[8rem] m-auto font-medium">
                {description}
              </div>
            </Card>
          );
        })}
      </div>
      <Card>
        <h6>Total Revenue</h6>
      </Card>
    </PageContainer>
  );
}
