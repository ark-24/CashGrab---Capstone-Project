import React, { useEffect, useState } from 'react'
import { Add, CheckCircleOutlineRounded } from '@mui/icons-material'
import { useTable } from '@pankod/refine-core'

import { Dialog } from '@mui/material';
import { Box, Button, DataGrid, DialogActions, DialogContent, DialogContentText, DialogTitle, GridColDef, GridValueGetterParams, Snackbar, Stack, TextField, Typography } from '@pankod/refine-mui';
import { useNavigate } from '@pankod/refine-react-router-v6';

import { CustomButton } from 'components';
import CreateTransaction from './createTransaction';
import io from "socket.io-client";
// import transactionModel from './././server/mongodb/models/transaction.js';

interface Transaction {
    moneyDeposited: number[] , 
    item: string,
    details: string,
    price: number,
    creator: string, //{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _id: string,
    customerEmail: string,
    date: Date,
}

const socket = io("http://localhost:8080");



const AllTransactions = () => {

    const [isOpenDepositAlert, setIsOpenDepositAlert] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [recentTransaction, setRecentTransaction] = useState<Transaction | null>();


    const getRecentTransaction = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/transactions/recent`);
            if (response.ok) {
                const data = await response.json();
                setRecentTransaction(data);
                if(recentTransaction){
                    console.log("depositvalue before " + depositAmount)
                const updateData = recentTransaction ? { moneyDeposited: [...recentTransaction.moneyDeposited , depositAmount] ,id: recentTransaction._id} : undefined;
                fetch(`http://localhost:8080/api/v1/transactions/recent/${recentTransaction?._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Item updated:', data);
                })
                .catch(error => {
                    console.error('Error updating item:', error);
                });
            }
        }
        } catch (error) {
            console.error(error);
        }
    };
  
    useEffect(() => {
        socket.on("result", async (data) => {
          console.log(`data received in front end: ${data} `)
          setDepositAmount(data.inserted);
          console.log("data obj " + JSON.stringify(data))

          console.log("inserted " + depositAmount)
         getRecentTransaction();
          setIsOpenDepositAlert(true)
        });
      }, [socket]);
      

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const { tableQueryResult: { data, isLoading, isError } } = useTable();

    const allTransactions = data?.data ?? [];




    //if (isLoading) return <Typography>Loading ...</Typography>
    //if (isError) return <Typography>Error ...</Typography>
  
    const columns: GridColDef[] = [
        {
            field: 'item',
            headerName: 'Item',
            width: 150,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 150,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'moneyDeposited',
            headerName: 'Money Deposited',
            width: 210,
            editable: true,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params: GridValueGetterParams) => {
                //const moneyDeposited = params.getValue('moneyDeposited', field: 'moneyDeposited',) as number[];
                //const total = moneyDeposited.reduce((acc, curr) => acc + curr, 0);
                return `${Object.values(params.row)[1].reduce((acc: any, curr: any) => acc + curr, 0)}`;
            }
        },
        {
            field: 'customerEmail',
            headerName: 'Customer Email',
            type: 'string',
            width: 210,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'details',
            headerName: 'Information',
            type: 'string',
            width: 210,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'date',
            headerName: 'Date',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 200,
            headerAlign: 'center',
            align: 'center',
            // valueGetter: (params: GridValueGetterParams) =>
            //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];
    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        // if (reason === 'clickaway') {
        //     return;
        // }

        setIsOpenDepositAlert(false);
    };



    return (
        <>
            <Dialog
                open={isOpenDepositAlert}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                <DialogTitle >
                    <CheckCircleOutlineRounded style={{ color: 'green' }} />
                    {`   Money Deposited Successfully: $${depositAmount}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {recentTransaction?.price &&recentTransaction?.moneyDeposited && recentTransaction?.price > recentTransaction?.moneyDeposited.reduce((acc: number, curr: number) => acc + curr, 0) ? `You owe ${recentTransaction?.price - depositAmount}` : 'All good'}

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToastClose}>Disagree</Button>
                    <Button onClick={handleToastClose} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>

            <Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={25} fontWeight={700} color="#11142d"> Transactions</Typography>

                    <Box sx={{ justifyContent: "end" }}>
                        <CustomButton title="Add Transaction" handleClick={handleClickOpen} backgroundColor="#D2042D"
                            color="#F3EC0E" icon={<Add />} />
                    </Box>
                </Stack>
                <CreateTransaction isOpen={open} onClose={handleClose} />


                <Box mt="20px" sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, height: '500px' }}>

                    <DataGrid
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'date', sort: 'desc' }],
                            },
                        }}
                        getRowId={(row: any) => row._id}
                        rows={allTransactions}
                        columns={columns}
                        sx={{
                            backgroundColor: "#ffffff"
                        }}
                    />
                </Box>
            </Box>
        </>
    )
}

export default AllTransactions
//navigate('/transactions/create')