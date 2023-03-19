import React from 'react'
import { Add } from '@mui/icons-material'
import { useList } from '@pankod/refine-core'

import { Dialog } from '@mui/material';
import { Box, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography } from '@pankod/refine-mui';
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


    return (
        <>
            <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography fontSize={25} fontWeight={700} color="#11142d"> Transactions</Typography>

                    <CustomButton title="Add Transaction" handleClick={handleClickOpen} backgroundColor="#D2042D"
                        color="#F3EC0E" icon={<Add />} />
                    <CreateTransaction isOpen={open} onClose={handleClose} />
                </Stack>
            </Box>
        </>
    )
}

export default AllTransactions
//navigate('/transactions/create')