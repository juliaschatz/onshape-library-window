import React from "react";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Configuration } from "../../utils/models/Configuration";
import FieldProps from "./FieldProps";

export default function BooleanField(props: FieldProps) {
  const configItem = props.configItem;
  const [checked, setChecked] = React.useState(configItem.default);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    var newResult = {...props.results};
    newResult[configItem.id] = checked as string;
    props.setResult(newResult);
  }
  
  return <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={onChange}
                id={configItem.id}
                color="primary"
              />
            }
            label={configItem.name}
          />
      
  }