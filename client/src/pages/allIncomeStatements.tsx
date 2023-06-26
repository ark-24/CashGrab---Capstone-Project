import { Add } from '@mui/icons-material';
import { useTable } from '@pankod/refine-core';
import { Box, DataGrid, GridColDef, Stack, Typography } from '@pankod/refine-mui';
import { CustomButton } from 'components';
import React, { useEffect, useState } from 'react'
import CreateIncomeStatement from './createIncomeStatement';

const AllIncomeStatements = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const { tableQueryResult: { data, isLoading, isError } } = useTable({

        hasPagination: false,
    });

    const allIncomeStatements = data?.data ?? [];

    console.log(allIncomeStatements);



    if (isLoading) return <Typography>Loading ...</Typography>
    if (isError) return <Typography>Error ...</Typography>

    const columns: GridColDef[] = [
        //{ field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'type',
            headerName: 'Type',
            width: 200,
            editable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'fiveDollarBills',
            headerName: '$5 Bills',
            width: 200,

            editable: true,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'tenDollarBills',
            headerName: '$10 Bills',
            type: 'number',
            width: 200,

            editable: true,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'twentyDollarBills',
            headerName: '$20 Bills',
            type: 'string',
            width: 200,


            editable: true,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'fiftyDollarBills',
            headerName: '$50 Bills',
            type: 'string',
            width: 200,


            editable: true,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'hundredDollarBills',
            headerName: '$10 Bills',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 200,


            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'transactionTotal',
            headerName: 'Transfer Total',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 200,


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



    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontSize={25} fontWeight={700} color="#11142d"> Income </Typography>

                <Box sx={{ justifyContent: "end" }}>
                    <CustomButton title="Transfer" handleClick={handleClickOpen} backgroundColor="#D2042D"
                        color="#F3EC0E" icon={<Add />} />
                </Box>
            </Stack>
            <CreateIncomeStatement isOpen={open} onClose={handleClose} />


            <Box mt="20px" sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, height: '500px' }}>

                <DataGrid
                  initialState={{
                    sorting: {
                        sortModel: [{ field: 'date', sort: 'desc' }],
                    },
                }}
                    getRowId={(row) => row._id}
                    rows={allIncomeStatements}
                    columns={columns}
                    sx={{
                        backgroundColor: "#ffffff"
                    }}
                />
            </Box>
        </Box>
    )
}

export default AllIncomeStatements