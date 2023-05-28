import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
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
import { io } from "socket.io-client";

interface CreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemData?: any;
}

const socket = io("http://localhost:8080");

const CreateTransaction = ({ isOpen, onClose }: CreateDialogProps) => {
  const { data: user } = useGetIdentity();
  const [price, setPrice] = useState<any>();
  useEffect(() => {
    // ...

    return () => {
      setPrice(0); // Reset the price when the dialog is closed
    };
  }, []);
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    reset,
  } = useForm();
  const [itemData, setItemData] = useState<Array<any>>();

  useEffect(() => {
    const getItems = async () => {
      const response = await fetch(
        "http://localhost:8080/api/v1/management/items"
      );
      if (response.ok) {
        const data = await response.json();
        setItemData(JSON.parse(JSON.stringify(data)));
        console.log(itemData);
      }
    };

    getItems();
  }, []); // empty dependency array to run only once on mount

  const onFinishHandler = async (data: FieldValues) => {
    try {
      await onFinish({
        ...data,
        email: user?.email,
      });
      onClose(); // close dialog on success
      reset();
    } catch (error) {
      console.log(error);
    }
    const Cost = parseInt(data.price);
    socket.emit("json", `{"state":1, "cost":${Cost}}`);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onFinishHandler)}>
        <Dialog disablePortal open={isOpen} onClose={onClose}>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter Transaction Details</DialogContentText>

            <Select
              variant="outlined"
              sx={{
                marginTop: "20px",
              }}
              id="item"
              label="Item"
              fullWidth
              color="info"
              displayEmpty
              {...register("item", {
                required: false,
              })}
              onChange={(e) => {
                const selectedItem = itemData?.find(
                  (item) => item.itemName === e.target.value
                );
                if (selectedItem) {
                  const itemPrice = selectedItem.price;
                  setPrice(itemPrice); // Set the value of "price" field using setValue from react-hook-form
                }
             else {
                setPrice(0); // Reset the price when no item is selected
              }
              }}
            >
              {itemData?.map((name: any) => (
                <MenuItem key={name._id} value={name.itemName}>
                  {name.itemName}
                </MenuItem>
              ))}
            </Select>

            <TextField
              sx={{
                marginTop: "20px",
              }}
              autoFocus
              id="price"
              label="Price"
              type="number"
              fullWidth
              value={price}
              variant="standard"
              {...register("price", {
                required: false,
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
              {...register("customerEmail", {
                required: false,
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
              {...register("details", {
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
export default CreateTransaction;
