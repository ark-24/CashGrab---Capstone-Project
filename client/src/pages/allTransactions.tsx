import React, { useEffect, useState } from 'react'
import { Add, CheckCircleOutlineRounded } from '@mui/icons-material'
import { useTable } from '@pankod/refine-core'

import { Dialog } from '@mui/material';
import { Box, Button, DataGrid, DialogActions, DialogContent, DialogContentText, DialogTitle, GridColDef, GridValueGetterParams, Snackbar, Stack, TextField, Typography } from '@pankod/refine-mui';
import { useNavigate } from '@pankod/refine-react-router-v6';

import { CustomButton } from 'components';
import CreateTransaction from './createTransaction';
import io from "socket.io-client";

const socket = io("http://localhost:8080");



const AllTransactions = () => {

    const [isOpenDepositAlert, setIsOpenDepositAlert] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [recentPrice, setRecentPrice] = useState(0);


    const getRecentTransaction = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/transactions/recent`);
            const data = await response.json();
            //setBills(JSON.stringify(data));
            console.log(data);
            setRecentPrice(data.price);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        socket.on("result", async (data) => {
            console.log(`data received in front end: ${data} `)
            setIsOpenDepositAlert(true)
            setDepositAmount(data);
            const recentTransaction = await getRecentTransaction();
            console.log(recentTransaction);


        });
    }, []);
    useEffect(() => {
        console.log(`alert value  ${isOpenDepositAlert} `)
    }, [isOpenDepositAlert]);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    getRecentTransaction();


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
            type: 'number',
            width: 210,
            editable: true,
            headerAlign: 'center',
            align: 'center',
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
                        You owe {recentPrice - depositAmount}
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
                        getRowId={(row) => row._id}
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