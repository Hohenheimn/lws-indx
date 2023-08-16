import React from "react";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = () => {
  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
    datasets: [
      {
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    layout: {
      padding: 20, // Adjust the padding to make space for center text
    },
    elements: {
      center: {
        text: "Total",
        fontStyle: "Helvetica",
        sidePadding: 20,
      },
    },
  };

  const textCenter = {
    id: "textCenter",
    beforeDatasetsDraw(chart: any, args: any, pluginsOptions: any) {
      const { ctx, data } = chart;
      ctx.save();
      ctx.font = "bolder 30px";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "text1",
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y
      );
    },
  };

  return (
    <ul className=" flex justify-between items-center">
      <li className=" w-[38%]">
        <Doughnut data={data} options={options} plugins={[textCenter]} />
      </li>
      <li className=" w-[60%]">
        <ul className=" list-disc space-y-2">
          <li className="flex justify-between space-x-1 text-blue-300">
            <p>Procedure 1</p> <p className=" text-[#333333]">50</p>
          </li>
          <li className="flex justify-between space-x-1 text-red-300">
            <p>Procedure 2</p> <p className=" text-[#333333]">50</p>
          </li>
          <li className="flex justify-between space-x-1 text-blue-500">
            <p>Procedure 3</p> <p className=" text-[#333333]">50</p>
          </li>
          <li className="flex justify-between space-x-1 text-green-500">
            <p>Procedure 4</p> <p className=" text-[#333333]">50</p>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default DoughnutChart;
