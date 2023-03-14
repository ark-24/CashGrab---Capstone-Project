import React from 'react'
import {useList} from '@pankod/refine-core'

import { PieChart,TotalRevenue } from 'components'
import { Box,Typography } from '@pankod/refine-mui'
const Home = () => {
  return (
    <Box>
        <Typography fontSize={25} fontWeight={700} color="11142D">
            Dashboard
        </Typography>

        <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
            <PieChart 
            title="Bill Denominations"
            value={15}
            series={[20,20,20,20,20]}
            colors={["#e82042","#115DA8", "#7ABA7A", "#B76EB8", "#D0AC11"]}/>
        </Box>
    </Box>
  )
}

export default Home;