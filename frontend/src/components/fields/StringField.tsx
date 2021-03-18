import React from "react";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Configuration } from "../../utils/models/Configuration";

interface StringFieldProps {
  configItem: Configuration;
}

export default function StringField(props: StringFieldProps) {
  const configItem = props.configItem;
  const [value, setValue] = React.useState(new String(configItem.default));

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }
  
  return <TextField
              id={configItem.id}
              label={configItem.name}
              type="text"
              value={value}
              onChange={onChange}
              InputLabelProps={{
                  shrink: true,
              }}
          />
      
  }