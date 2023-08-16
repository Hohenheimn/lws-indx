import React from "react";
import { Bar } from "react-chartjs-2";

type Props = {
  dataSet: number[];
};

const HorizontalProgressLine = ({ dataSet }: Props) => {
  const labels = ["Men", "Women"];
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataSet,
        backgroundColor: ["#27bec8", "#ffaeb0"],
        borderColor: ["#27bec8", "#ffaeb0"],
        borderWidth: 1,
        borderSkipped: false,
        borderRadius: 5,
        barPercentage: 0.2,
        categoryPercentage: 1.5,
      },
    ],
  };

  const options = {
    labels: true,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          lineWidth: 0.9,
        },
        ticks: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333333",
        },
      },
      x: {
        ticks: {
          display: false,
        },
        grid: {
          display: true,
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default HorizontalProgressLine;
