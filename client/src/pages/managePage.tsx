import { Add } from "@mui/icons-material";
import { useTable } from "@pankod/refine-core";
import {
  Box,
  DataGrid,
  GridColDef,
  Stack,
  Typography,
} from "@pankod/refine-mui";
import { CustomButton } from "components";
import React, { useEffect, useState } from "react";
import CreateIncomeStatement from "./createIncomeStatement";
import { Grid, Button } from '@mui/material';
import AddEmployee from "./addEmployee";
import AddItem from "./addItems";

const ManagePage = () => {
  const [itemOpen, setItemOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);


  const handleEmployeeClickOpen = () => {
    setEmployeeOpen(true);
  };

  const handleItemClickOpen = () => {
    setItemOpen(true);
  };

  const handleItemClose = () => {
    setItemOpen(false);
  };

  const handleEmployeeClose = () => {
    setEmployeeOpen(false);
  };

  const {
    tableQueryResult: {  data: employeeData },
  } = useTable({
    hasPagination: false,
  });
  const allEmployees = employeeData?.data ?? [];


  const {
    tableQueryResult: { data: itemData, isLoading, isError },
  } = useTable({
    resource: "items",
    hasPagination: false,
  });
  const allItems = itemData?.data ?? [];



  if (isLoading) return <Typography>Loading ...</Typography>;
  if (isError) return <Typography>Error ...</Typography>;

  const employeeColumns: GridColDef[] = [
    //{ field: 'id', headerName: 'ID', width: 90 },
    {
      field: "firstName",
      headerName: "First Name",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      type: "number",
      width: 200,

      editable: true,
      headerAlign: "center",
      align: "center",
    },
  ];

  const itemColumns: GridColDef[] = [
    //{ field: 'id', headerName: 'ID', width: 90 },
    {
      field: "itemName",
      headerName: "Item Name",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      width: 200,
      editable: true,
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontSize={25} fontWeight={700} color="#11142d">
        
          Employee Management
        </Typography>
        <Typography fontSize={25} fontWeight={700} color="#11142d" justifyContent="right">
        
        Item Management
      </Typography>
      </Stack>

      <Grid container justifyContent="space-between">
      <Grid item>
        <CustomButton
          title="Employees"
          handleClick={handleEmployeeClickOpen}
          backgroundColor="#D2042D"
          color="#F3EC0E"
          icon={<Add />}
        />
      </Grid>
      <Grid item>
        <CustomButton
          title="items"
          handleClick={handleItemClickOpen}
          backgroundColor="#D2042D"
          color="#F3EC0E"
          icon={<Add />}
        />
      </Grid>
    </Grid>
      <AddEmployee isOpen={employeeOpen} onClose={handleEmployeeClose} />
      <AddItem isOpen={itemOpen} onClose={handleItemClose} />


      <Box
        mt="20px"
        sx={{ display: "flex", flexWrap: "wrap", gap: 3, height: "500px" }}
      >
        <DataGrid
          initialState={{
            sorting: {
              sortModel: [{ field: "date", sort: "desc" }],
            },
          }}
          getRowId={(row) => row._id}
          rows={allEmployees}
          columns={employeeColumns}
          sx={{
            backgroundColor: "#ffffff",
          }}
        />
         <DataGrid
          initialState={{
            sorting: {
              sortModel: [{ field: "date", sort: "desc" }],
            },
          }}
          getRowId={(row) => row._id}
          rows={allItems}
          columns={itemColumns}
          sx={{
            backgroundColor: "#ffffff",
          }}
        />
      </Box>
    </Box>
  );
};

export default ManagePage;
