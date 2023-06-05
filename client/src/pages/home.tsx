import React, { useEffect, useState } from 'react'
import { useList } from '@pankod/refine-core'

import { CustomButton, PieChart, TotalRevenue } from 'components'
import { Box, Stack, Typography } from '@pankod/refine-mui'
const Home = () => {
  const [supportsBluetooth, setSupportsBluetooth] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(true);
  useEffect(() => {
    if (navigator.bluetooth) {
      setSupportsBluetooth(true);
    }
    console.log(supportsBluetooth)
  }, []);


  const onDisconnected = (event: { target: any }) => {
    alert(`The device ${event.target} is disconnected`);
    setIsDisconnected(true);
  }

  /**
   * Update the value shown on the web page when a notification is
   * received.
   */
  
  /**
   * Attempts to connect to a Bluetooth device and subscribe to
   * battery level readings using the battery service.
   */
  const connectToDeviceAndSubscribeToUpdates = async () => {
    try {
      // Search for Bluetooth devices that advertise a battery service
      const device = await navigator.bluetooth.requestDevice({
          filters: [{services: ['battery_service']}]
        });

      setIsDisconnected(false);
      if(device !== null && device.gatt !== undefined){
      // Add an event listener to detect when a device disconnects
      device.addEventListener('gattserverdisconnected', onDisconnected);

      // Try to connect to the remote GATT Server running on the Bluetooth device
      const server = await device.gatt.connect();

      // Get the battery service from the Bluetooth device
      const service = await server.getPrimaryService('battery_service');

      // Get the battery level characteristic from the Bluetooth device
      const characteristic = await service.getCharacteristic('battery_level');

      // Subscribe to battery level notifications
      characteristic.startNotifications();


      // Read the battery level value
      const reading = await characteristic.readValue();
      }

      // Show the initial reading on the web page
    } catch(error) {
      console.log(`There was an error: ${error}`);
    }
  };
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="11142D">
        Dashboard
      </Typography>
      

      <Box mt="20px" display="flex" flexWrap="wrap" gap={4}>
      {supportsBluetooth && isDisconnected &&
        <CustomButton  backgroundColor="#fcfcfc" title="bluetooth"color="#67be23" handleClick={connectToDeviceAndSubscribeToUpdates}>Connect to a Bluetooth device </CustomButton>
      }
        {/* <PieChart
          title="Number of Bills "
          colors={["#115DA8", "#B76EB8", "#85bb65", "#e82042", "#D0AC11"]} /> */}
      </Box>

      <Stack mt="25px" width="100%" direction={{ xs: 'column', lg: 'row' }} >

        <TotalRevenue />
      </Stack>
    </Box>
  )
}

export default Home;