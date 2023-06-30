import { Box, Typography, Stack } from '@pankod/refine-mui';
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { PieChartProps } from 'interfaces/home';
import { Label } from '@mui/icons-material';

const PieChart = ({ title, colors }: PieChartProps) => {
  const [myBills, setBills] = useState<any>(null);
  const user = localStorage.getItem("user");

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/bills/${user}`);
        const data = await response.json();
        setBills(JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    };

    getTransaction();
  }, [user]);

  console.log(JSON.stringify(myBills));

  const obj = myBills && JSON.parse(myBills);
  const mySeries = obj && Object.values(obj);
  mySeries?.splice(0, 1);
  let cashBalance;
  let total;
  let sum;
  let newTitle = "No cash";
  if (myBills && myBills !== "") {
    newTitle = title;
  }

  if (mySeries && mySeries.length > 0) {
    mySeries?.splice(0, 1);
    cashBalance = mySeries?.splice(5, 1)[0];
    mySeries?.splice(6, 3);
    mySeries?.splice(5, 1);

    sum = mySeries.reduce((acc: number, curr: number) => acc + curr, 0);
    total = `Total Cash in System: $${cashBalance}`;
  }

  return (
    <Box
      id="chart"
      flex={1}
      display="flex"
      bgcolor="#fcfcfc"
      flexDirection="row"
      justifyContent="center"
      pl={3.5}
      py={2}
      gap={2}
      borderRadius="15px"
      minHeight="110px"
      width="fit-content"
    >
      {cashBalance && cashBalance > 0 ? (
        <>
          <Stack direction="column" display="flex">
            <Typography display="block" sx={{ fontFamily: "inherit" }} fontSize={26} alignContent="left">
              {newTitle}
            </Typography>
            <Typography textAlign="left" fontSize={24} color="#11142d" variant="body2" fontWeight={700} mt={1}>
              {sum}
            </Typography>
          </Stack>
          <ReactApexChart
            options={{
              chart: { type: 'donut' },
              colors,
              legend: { show: false },
              dataLabels: { enabled: true },
              labels: [" $5 dollar bills", "$10 bills", "$20 bills", '$50 bills', "$100 bills"],
            }}
            series={mySeries}
            type="donut"
          />
        </>
      ) : (
        <>
          <Stack direction="column" display="flex">
            <Typography display="block" sx={{ fontFamily: "inherit" }} fontSize={26} alignContent="left">
              No cash 
            </Typography>
            <Typography textAlign="left" fontSize={24} color="#11142d" variant="body2" fontWeight={700} mt={1}>
              0
            </Typography>
          </Stack>
          <ReactApexChart
            options={{
              chart: { type: 'donut' },
              colors: ["white"],
              legend: { show: false },
              // dataLabels: { enabled: true },
              labels: ["0"],
            }}
            series={[1]}
            type="donut"
          />
        </>
      )}
      <Typography fontSize={26}>{total}</Typography>
    </Box>
  );
};

export default PieChart;
