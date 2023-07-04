import { Add } from '@mui/icons-material';
import { useTable } from '@pankod/refine-core';
import { Box, DataGrid, GridColDef, GridValueGetterParams, Stack, Typography } from '@pankod/refine-mui';
import { CustomButton } from 'components';
import React, { useEffect, useState } from 'react'
import CreateIncomeStatement from './createIncomeStatement';
import moment from 'moment';

const AllIncomeStatements = () => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<any[]>([])
    const user = localStorage.getItem("user");


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const { tableQueryResult: { data, isLoading, isError } } = useTable({

    //     hasPagination: false,
    // });


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/income/${user}`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
          
            if (response.ok) {
              const data = await response.json();
            setData(data)
            }
            // Process and set the transactions in the component state or tableQueryResult
        
          } catch (error) {
            console.log(error);
          }
        };
      
        
        // Call the fetchData function to fetch transactions
        fetchData();
      },[user, open])
      





    const columns: GridColDef[] = [
        {
            field: 'type',
            headerName: 'Type',
            width: 200,
            editable: false,
            headerAlign: 'center',
            align: 'center',
            
        },
        {
            field: 'fiveDollarBills',
            headerName: '$5 Bills',
            width: 200,

            editable: false,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'tenDollarBills',
            headerName: '$10 Bills',
            type: 'number',
            width: 200,

            editable: false,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'twentyDollarBills',
            headerName: '$20 Bills',
            type: 'string',
            width: 200,


            editable: false,
            headerAlign: 'center',
            align: 'center',


        },
        {
            field: 'fiftyDollarBills',
            headerName: '$50 Bills',
            type: 'string',
            width: 200,


            editable: false,
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
            valueGetter: (params: GridValueGetterParams) => {

                const utcDate = params.value; // Assuming the date is stored in UTC format
                const pstDate = moment.utc(utcDate).subtract(7, 'hours');
                return pstDate.format('YYYY-MM-DD HH:mm:ss'); // Format the date as desired
              },


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
                    rows={data}
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