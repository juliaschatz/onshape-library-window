import React from "react";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Configuration } from "../../utils/models/Configuration";
import FieldProps from "./FieldProps";

export default function EnumField(props: FieldProps) {
  const configItem = props.configItem;
  const [value, setValue] = React.useState(configItem.default as string);

  const onChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
    let fuck = event.target.value as string;
    var newResult = {...props.results};
    newResult[configItem.id] = fuck;
    props.setResult(newResult);
  }
  const label_id = `label-${configItem.id}`;
  return <div><InputLabel shrink id={label_id}>{configItem.name}</InputLabel>
          <Select
            labelId={label_id}
            id={configItem.id}
            value={value}
            onChange={onChange}
          >
            {configItem.options && configItem.options.map((opt) => {
              return <MenuItem value={opt.value}>{opt.name}</MenuItem>
            })}
          </Select></div>
      
  }