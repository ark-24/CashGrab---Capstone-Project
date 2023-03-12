import { Box, Typography, Stack } from '@pankod/refine-mui'
import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { PieChartProps } from 'interfaces/home'

const PieChart = ({title, value, series, colors} :  PieChartProps) => {
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
        <Stack direction="column">
            <Typography align="justify">{title}</Typography>
            <Typography align="left" fontSize={24} color="11142d" fontWeight={700} mt = 
            {1}> {value}</Typography>
        </Stack>
        <ReactApexChart options={{
            chart: {type: 'donut'},
            colors,
            legend: {show: false},
            dataLabels: {enabled: false},
        }}
        series={series}
        // labels={['50 dollar bills'," 5 dollar bills"]}
        type="donut"
        />
    </Box>
    )
}

export default PieChart