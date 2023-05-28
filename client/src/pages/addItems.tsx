import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@pankod/refine-mui";
import { useGetIdentity } from "@pankod/refine-core";
import { FieldValues, useForm } from "@pankod/refine-react-hook-form";
import { Email } from "@mui/icons-material";
import { CustomButton } from "components";

interface CreateIncomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddItem = ({ isOpen, onClose }: CreateIncomeDialogProps) => {
  const { data: user } = useGetIdentity();
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onFinishHandler = async (data: FieldValues) => {
    console.log(data);
    const postData = {...data, user}
    try {
        const response = await fetch(`http://localhost:8080/api/v1/management/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
          });
          if (response.ok) {
            const data = await response.json();
            console.log(JSON.stringify(data));
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
          <DialogTitle>New Item</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter Item Details</DialogContentText>

            <TextField
              sx={{
                marginTop: "20px",
              }}
              autoFocus
              margin="dense"
              id="itemName"
              label="Item Name"
              type="string"
              fullWidth
              variant="standard"
              {...register("itemName", {
                required: false,
              })}
            />

            <TextField
              sx={{
                marginTop: "20px",
              }}
              autoFocus
              margin="dense"
              id="price"
              label="Price"
              type="string"
              fullWidth
              variant="standard"
              {...register("price", {
                required: false,
              })}
            />
           
           
          </DialogContent>
          <DialogActions>
            <CustomButton
              title="cancel"
              backgroundColor="#fcfcfc"
              color="#67be23"
              handleClick={onClose}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              backgroundColor="#fcfcfc"
              color="#67be23"
              title={formLoading ? "Submitting..." : "Submit"}
            >
              Submit
            </CustomButton>
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
};
// onClick={onFinishHandler}
export default AddItem;
