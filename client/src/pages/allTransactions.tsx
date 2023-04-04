import React from 'react'
import { Add } from '@mui/icons-material'
import { useTable } from '@pankod/refine-core'

import { Dialog } from '@mui/material';
import { Box, Button, DataGrid, DialogActions, DialogContent, DialogContentText, DialogTitle, GridColDef, GridValueGetterParams, Stack, TextField, Typography } from '@pankod/refine-mui';
import { useNavigate } from '@pankod/refine-react-router-v6';

import { CustomButton } from 'components';
import CreateTransaction from './createTransaction';

const AllTransactions = () => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const { tableQueryResult: { data, isLoading, isError } } = useTable();

    const allTransactions = data?.data ?? [];

    console.log(allTransactions);


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



    return (
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
                    getRowId={(row) => row._id}
                    rows={allTransactions}
                    columns={columns}
                    sx={{
                        backgroundColor: "#ffffff"
                    }}
                />
            </Box>
        </Box>
    )
}

export default AllTransactions
//navigate('/transactions/create')