import { Add, Delete } from "@mui/icons-material";
import { useDelete, useTable } from "@pankod/refine-core";
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
import { useNavigate } from "@pankod/refine-react-router-v6";

const ManagePage = () => {
  const [itemOpen, setItemOpen] = useState(false);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [selectedEmployeeRow, setSelectedEmployeeRow] = useState<string>();
  const [selectedItemRow, setSelectedItemRow] = useState<string>();
  const [employeeData, setEmployeeData] = useState<any[]>([])
  const [itemData, setItemData] = useState<any[]>([])

  const user = localStorage.getItem("user");


  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/employees/${user}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
      
        if (response.ok) {
          const data = await response.json();
          setEmployeeData(data)
        }
        // Process and set the transactions in the component state or tableQueryResult
    
      } catch (error) {
        console.log(error);
      }
    };

    const fetchItemData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/items/${user}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    
      if (response.ok) {
        const data = await response.json();
        setItemData(data)
      }
      // Process and set the transactions in the component state or tableQueryResult
  
    } catch (error) {
      console.log(error);
    }
  

  }
    
    // Call the fetchData function to fetch transactions
    fetchEmployeeData();
    fetchItemData()
  },[user, itemOpen, employeeOpen])

  const { mutate } = useDelete();
  const navigate = useNavigate();

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

  // const {
  //   tableQueryResult: {  data: employeeData },
  // } = useTable({
  //   hasPagination: false,
  // });
  // const allEmployees = employeeData?.data ?? [];


  // const {
  //   tableQueryResult: { data: itemData, isLoading, isError },
  // } = useTable({
  //   resource: "items",
  //   hasPagination: false,
  // });
  // const allItems = itemData?.data ?? [];

  function handleEmployeeRow(row: any) {
    setSelectedEmployeeRow(row.id)

  }

  function handleItemRow(row: any) {
    setSelectedItemRow(row.id)
  }

  // if (isLoading) return <Typography>Loading ...</Typography>;
  // if (isError) return <Typography>Error ...</Typography>;

  const employeeColumns: GridColDef[] = [
    //{ field: 'id', headerName: 'ID', width: 90 },
    {
      field: "firstName",
      headerName: "First Name",
      width: 200,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      type: "number",
      width: 200,

      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,

      editable: false,
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

  const handleDeleteEmployee = () => {
    if (selectedEmployeeRow) {
      mutate(
        {
          resource: "employees",
          id: selectedEmployeeRow as string,
        },
        {
          onSuccess: () => {
            navigate("/management");
          },
        }
      );
      // window.location.reload();
    }
  };

  const handleDeleteItem = () => {
    if (selectedItemRow) {
      
      mutate(
        {
          resource: "items",
          id: selectedItemRow as string,
        },
        {
          onSuccess: () => {
            navigate("/management");
          },
        }
      );
      // window.location.reload();


    }
  };

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
          rows={employeeData}
          columns={employeeColumns}
          onCellClick={(row) => handleEmployeeRow(row)}
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
          onCellClick={(row) => handleItemRow(row)}
          getRowId={(row) => row._id}
          rows={itemData}
          columns={itemColumns}
          sx={{
            backgroundColor: "#ffffff",
          }}
        />
      </Box>
      <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
      }}
    >
      <CustomButton
        title={"Delete Employee"}
        backgroundColor="#D2042D"
        color="#F3EC0E"
        icon={<Delete />}
        handleClick={() => {
          handleDeleteEmployee();
        }}
      />

      <CustomButton
        title={"Delete Item"}
        backgroundColor="#D2042D"
        color="#F3EC0E"
        icon={<Delete />}
        handleClick={() => {
          handleDeleteItem();
        }}
      />
    </Box>
        
    </Box>
  );
};

export default ManagePage;
