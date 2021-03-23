import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Configuration } from "../../utils/models/Configuration";
import FieldProps from "./FieldProps";

export default function QuantityField(props: FieldProps) {
  const configItem = props.configItem;
  const [helperText, setHelperText] = React.useState("");
  const [value, setValue] = React.useState(configItem.default as string);

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = +event.target.value;
    if (isNaN(newValue) || event.target.value.length === 0) {
      setHelperText("Enter a number");
    }
  };

  const applyChange = (newVal: string) => {
    if (+newVal === 0 || newVal === "" || newVal === "-" || newVal === "-0") {
      setValue(newVal);
      return;
    }
    const newValue = +newVal;
    if (!isNaN(newValue)) {
      if (configItem.quantityMin && newValue < configItem.quantityMin) {
        setHelperText(`Quantity must be greater than ${configItem.quantityMin}`);
      }
      else if (configItem.quantityMax && newValue > configItem.quantityMax) {
        setHelperText(`Quantity must be less than ${configItem.quantityMax}`);
      }
      else if (configItem.quantityType && configItem.quantityType === "INTEGER" && !Number.isInteger(newValue)) {
        setHelperText("Quantity must be an integer");
      }
      else {
        setHelperText("");
      }
      setValue(newValue.toString());
      const newResult = {...props.results};
      newResult[configItem.id] = `${newValue}${configItem.quantityUnits ? `+${configItem.quantityUnits}` : ""}`;
      props.setResult(newResult);      
    } else {
      setHelperText("Enter a number");
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyChange(event.target.value);
  };

  React.useEffect(()=>{
    applyChange(configItem.default as string);
  }, []);
  
  
  return <TextField
    id={configItem.id}
    label={configItem.name}
    type="number"
    value={value}
    helperText={helperText}
    onChange={onChange}
    onBlur={onBlur}
    error={helperText.length > 0}
    InputProps={{
      endAdornment: <InputAdornment position="end">{configItem.quantityUnits ? configItem.quantityUnits : ""}</InputAdornment>,
    }}
    InputLabelProps={{
      shrink: true,
    }}
  />;
      
}