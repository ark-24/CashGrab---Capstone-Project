import React, { useEffect, useState } from 'react'
import { Add, CheckCircleOutlineRounded } from '@mui/icons-material'
import { useGetIdentity, useTable } from '@pankod/refine-core'

import { Dialog } from '@mui/material';
import { Box, Button, DataGrid, DialogActions, DialogContent, DialogContentText, DialogTitle, GridColDef, GridValueGetterParams, Snackbar, Stack, TextField, Typography } from '@pankod/refine-mui';
import { useNavigate } from '@pankod/refine-react-router-v6';

import { CustomButton } from 'components';
import CreateTransaction from './createTransaction';
import io from "socket.io-client";
// import transactionModel from './././server/mongodb/models/transaction.js';

interface Transaction {
    moneyDeposited: number[],
    item: string,
    details: string,
    price: number,
    creator: string, //{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    _id: string,
    customerEmail: string,
    date: Date,
}

const socket = io("http://localhost:8080");

// async function getAllTransaction() {
//     try {
//         const response = await fetch(`http://localhost:8080/api/v1/bills/`);
//         const data = await response.json();
//         //console.log(data);
//         return data;
//       } catch (error) {
//         console.error(error);
//       }

// }



const AllTransactions = () => {
    const { tableQueryResult: { data, isLoading, isError } } = useTable({

        hasPagination: false,
    });
    // const data = await getAllTransaction();

    const { data: user } = useGetIdentity();



    const [isOpenDepositAlert, setIsOpenDepositAlert] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [recentTransaction, setRecentTransaction] = useState<Transaction | null>();

    const [IsLoading, setIsLoading] = useState(false);


    const [open, setOpen] = React.useState(false);
    async function getRecentTransaction() {
        const response = await fetch(`http://localhost:8080/api/v1/transactions/recent`);
        if (response.ok) {
            const data = await response.json();
            setRecentTransaction(data);
            console.log(JSON.stringify(data))
            return data;
        }
    }
    async function handleIncomeDeposit(depositAmt: number) {
        console.log("depositAmt in handleIncome" + depositAmt)
        const createData = {
            fiveDollarBills: depositAmt === 5 ? 1 : 0,
            tenDollarBills: depositAmt === 10 ? 1 : 0,
            twentyDollarBills: depositAmt === 20 ? 1 : 0,
            fiftyDollarBills: depositAmt === 50 ? 1 : 0,
            hundredDollarBills: depositAmt === 100 ? 1 : 0,
            transactionTotal: depositAmt,
            user: user,
            type: "Deposit"
        }
        try {


            const response = await fetch(`http://localhost:8080/api/v1/income`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createData)
            });
            if (response.ok) {
                const data = await response.json();
                console.log(JSON.stringify(data))
                return data;
            }
        } catch (error) {
            console.error('Error creating Income Statement:', error);
        }
    }

    const setRecentDeposit = async (depositAmt: number) => {
        try {
            setIsLoading(true);
            const myTransaction = await getRecentTransaction();
            if (myTransaction !== null && myTransaction !== undefined) {

                console.log("depositvalue before " + depositAmt)
                const amountDeposited = myTransaction.moneyDeposited;
                const newAmountDeposited = [...amountDeposited, depositAmt];
                const updateData = { moneyDeposited: newAmountDeposited, id: myTransaction._id };
                console.log("update " + JSON.stringify(updateData))
                const patchResponse = await fetch(`http://localhost:8080/api/v1/transactions/recent/${myTransaction?._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });
                if (patchResponse.ok) {
                    const patchData = await patchResponse.json();
                    console.log('Item updated:', patchData);
                    await getRecentTransaction(); // update recentTransaction state after the patch request
                } else {
                    console.error('Error updating item:', patchResponse.status);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
            setIsOpenDepositAlert(true);
        }
    };

    async function handleResult(data: any) {
        console.log(`data received in front end: ${data} `)
        setDepositAmount(data.inserted);
        console.log("data obj " + JSON.stringify(data))
        console.log("inserted " + depositAmount)
        await setRecentDeposit(data.inserted);
        await handleIncomeDeposit(data.inserted);
    }

    useEffect(() => {
        socket.on("result", handleResult);

        return () => {
            socket.off("result", handleResult);
        };
    }, [handleResult, socket]);



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
            field: 'item',
            headerName: 'Item',
            width: 225,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 225,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'moneyDeposited',
            headerName: 'Money Deposited',
            width: 225,
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
            width: 225,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'details',
            headerName: 'Information',
            type: 'string',
            width: 225,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'date',
            headerName: 'Date',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 250,
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
        window.location.reload()

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
                        {recentTransaction && recentTransaction?.price && recentTransaction?.moneyDeposited && recentTransaction?.price > recentTransaction?.moneyDeposited.reduce((acc: number, curr: number) => acc + curr, 0) ? `You owe ${recentTransaction?.price - recentTransaction?.moneyDeposited.reduce((acc: number, curr: number) => acc + curr, 0)}` : 'Thank You! No outstanding balance remaining.'}

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToastClose}>OK</Button>

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