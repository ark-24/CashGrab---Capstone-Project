import { ApexOptions } from "apexcharts";
import moment from "moment";

export const TotalRevenueSeries = [
  {
    name: "Last Month",
    data: [183, 124, 115, 85, 143, 143, 96],
  },
  // {
  //   name: "Running Month",
  //   data: [95, 84, 72, 44, 108, 108, 47],
  // },
];

let days = [];
let today = moment();
for (let i = 0; i < 7; i++) {
   let day = moment(today).subtract(i, 'days');
   days.push(day.format('MMMM Do'));
}


export const TotalRevenueOptions: ApexOptions = {
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  colors: ["#D2042D", "#CFC8FF"],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: "55%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  stroke: {
    colors: ["transparent"],
    width: 4,
  },
  xaxis: {
    categories: days.reverse()
  },
  yaxis: {
    title: {
      text: "$ ",
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
  },
  tooltip: {
    y: {
      formatter(val: number) {
        return `$ ${val}`;
      },
    },
  },
};
