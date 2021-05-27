import React from "react";
import TextField from "@material-ui/core/TextField";
import FieldProps from "./FieldProps";
import {evalMath, UNIT_MAP, unitless} from "../../utils/mathEval";

export default function QuantityField(props: FieldProps) {
  const configItem = props.configItem;
  const [helperText, setHelperText] = React.useState("");
  const [value, setValue] = React.useState(configItem.default as string); // Internal equation value
  const [dispValue, setDispValue] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  const setErrorState = (err: boolean) => {
    const newErrors = {...props.errors};
    newErrors[configItem.id] = err;
    props.setErrors(newErrors); 
  };

  const setResult = (res: any) => {
    const newResult = {...props.results};
    newResult[configItem.id] = `${res}${configItem.quantityUnits ? `+${configItem.quantityUnits}` : ""}`;
    props.setResult(newResult);
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    try {
      let result = evalMath(value);
      let unit = configItem.quantityUnits ? UNIT_MAP[configItem.quantityUnits as string] : unitless;
      if (result.hasSameUnitsAs(unitless)) { // Automatically apply default unit to anything entered without one
        result = result.mul(unit);
      }

      // Put the value into native units for this config entry
      let val = result.as(unit);

      // Validation
      if (isNaN(val)) {
        throw new Error("Enter a number");
      }
      if (configItem.quantityType && configItem.quantityType === "INTEGER" && !Number.isInteger(val)) {
        throw new Error("Quantity must be an integer");
      }
      if (configItem.quantityMin && val < configItem.quantityMin) {
        throw new Error(`Quantity must be greater than ${configItem.quantityMin}`);
      }
      else if (configItem.quantityMax && val > configItem.quantityMax) {
        throw new Error(`Quantity must be less than ${configItem.quantityMax}`);
      }

      setResult(val);   
      setDispValue(`${+val.toFixed(3)} ${configItem.quantityUnits ? configItem.quantityUnits : ""}`);
      setHelperText("");
      setErrorState(false);
    }
    catch (err) {
      setHelperText(err.toString());
      setErrorState(true);
    }
  };

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
  };

  const applyChange = (newVal: string) => {
    setValue(newVal);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyChange(event.target.value);
  };

  React.useEffect(()=> {
    const initValue = `${configItem.default} ${configItem.quantityUnits}`;
    applyChange(initValue);
    setDispValue(initValue);

    // Set default
    setResult(configItem.default);
    setErrorState(false);
  }, []);
  
  
  return <TextField
    id={configItem.id}
    label={configItem.name}
    type="text"
    value={isFocused ? value : dispValue}
    helperText={helperText}
    onChange={onChange}
    onBlur={onBlur}
    onFocus={onFocus}
    error={helperText.length > 0}
    InputLabelProps={{
      shrink: true,
    }}
  />;
      
}