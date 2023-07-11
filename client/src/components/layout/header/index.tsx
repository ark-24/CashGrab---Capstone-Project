import React, { useContext, useEffect, useState } from "react";
import { useGetIdentity } from "@pankod/refine-core";
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Avatar,
} from "@pankod/refine-mui";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import '../../../index.css'

import { ColorModeContext } from "contexts";

import { createTheme, ThemeProvider } from '@mui/material';
const theme = createTheme({
  typography: {
    fontFamily: [
      'Nunito Sans',
      'cursive',
    ].join(','),
  },});


export const Header: React.FC = () => {
  const { mode, setMode } = useContext(ColorModeContext);
  const user = localStorage.getItem("user");
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/v1/users/${user}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
        // Process and set the transactions in the component state or tableQueryResult
      } catch (error) {
        console.log(error);
      }
    };

    // Call the fetchData function to fetch transactions
    fetchData();
  }, [user]);

  return (
    <AppBar color="default" position="sticky" elevation={0} sx={{ background: '#ffffff' }}>
      <Toolbar>
      <Stack
          direction="row"
          width="100%"
          justifyContent="space-between" // Center the content horizontally
          // alignItems="center"
        >
        <Stack
          direction="row"
          width="50%"
          justifyContent="flex-start" // Center the content horizontally
          alignItems="center"
        >
          <ThemeProvider theme={theme}>
          <Typography fontSize={26} fontWeight="700" sx={{ color: "red" }} variant="subtitle2">
            Cash
          </Typography>
          <Typography fontSize={26} fontWeight="700" sx={{ color: "#F3EC0E" }} variant="subtitle2">
            Grab
          </Typography>
          </ThemeProvider>
        </Stack>

          <Stack
            direction="row"
          width="50%"
            gap="16px"
            alignItems="center"
            justifyContent="end"
          >
            {userData?.name && (
              <Typography justifyContent="right" variant="subtitle2">{userData?.name}</Typography>
            )}
            {userData?.avatar && (
              <Avatar src={userData?.avatar} alt={userData?.name} />
            )}
          </Stack>
          </Stack>
      </Toolbar>
    </AppBar>
  );
};
