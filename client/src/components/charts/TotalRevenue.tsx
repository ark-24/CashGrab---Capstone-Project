
import { Box, Typography, Stack } from '@pankod/refine-mui'
import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { PieChartProps } from 'interfaces/home'
import { ArrowCircleUpRounded } from '@mui/icons-material'

import { TotalRevenueOptions, TotalRevenueSeries } from './chart.config'

const TotalRevenue = () => {
  const user = localStorage.getItem("user")
  const [revenue, setRevenue] = useState<Array<number>>([])
  const [revenueSeries, setRevenueSeries] = useState<any>();
  const [revenueTotal, setRevenueTotal] = useState<number>(0);



  useEffect(() => {
    const getTransaction = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/income/week/${user}`);
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
        name:" Last Week",
        data: revenue
      }
    ])
    setRevenueTotal(revenue.reduce((acc, curr) => acc + curr, 0));
  
  },[revenue])

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

      <Stack my="20px" direction="row" gap={4}
        flexWrap="wrap">
        <Typography fontSize={28}
          fontWeight={700} color="11142d">{revenueTotal}</Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          {/* <ArrowCircleUpRounded sx={{ fontSize: 25, color: '#00FF02' }} /> */}
          <Stack>
            {/* <Typography fontSize={15} color="#00FF02">0.8%</Typography> */}
            {/* <Typography fontSize={13} color="#808191">Than last month</Typography> */}

          </Stack>
        </Stack>
      </Stack>


      <ReactApexChart series={revenueSeries} type="bar" height={310} options={TotalRevenueOptions} />
    </Box>
  )
}

export default TotalRevenue