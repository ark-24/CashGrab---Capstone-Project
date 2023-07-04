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

const AddEmployee = ({ isOpen, onClose }: CreateIncomeDialogProps) => {
  // const { data: user } = useGetIdentity();
  const user = localStorage.getItem("user");

  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    reset,
  } = useForm();

  const onFinishHandler = async (data: FieldValues) => {
    try {
      await onFinish({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        user: user,
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
          <DialogTitle>New Employee</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter Employee Details</DialogContentText>

            <TextField
              sx={{
                marginTop: "20px",
              }}
              autoFocus
              margin="dense"
              id="firstName"
              label="First Name"
              type="string"
              fullWidth
              variant="standard"
              {...register("firstName", {
                required: false,
              })}
            />

            <TextField
              sx={{
                marginTop: "20px",
              }}
              autoFocus
              margin="dense"
              id="lastName"
              label="Last Name"
              type="string"
              fullWidth
              variant="standard"
              {...register("lastName", {
                required: false,
              })}
            />
            <TextField
              sx={{
                marginTop: "20px",
              }}
              autoFocus
              margin="dense"
              id="phoneNumber"
              label="Phone Number"
              type="string"
              fullWidth
              variant="standard"
              {...register("phoneNumber", {
                required: false,
              })}
            />

            <TextField
              sx={{
                marginTop: "20px",
              }}
              autoFocus
              margin="dense"
              id="email"
              label="Email Address"
              type="string"
              fullWidth
              variant="standard"
              {...register("email", {
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
export default AddEmployee;
