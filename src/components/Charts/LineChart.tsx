import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = () => {
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        data: [600, 500, 800, 320, 480, 500, 600, 680, 520, 80, 955, 123],
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
