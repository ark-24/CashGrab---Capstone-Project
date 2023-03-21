import React, { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Select, Stack, TextField, Typography } from '@pankod/refine-mui';
import { useGetIdentity } from '@pankod/refine-core';
import { FieldValues, useForm } from '@pankod/refine-react-hook-form';
import { Email } from '@mui/icons-material';
import { CustomButton } from 'components';

interface CreateIncomeDialogProps {
    isOpen: boolean,
    onClose: () => void
}


const CreateIncomeStatement = ({ isOpen, onClose }: CreateIncomeDialogProps) => {


    const { data: user } = useGetIdentity();
    const { refineCore: { onFinish, formLoading }, register, handleSubmit, reset } = useForm();


    const onFinishHandler = async (data: FieldValues) => {
        console.log(data);
        try {
            await onFinish({
                ...data,
                total: (5 * data.fiveDollarBills + 10 * data.tenDollarBills + 20 * data.twentyDollarBills + 50 * data.fiftyDollarBills + 100 * data.hundredDollarBills),
                user: user,
                type: 'deposit'


            });
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
                    <DialogTitle>New Transaction</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter Transaction Details
                        </DialogContentText>

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