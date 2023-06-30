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
import { useGetIdentity, useLogin } from "@pankod/refine-core";
import { FieldValues, useForm } from "@pankod/refine-react-hook-form";
import { Email } from "@mui/icons-material";
import { CustomButton } from "components";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { CredentialResponse } from "interfaces/google";

interface CreateIncomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SigninDialog = ({ isOpen, onClose }: CreateIncomeDialogProps) => {
  const { data: user } = useGetIdentity();
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    reset,
  } = useForm();
  const navigate = useNavigate();
  const { mutate: login } = useLogin<any>();

  const onFinishHandler = async (data: FieldValues) => {
    console.log(data);
    try {
      // await onFinish({
      //     name: d

      // });
      const logUser = {
        email: data.email,
        password: data.password,
      };
      const response = await fetch(`http://localhost:8080/api/v1/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logUser),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(JSON.stringify(data));
        if (data.user) {
          localStorage.setItem("user", data.user._id);

          //navigate("/");
        login(logUser);

        }
      }
      //   login(response);
      //   navigate("/transactions");
      console.log(localStorage.getItem("user"))
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
          <DialogTitle>Log in</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter Details</DialogContentText>

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
                required: true,
              })}
            />

            <TextField
              sx={{
                marginTop: "20px",
              }}
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              fullWidth
              variant="standard"
              {...register("password", {
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
export default SigninDialog;
