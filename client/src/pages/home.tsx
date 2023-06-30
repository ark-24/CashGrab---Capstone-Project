import React, { useEffect, useState } from 'react'
import { useList } from '@pankod/refine-core'

import { CustomButton, PieChart, TotalRevenue } from 'components'
import { Box, Stack, Typography } from '@pankod/refine-mui'
const Home = () => {
 
const  getData = async () => {
  const response = await fetch(
    "http://localhost:8080/api/v1/income/week"
  );

  if (response.ok) {
    const data = await response.json();
    console.log(JSON.parse(JSON.stringify(data)));
  }
}
  /**
   * Update the value shown on the web page when a notification is
   * received.
   */
  
  /**
   * Attempts to connect to a Bluetooth device and subscribe to
   * battery level readings using the battery service.
   */
  getData()

  
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="11142D">
        Dashboard
      </Typography>
      

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
      
        <PieChart
          title="Number of Bills "
          colors={["#115DA8", "#B76EB8", "#85bb65", "#e82042", "#D0AC11"]} />
      </Box>

      <Stack mt="25px" width="100%" direction={{ xs: 'column', lg: 'row' }} >

        <TotalRevenue />
      </Stack>
    </Box>
  )
}

export default Home;