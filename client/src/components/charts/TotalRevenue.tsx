import { Box, Typography, Stack } from "@pankod/refine-mui";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { PieChartProps } from "interfaces/home";
import { ArrowCircleUpRounded } from "@mui/icons-material";

import { TotalRevenueOptions, TotalRevenueSeries } from "./chart.config";
import { ApexOptions } from "apexcharts";
import moment from "moment";
import { Console } from "console";

const TotalRevenue = () => {
  const user = localStorage.getItem("user");
  const [revenue, setRevenue] = useState<Array<number>>([]);
  const [revenueSeries, setRevenueSeries] = useState<any>();
  const [revenueTotal, setRevenueTotal] = useState<number>(0);
  const cutOffDate = moment().subtract(7, "days");

  const NoRevenueOptions: ApexOptions = {
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
      colors: ["#CFC8FF", "#D2042D"],

      width: 4,
    },
    xaxis: {
      categories: [],
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
          return `$ ${val} `;
        },
      },
    },
  };

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/v1/income/week/${user}`
        );
        const data = await response.json();
        setRevenue(data);
      } catch (error) {
        console.error(error);
      }
    };

    getTransaction();
  }, [user]);

  useEffect(() => {
    setRevenueSeries([
      {
        name: " Revenue",
        data: revenue,
      },
    ]);
    if (revenue) {
      setRevenueTotal(revenue?.reduce((acc, curr) => acc + curr, 0));
    }
  }, [revenue]);

  return (
    <Box
      p={4}
      flex={1}
      bgcolor="#fcfcfc"
      id="chart"
      display="flex"
      flexDirection="column"
      borderRadius="15px"
    >
      <Typography fontSize={18} fontWeight={600} color="#11142d">
        Weekly Revenue
      </Typography>

      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        <Typography fontSize={28} fontWeight={700} color="11142d">
          ${revenueTotal}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          {/* <ArrowCircleUpRounded sx={{ fontSize: 25, color: '#00FF02' }} /> */}
          <Stack>
            {/* <Typography fontSize={15} color="#00FF02">0.8%</Typography> */}
            {/* <Typography fontSize={13} color="#808191">Than last month</Typography> */}
          </Stack>
        </Stack>
      </Stack>

      {/* {revenue && revenueTotal > 0 ? */}
      <ReactApexChart
        series={[
          {
            name: "Revenue",
            data: revenue,
          },
        ]}
        type="bar"
        height={310}
        options={TotalRevenueOptions}
      />
      {/* :     <ReactApexChart series={[0,0,0,0,0,0,0]} type="bar" height={310} options={NoRevenueOptions} /> */}
      {/* } */}
    </Box>
  );
};

export default TotalRevenue;
