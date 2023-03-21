import React, { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Select, Stack, TextField, Typography } from '@pankod/refine-mui';
import { useGetIdentity } from '@pankod/refine-core';
import { FieldValues, useForm } from '@pankod/refine-react-hook-form';
import { Email } from '@mui/icons-material';
import { CustomButton } from 'components';

interface CreateDialogProps {
    isOpen: boolean,
    onClose: () => void
}


const CreateTransaction = ({ isOpen, onClose }: CreateDialogProps) => {


    const { data: user } = useGetIdentity();
    const { refineCore: { onFinish, formLoading }, register, handleSubmit, reset } = useForm();


    const onFinishHandler = async (data: FieldValues) => {
        try {
            await onFinish({
                ...data,
                moneyDeposited: 5,
                customerEmail: user?.email,
                email: user?.email


            });
            onClose(); // close dialog on success
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

                        <Select
                            variant='outlined'
                            sx={{
                                marginTop: "20px",
                            }}
                            id="item"
                            label="Item"
                            fullWidth
                            color="info"
                            displayEmpty
                            {...register('item', {
                                required: false
                            })}
                        >
                            <MenuItem value="Item 1">Item 1</MenuItem>
                            <MenuItem value="Item 2">Item 2</MenuItem>
                            <MenuItem value="Item 3">Item 3</MenuItem>

                        </Select>


                        <TextField
                            sx={{
                                marginTop: "20px",
                            }}
                            autoFocus
                            margin="dense"
                            id="price"
                            label="Price"
                            type="number"
                            fullWidth
                            variant="standard"
                            {...register('price', {
                                required: false
                            })}
                        />

                        <TextField
                            sx={{
                                marginTop: "20px",
                            }}
                            autoFocus
                            id="info"
                            placeholder="Extra Information"
                            label="Details"
                            multiline
                            fullWidth
                            maxRows={3}
                            {...register('details', {
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
export default CreateTransaction