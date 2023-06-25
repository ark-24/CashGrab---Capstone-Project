import React, { useEffect, useState } from "react";
import { Add, CheckCircleOutlineRounded, Delete } from "@mui/icons-material";
import {
  useDelete,
  useForm,
  useGetIdentity,
  useTable,
} from "@pankod/refine-core";


import { Dialog } from "@mui/material";
import {
  Box,
  Button,
  DataGrid,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  GridColDef,
  GridValueGetterParams,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@pankod/refine-mui";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { CustomButton } from "components";
import CreateTransaction from "./createTransaction";
import io from "socket.io-client";
import { count } from "console";
import moment from "moment-timezone";
// import transactionModel from './././server/mongodb/models/transaction.js';


interface Transaction {
  moneyDeposited: number[];
  item: string;
  details: string;
  price: number;
  creator: string; //{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  _id: string;
  customerEmail: string;
  date: Date;
}


const socket = io("http://localhost:8080");


const AllTransactions = () => {
  const {
    tableQueryResult: { data, isLoading, isError },
  } = useTable({
    hasPagination: false,
  });
  // const data = await getAllTransaction();


  const { data: user } = useGetIdentity();


  const [isOpenDepositAlert, setIsOpenDepositAlert] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [image, setImage] = useState<Buffer>();
  const { mutate } = useDelete();
  const navigate = useNavigate();


  const [recentTransaction, setRecentTransaction] =
    useState<Transaction | null>();


  const [IsLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string>("");


  const [open, setOpen] = React.useState(false);
  async function getRecentTransaction() {
    const response = await fetch(
      `http://localhost:8080/api/v1/transactions/recent`
    );
    if (response.ok) {
      const data = await response.json();
      setRecentTransaction(data);
      // console.log(JSON.stringify(data));
      return data;
    }
  }
  async function handleIncomeDeposit(depositAmt: number) {
    console.log("depositAmt in handleIncome" + depositAmt);
    const createData = {
      fiveDollarBills: depositAmt === 5 ? 1 : 0,
      tenDollarBills: depositAmt === 10 ? 1 : 0,
      twentyDollarBills: depositAmt === 20 ? 1 : 0,
      fiftyDollarBills: depositAmt === 50 ? 1 : 0,
      hundredDollarBills: depositAmt === 100 ? 1 : 0,
      transactionTotal: depositAmt,
      user: user,
      type: "Deposit",
    };
    try {
      const response = await fetch(`http://localhost:8080/api/v1/income`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(JSON.stringify(data));
        return data;
      }
    } catch (error) {
      console.error("Error creating Income Statement:", error);
    }
  }


  const setRecentDeposit = async (depositAmt: number) => {
    try {
      setIsLoading(true);
      const myTransaction = await getRecentTransaction();
      if (myTransaction !== null && myTransaction !== undefined) {
        console.log("depositvalue before " + depositAmt);
        const amountDeposited = myTransaction.moneyDeposited;
        const newAmountDeposited = [...amountDeposited, depositAmt];
        const updateData = {
          moneyDeposited: newAmountDeposited,
          id: myTransaction._id,
        };
        console.log("update " + JSON.stringify(updateData));
        const patchResponse = await fetch(
          `http://localhost:8080/api/v1/transactions/recent/${myTransaction?._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          }
        );
        if (patchResponse.ok) {
          const patchData = await patchResponse.json();
          console.log("Item updated:", patchData);
          await getRecentTransaction(); // update recentTransaction state after the patch request
        } else {
          console.error("Error updating item:", patchResponse.status);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsOpenDepositAlert(true);
    }
  };


  async function handleResult(data: any) {
    console.log(`data received in front end: ${data} `);
    setDepositAmount(data.inserted);
    console.log("data obj " + JSON.stringify(data));
    console.log("inserted " + depositAmount);
    await setRecentDeposit(data.inserted);
    await handleIncomeDeposit(data.inserted);
  }


  async function handleImage(data: any) {
    console.log(`handle image in front end: ${data} `);
    //const imageBuffer = Buffer.from(data, 'base64');
    console.log(data);
    setImage(data);
  }


  useEffect(() => {
    socket.on("result", handleResult);
    return () => {
      socket.off("result", handleResult);
    };
  }, [handleResult, socket]);


  useEffect(() => {
    socket.on("image", handleImage);


    return () => {
      socket.off("image", handleImage);
    };
  }, [handleImage, socket]);


  if (IsLoading) {
    return <div>Loading...</div>;
  }


  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };


  const allTransactions = data?.data ?? [];


  //if (isLoading) return <Typography>Loading ...</Typography>
  //if (isError) return <Typography>Error ...</Typography>


  const columns: GridColDef[] = [
    {
      field: "employee",
      headerName: "Employee",
      width: 225,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "item",
      headerName: "Item",
      width: 250,
      editable: false,
      headerAlign: "center",
      align: "center",
      valueGetter: (params: GridValueGetterParams) => {
        const selectedItems = params.row.selectedItems;
        let itemString = "";
        for (const item of selectedItems) {
          itemString += `${item.item}: ${item.count}\n`;
        }
        return itemString.trim(); // Trim any trailing newline characters
      },

    },
    {
      field: "price",
      headerName: "Price",
      width: 150,
      editable: false,
      headerAlign: "center",
      align: "center",

    },
    {
      field: "moneyDeposited",
      headerName: "Money Deposited",
      width: 150,
      editable: false,
      headerAlign: "center",
      align: "center",
      valueGetter: (params: GridValueGetterParams) => {
        //const moneyDeposited = params.getValue('moneyDeposited', field: 'moneyDeposited',) as number[];
        //const total = moneyDeposited.reduce((acc, curr) => acc + curr, 0);
        // console.log(Object.entries(params.row))
        // console.log(Object.values(params.row))
        return `${Object?.values(params.row)[1]?.reduce(
          (acc: any, curr: any) => acc + curr,
          0
        )}`
      },

    },
    //selected.splice(selected.findIndex((s) => s === newValue), 1);


    {
      field: "customerEmail",
      headerName: "Customer Email",
      type: "string",
      width: 225,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "details",
      headerName: "Comments",
      type: "string",
      width: 350,
      editable: false,
      headerAlign: "center",
      align: "center",

    },
    {
      field: "date",
      headerName: "Date",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 200,
      headerAlign: "center",
      align: "center",
      valueGetter: (params: GridValueGetterParams) => {

      const utcDate = params.value; // Assuming the date is stored in UTC format
      const pstDate = moment.utc(utcDate).subtract(7, 'hours');
      return pstDate.format('YYYY-MM-DD HH:mm:ss'); // Format the date as desired
    },

    },
  ];
  const handleToastClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // if (reason === 'clickaway') {
    //     return;
    // }


    setIsOpenDepositAlert(false);
    window.location.reload();
  };
  const handleDeleteTransaction = () => {
    if (selectedRow) {
      mutate(
        {
          resource: "transactions",
          id: selectedRow as string,
        },
        {
          onSuccess: () => {
            navigate("/transactions");
          },
        }
      );
      socket.emit("cancel", "cancelled")


    }
  };


  function handleRow(row: any) {
    setSelectedRow(row.id)
    console.log(typeof (row.id))


  }


  return (
    <>
      <Dialog
        open={isOpenDepositAlert}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <CheckCircleOutlineRounded style={{ color: "green" }} />
          {`   Money Deposited Successfully: $${depositAmount}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img
              style={{ maxWidth: "100%", maxHeight: "calc(100vh - 64px)" }}
              src={"data:image/jpeg;base64," + image}
              alt="pic"
            />


            {recentTransaction &&
              recentTransaction?.price &&
              recentTransaction?.moneyDeposited &&
              recentTransaction?.price >
              recentTransaction?.moneyDeposited.reduce(
                (acc: number, curr: number) => acc + curr,
                0
              )
              ? `You owe ${recentTransaction?.price -
              recentTransaction?.moneyDeposited.reduce(
                (acc: number, curr: number) => acc + curr,
                0
              )
              }`
              : "Thank You! No outstanding balance remaining."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToastClose}>OK</Button>
        </DialogActions>
      </Dialog>


      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {" "}
            Transactions
          </Typography>


          <Box sx={{ justifyContent: "end" }}>
            <CustomButton
              title="Add Transaction"
              handleClick={handleClickOpen}
              backgroundColor="#D2042D"
              color="#F3EC0E"
              icon={<Add />}
            />
          </Box>
        </Stack>
        <CreateTransaction isOpen={open} onClose={handleClose} />


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
            //checkboxSelection
            onCellClick={(row) => handleRow(row)}
            getRowId={(row: any) => row._id}
            rows={allTransactions}
            columns={columns}
            columnBuffer={3}
            sx={{
              backgroundColor: "#ffffff",
              flex: 1
              // "& .MuiDataGrid-columnHeaderTitle": {
              //   whiteSpace: "normal",
              //   lineHeight: "normal"
              // },
              // "& .MuiDataGrid-columnHeader": {
              //   // Forced to use important since overriding inline styles
              //   height: "unset !important"
              // },
              // "& .MuiDataGrid-columnHeaders": {
              //   // Forced to use important since overriding inline styles
              //   maxHeight: "168px !important"
              // }
            }}
          />
        </Box>
        <Box sx={{ justifyContent: "bottom" }}>
          <CustomButton
            title={"Abort Transaction"}
            backgroundColor="#D2042D"
            color="#F3EC0E"
            fullWidth
            icon={<Delete />}
            handleClick={() => {
              handleDeleteTransaction();
            }}
          />
        </Box>
      </Box>
    </>
  );
};


export default AllTransactions;
//navigate('/transactions/create')



