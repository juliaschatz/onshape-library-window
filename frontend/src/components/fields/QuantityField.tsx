import React from "react";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Configuration } from "../../utils/models/Configuration";

interface QuantityFieldProps {
  configItem: Configuration;
}

export default function QuantityField(props: QuantityFieldProps) {
  const configItem = props.configItem;
  const [helperText, setHelperText] = React.useState('');
  const [value, setValue] = React.useState(new String(configItem.default));

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    var newValue = +event.target.value;
    if (isNaN(newValue) || event.target.value.length === 0) {
      setHelperText('Enter a number');
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length === 0 || event.target.value === '' || event.target.value === '-' || event.target.value === '-0') {
      setValue(event.target.value);
      return;
    }
    var newValue = +event.target.value;
    if (!isNaN(newValue)) {
      if (configItem.quantityMin && newValue < configItem.quantityMin) {
        setHelperText(`Quantity must be greater than ${configItem.quantityMin}`);
      }
      else if (configItem.quantityMax && newValue > configItem.quantityMax) {
        setHelperText(`Quantity must be less than ${configItem.quantityMax}`);
      }
      else if (configItem.quantityType && configItem.quantityType === "INTEGER" && !Number.isInteger(newValue)) {
        setHelperText(`Quantity must be an integer`);
      }
      else {
        setHelperText('');
      }
      setValue(new String(newValue));      
    } else {
      setHelperText('Enter a number');
    }
  }
  
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
          />
      
  }