import React from "react";
import { Line } from "react-chartjs-2";
import { totalMonthlyRevenue } from "@src/pages/admin/clinic-management/clinic-analytics";

type Props = {
  dataSet: totalMonthlyRevenue[];
};

const LineChart = ({ dataSet }: Props) => {
  const data = {
    labels: dataSet ? dataSet.map((item) => item.label) : [],
    datasets: [
      {
        data: dataSet ? dataSet.map((item) => item.count) : [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: [
          "rgba(180, 245, 247, 0.525)",
          "rgba(75, 192, 192, 1)",
        ],
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
