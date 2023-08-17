import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { topProcedures } from "@src/pages/admin/clinic-management/clinic-analytics";

type Props = {
  topProcedures?: topProcedures[];
};

const DoughnutChart = ({ topProcedures }: Props) => {
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    setTotalCount(0);
    let Count = 0;
    topProcedures?.map((item) => {
      Count = Number(Count) + Number(item.count);
    });
    console.log(Count);
    setTotalCount(Count);
  }, [topProcedures]);
  const topProceduresWithColor = topProcedures?.map((item, index) => {
    let color = "";
    if (index === 0) {
      color = "#939daf";
    }
    if (index === 1) {
      color = "#afdabd";
    }
    if (index === 2) {
      color = "#2dc5cc";
    }
    if (index === 3) {
      color = "#ff8a8e ";
    }
    if (index === 4) {
      color = "#214a80";
    }
    if (index === 5) {
      color = "#45cca7";
    }
    return {
      ...item,
      color: color,
    };
  });
  const data = {
    labels: topProceduresWithColor?.map((item) => item.procedure_name),
    datasets: [
      {
        data: topProceduresWithColor?.map((item) => item.count),
        backgroundColor: topProceduresWithColor?.map((item) => item.color),
        spacing: 4,
        borderRadius: 5,
        weight: 1,
      },
    ],
  };
  const options = {
    cutoutPercentage: 150,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    layout: {
      padding: 10, // Adjust the padding to make space for center text
    },
    elements: {
      center: {
        text: "Total",
        fontStyle: "Helvetica",
      },
    },
  };

  return (
    <ul className=" flex justify-between items-center">
      <li className=" w-[38%]">
        <div className=" relative">
          <div className=" font-bold text-primary-500 text-lg absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            {totalCount}
          </div>
          <Doughnut data={data} options={options} />
        </div>
      </li>
      <li className=" w-[60%]">
        <ul className=" list-disc space-y-2">
          {topProceduresWithColor?.map((item, index: number) => (
            <li
              key={index}
              style={{ color: item.color }}
              className={`flex justify-between space-x-1`}
            >
              <p>{item.procedure_name}</p>{" "}
              <p className=" text-[#333333]">{item.count}</p>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  );
};

export default DoughnutChart;
