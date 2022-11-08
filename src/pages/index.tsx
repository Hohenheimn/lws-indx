import React from "react";
import { PageContainer } from "../components/animation";
import DatePicker from "antd/lib/date-picker";
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
        <div>
          <DatePicker.RangePicker />
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
