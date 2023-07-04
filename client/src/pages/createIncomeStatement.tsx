import React, { useEffect, useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@pankod/refine-mui';
import { useGetIdentity } from '@pankod/refine-core';
import { FieldValues, useForm } from '@pankod/refine-react-hook-form';
import { Email } from '@mui/icons-material';
import { CustomButton } from 'components';

interface CreateIncomeDialogProps {
    isOpen: boolean,
    onClose: () => void
}


const CreateIncomeStatement = ({ isOpen, onClose }: CreateIncomeDialogProps) => {


    const user = localStorage.getItem("user");

    const { refineCore: { onFinish, formLoading }, register, handleSubmit, reset } = useForm();
    useEffect(()=> {
        reset()
    },[onClose])

    const onFinishHandler = async (data: FieldValues) => {
       const postData = {
        fiveDollarBills: Number(data.fiveDollarBills),
        tenDollarBills: Number(data.tenDollarBills),
        twentyDollarBills: Number(data.twentyDollarBills),
        fiftyDollarBills: Number(data.fiftyDollarBills),
        hundredDollarBills: Number(data.hundredDollarBills),
        transactionTotal: (5 * data.fiveDollarBills + 10 * data.tenDollarBills + 20 * data.twentyDollarBills + 50 * data.fiftyDollarBills + 100 * data.hundredDollarBills),
        user: user,
        type: data.type
       } 
            try {
                const response = await fetch("http://127.0.0.1:8080/api/v1/income", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(postData),
                  });
                  if (response.ok) {
                    const data = await response.json();
                  }
            onClose();
            reset();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit(onFinishHandler)}>

                <Dialog disablePortal open={isOpen} onClose={onClose}>
                    <DialogTitle>New Transfer</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter Transfer Details
                        </DialogContentText>
                        <InputLabel sx={{ marginTop: "20px" }}>Type</InputLabel>
                        <Select
                            sx={{
                                marginTop: "5px",
                            }}
                            id="type"
                            label="Type"
                            fullWidth
                            color="info"
                            displayEmpty
                            {...register('type', {
                                required: true
                            })}
                        >
                            <MenuItem value="Deposit">Deposit</MenuItem>
                            <MenuItem value="Withdrawal">Withdrawal</MenuItem>

                        </Select>

                        <TextField
                            sx={{
                                marginTop: "20px",
                            }}
                            autoFocus
                            margin="dense"
                            id="fivedollars"
                            label="$5 Bills"
                            type="number"
                            fullWidth
                            defaultValue={0}
                            variant="standard"
                            {...register('fiveDollarBills', {
                                required: false
                            })}
                        />

                        <TextField
                            sx={{
                                marginTop: "20px",
                            }}
                            autoFocus
                            margin="dense"
                            id="tendollars"
                            label="$10 Bills"
                            type="number"
                            fullWidth
                            defaultValue={0}
                            variant="standard"
                            {...register('tenDollarBills', {
                                required: false
                            })}
                        />

                        <TextField
                            sx={{
                                marginTop: "20px",
                            }}
                            autoFocus
                            margin="dense"
                            id="twentydollars"
                            label="$20 Bills"
                            type="number"
                            fullWidth
                            defaultValue={0}
                            variant="standard"
                            {...register('twentyDollarBills', {
                                required: false
                            })}
                        />

                        <TextField
                            sx={{
                                marginTop: "20px",
                            }}
                            autoFocus
                            margin="dense"
                            id="fiftydollars"
                            label="$50 Bills"
                            type="number"
                            fullWidth
                            defaultValue={0}
                            variant="standard"
                            {...register('fiftyDollarBills', {
                                required: false
                            })}
                        />

                        <TextField
                            sx={{
                                marginTop: "20px",
                            }}
                            autoFocus
                            margin="dense"
                            id="hundreddollars"
                            label="$100 Bills"
                            type="number"
                            fullWidth
                            defaultValue={0}
                            variant="standard"
                            {...register('hundredDollarBills', {
                                required: false
                            })}
                        />

                    </DialogContent>
                    <DialogActions>
                        <CustomButton title="cancel" backgroundColor="#fcfcfc" color="#67be23" handleClick={onClose}>Cancel</CustomButton>
                        <CustomButton type="submit" backgroundColor="#fcfcfc" color="#67be23" title={formLoading ? 'Submitting...' : 'Submit'} >Submit</CustomButton>
                    </DialogActions>
                </Dialog>
            </form>


        </>
    )

}
// onClick={onFinishHandler}
export default CreateIncomeStatement