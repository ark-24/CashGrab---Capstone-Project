import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@pankod/refine-mui";
import { useGetIdentity } from "@pankod/refine-core";
import { FieldValues, useForm } from "@pankod/refine-react-hook-form";
import { AddCircleOutline, Email } from "@mui/icons-material";
import { CustomButton } from "components";
import { io } from "socket.io-client";


interface CreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemData?: any;
}


const socket = io("http://localhost:8080");




const CreateTransaction = ({ isOpen, onClose }: CreateDialogProps) => {
  // const { data: user } = useGetIdentity();
  const user = localStorage.getItem("user")


  const [price, setPrice] = useState<Number>();
  const [selectedItem, setSelectedItem] = useState<any>();
  const [selectedEmployee, setSelectedEmployee] = useState<any>();
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>(
    {}
  );

  const [itemCounts, setItemCounts] = useState<
    {
      item: string;
      count: number;
    }[]
  >([]);


  const [itemData, setItemData] = useState<Array<any>>();
  const [employeeData, setEmployeeData] = useState<Array<any>>();




  useEffect(() => {
    const getItems = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/items/${user}`
      );
      if (response.ok) {
        const data = await response.json();
        setItemData(JSON.parse(JSON.stringify(data)));
      }
    };


    getItems();
  }, []); // empty dependency array to run only once on mount


  useEffect(() => {
    const getEmployees = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/employees/${user}`
      );
      if (response.ok) {
        const data = await response.json();
        setEmployeeData(JSON.parse(JSON.stringify(data)));
      }
    };


    getEmployees();
  }, []); // empty dependency array to run only once on mount


  useEffect(() => {
    if (isOpen === false) {
      setPrice(0)
      setItemCounts([])
      setSelectedItems({})
    }


  }, [isOpen])

  const handleItemChange = (event: SelectChangeEvent<any>) => {
    const selectedValues = event.target.value as string[];
    // const {
    //   target: { value },
    // } = event.target.value a;
    console.log("values: " + selectedValues);
    const updatedSelectedItems: { [key: string]: number } = {};
    const updatedItemCounts = itemCounts;
    // console.log(selectedItem);

    if (updatedItemCounts && selectedValues) {
      updatedItemCounts.forEach((itemCount, i) => {
        let idx = selectedValues.findIndex((item: string) => item === itemCount.item);
        if (idx === -1) {
          updatedItemCounts.splice(i, 1)
        }
      })
      setItemCounts(updatedItemCounts)
    }


    selectedValues.forEach((selectedValue) => {
      if (selectedValue in updatedSelectedItems) {
        updatedSelectedItems[selectedValue] += 1;
      } else {
        updatedSelectedItems[selectedValue] = 1;
      }
    });


    setSelectedItems(updatedSelectedItems);
    
  };


  const handleItemQuantity = (event: any, item: string) => {
    console.log(event);
    const quantity = event.target.value;
    console.log("handle item " + JSON.stringify(itemCounts))


    console.log("quantity values: " + quantity);
    const updatedSelectedItems: {
      item: string;
      count: number;
    }[] = itemCounts;


    const idx = itemCounts.findIndex(itemWithCount => itemWithCount.item === item);
    if (idx === -1) {
      updatedSelectedItems.push({ item: item, count: quantity })
      console.log("after push " + JSON.stringify(updatedSelectedItems))
    }
    else {
      updatedSelectedItems[idx].count = quantity


    }


    //console.log("new item counts" + JSON.stringify(updatedSelectedItems))


    setItemCounts([...updatedSelectedItems]);
    console.log("after set " + JSON.stringify(itemCounts))
    // setSelectedItem(
    //   selectedValues.map((selectedValue) =>
    //     itemData?.find((item) => item.itemName === selectedValue)
    //   )
    // );
  };


  useEffect(() => {
    // ...


    return () => {
      setPrice(0); // Reset the price when the dialog is closed
    };
  }, []);


  // ...


  const calculatePrice = () => {
    if (itemCounts && itemData) {
      let totalPrice = 0;
      itemCounts.forEach((itemCount) => {
        const selectedItem = itemData.find(
          (item) => item.itemName === itemCount.item
        );
        if (selectedItem) {
          const itemPrice = selectedItem.price;
          const itemQuantity = itemCount.count;
          totalPrice += itemPrice * itemQuantity;
        }
      });
      return totalPrice;
    }
    return 0;
  };


  useEffect(() => {
    setPrice(calculatePrice());
  }, [itemCounts, itemData]);


  // ...




  useEffect(() => {
    console.log("price is " + price);
  }, [price]);


  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
    reset,
  } = useForm();


  const onFinishHandler = async (data: FieldValues) => {
    try {
      await onFinish({
        ...data,
        email: Email,
        price: price,
        selectedItems: itemCounts,
        creator: user
      });
      onClose(); // close dialog on success
      reset();
    } catch (error) {
      console.log(error);
    }
    const Cost = parseInt(data.price);
    socket.emit("json", `{"cost":${price}}`);
  };




  return (
    <>
      <form onSubmit={handleSubmit(onFinishHandler)}>
        <Dialog disablePortal open={isOpen} onClose={onClose}>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter Transaction Details</DialogContentText>

            <InputLabel id="employee-select-label" sx={{marginTop: "15px",}}>Employee</InputLabel>
            <Select
              variant="outlined"
              sx={{
                marginTop: "5px",
              }}
              id="employee"
              labelId="employee-select-label"
              label="Employee"
              fullWidth
              color="info"
              displayEmpty
              {...register("employee", {
                required: true,
              })}
              onChange={(e) => {
                const selectedValue = e.target.value;
                const selectedEmployee = employeeData?.find((employee) => employee.itemName === selectedValue);
                if (selectedEmployee) {
                  setSelectedEmployee(selectedEmployee);
                }
              }}
            //value={Object.keys(selectedItems)}
            >
              {employeeData?.map((employee: any) => (
                <MenuItem key={employee._id} value={`${employee.firstName} ${employee.lastName}`}>
                  {`${employee.firstName} ${employee.lastName}`}
                </MenuItem>
              ))}
            </Select>


            <InputLabel id="item-select-label" sx={{marginTop: "15px",}}>Item</InputLabel>


            <Select
              variant="outlined"
              sx={{
                marginTop: "5px",
              }}
              id="item"
              labelId="item-select-label"
              label="Item"
              fullWidth
              multiple
              color="info"
              displayEmpty
              {...register("item", {
                required: true,
              })}
              onChange={handleItemChange}
              value={Object.keys(selectedItems)}
            >
              {itemData?.map((name: any) => (
                <MenuItem key={name._id} value={name.itemName}>
                  {name.itemName}
                </MenuItem>
              ))}
            </Select>


            {Object.keys(selectedItems).map((item) => (
              <TextField
                key={item}
                label={`${item} Quantity`}
                fullWidth
                sx={{marginTop: "5px"}}
                type="number"
                required={true}
                onChange={quantity => handleItemQuantity(quantity, item)}
                variant="standard"
              />
            ))}


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
                required: true,
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
              inputProps={{ inputMode: 'text' }}
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
              label="Comments"
              multiline
              fullWidth
              maxRows={1}
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



