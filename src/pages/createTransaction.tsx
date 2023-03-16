import React, { useState } from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, Stack, TextField, Typography } from '@pankod/refine-mui';
import { useGetIdentity } from '@pankod/refine-core';
import { FieldValues, useForm } from '@pankod/refine-react-hook-form';
import { Email } from '@mui/icons-material';

interface CreateDialogProps {
    open?: boolean
    handleClose?: any
}

const CreateTransaction = ({ open, handleClose }: CreateDialogProps) => {

    const { data: user } = useGetIdentity();
    const { refineCore: { onFinish, formLoading }, register, handleSubmit } = useForm();

    const onFinishHandler = async (data: FieldValues) => {
        await onFinish({
            ...data,
            email: user?.email
        })

    }

    return (
        <Dialog open={true} onClose={handleClose}>
            <DialogTitle>New Transaction</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter Transaction Details
                </DialogContentText>

                {/* <TextField
                    autoFocus
                    margin="dense"
                    id="item"
                    label="Item"
                    type="string"
                    fullWidth
                    variant="standard"
                    {...register('item', {
                        required: false
                    })}
                /> */}
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
                    })}>
                    <MenuItem value="item1">Item 1</MenuItem>
                    <MenuItem value="item2">Item 2</MenuItem>
                    <MenuItem value="item3">Item 3</MenuItem>

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
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Submit</Button>
            </DialogActions>
        </Dialog>

    )
}

export default CreateTransaction