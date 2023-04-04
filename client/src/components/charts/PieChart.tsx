import { Box, Typography, Stack } from '@pankod/refine-mui'
import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'
import { PieChartProps } from 'interfaces/home'
import { Label } from '@mui/icons-material'


const PieChart = ({ title, colors }: PieChartProps) => {

  const [myBills, setBills] = useState<any>()

  const getTransaction = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/bills/`);
      const data = await response.json();
      setBills(JSON.stringify(data));
      //console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   getTransaction();


  // }, [])

  getTransaction();


  const obj = myBills && JSON.parse(myBills);
  console.log(obj)
  const mySeries = obj && Object.values(obj);
  console.log(mySeries);
  let cashBalance
  let total;
  let sum;
  if (mySeries) {
    mySeries.splice(0, 1)
    cashBalance = mySeries.splice(5, 1)
    mySeries.splice(6, 3)
    mySeries.splice(5, 1)


    console.log(mySeries);
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
      <Stack direction="column" display="flex">
        <Typography display="block" alignContent="left">{title}</Typography>
        <Typography textAlign="left" fontSize={24} color="11142d" fontWeight={700} mt=
          {1}> {sum}</Typography>
      </Stack>
      <ReactApexChart options={{
        chart: { type: 'donut' },
        colors,
        legend: { show: false },
        dataLabels: { enabled: true },
        labels: [" $5 dollar bills", "$10 bills", "$20 bills", '$50 bills', "$100 bills"],
      }}
        series={mySeries}
        labels={['50 dollar bills', " 5 dollar bills"]}
        type="donut"
      />
      <Typography> {total}</Typography>

    </Box>
  )
}

export default PieChart