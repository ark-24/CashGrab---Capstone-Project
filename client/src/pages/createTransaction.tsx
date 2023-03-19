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

    //const [open, setOpen] = React.useState(isOpen);


    // const handleClose = () => {
    //     setOpen(false);
    // };


    const { data: user } = useGetIdentity();
    const { refineCore: { onFinish, formLoading }, register, handleSubmit } = useForm();


    const onFinishHandler = async (data: FieldValues) => {
        try {
            await onFinish({
                ...data,
                moneyDeposited: 5,
                customerEmail: user?.email,
                email: user?.email


            });
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit(onFinishHandler)}>
                <FormControl>

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
                            <Button onClick={onClose}>Cancel</Button>
                            <CustomButton type="submit" backgroundColor="#475be8" color="#fcfcfc" title={formLoading ? 'Submitting...' : 'Submit'}>Submit</CustomButton>
                        </DialogActions>
                    </Dialog>
                </FormControl>
            </form>


        </>
    )

}
// onClick={onFinishHandler}
export default CreateTransaction