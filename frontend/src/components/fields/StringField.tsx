import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Configuration } from "../../utils/models/Configuration";
import FieldProps from "./FieldProps";

export default function StringField(props: FieldProps) {
  const configItem = props.configItem;
  const [value, setValue] = React.useState(configItem.default);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    const newResult = {...props.results};
    newResult[configItem.id] = value;
    props.setResult(newResult);
  };
  
  return <TextField
    id={configItem.id}
    label={configItem.name}
    type="text"
    value={value}
    onChange={onChange}
    InputLabelProps={{
      shrink: true,
    }}
  />;
      
}