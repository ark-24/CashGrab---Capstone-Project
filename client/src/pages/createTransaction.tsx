import React, { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, MenuItem, Select, Stack, TextField, Typography } from '@pankod/refine-mui';
import { useGetIdentity } from '@pankod/refine-core';
import { FieldValues, useForm } from '@pankod/refine-react-hook-form';
import { Email } from '@mui/icons-material';
import { CustomButton } from 'components';
import { io } from 'socket.io-client';

interface CreateDialogProps {
    isOpen: boolean,
    onClose: () => void
}

const socket = io("http://localhost:8080");


const CreateTransaction = ({ isOpen, onClose }: CreateDialogProps) => {


    const { data: user } = useGetIdentity();
    const { refineCore: { onFinish, formLoading }, register, handleSubmit, reset } = useForm();


    const onFinishHandler = async (data: FieldValues) => {
        try {
            await onFinish({
                ...data,
                email: user?.email


            });
            onClose(); // close dialog on success
            reset();
        } catch (error) {
            console.log(error);
        }
        const Cost = parseInt(data.price);
        socket.emit("json", `{"state":1, "cost":${Cost}}`)
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
                            margin="dense"
                            id="customerEmail"
                            label="Customer Email"
                            fullWidth
                            variant="standard"
                            {...register('customerEmail', {
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