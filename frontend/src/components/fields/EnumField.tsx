import React, { useEffect, useCallback } from "react";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FieldProps from "./FieldProps";

export default function EnumField(props: FieldProps) {
  const configItem = props.configItem;
  const [value, setValue] = React.useState(configItem.default as string);

  const applyChange = useCallback((newValue: string) => {
    setValue(newValue);
    const newResult = {...props.results};
    newResult[configItem.id] = newValue;
    props.setResult(newResult);
  }, [setValue, props.results, props.setResult, configItem.id]);

  const onChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    applyChange(event.target.value as string);
  };

  useEffect(()=>{
    applyChange(configItem.default as string);
  }, [applyChange, configItem.default]);

  const label_id = `label-${configItem.id}`;
  return <div><InputLabel shrink id={label_id}>{configItem.name}</InputLabel>
    <Select
      labelId={label_id}
      id={configItem.id}
      value={value}
      onChange={onChange}
      style={{minWidth: 120, maxWidth: "95%", whiteSpace: "normal"}}
    >
      {configItem.options && configItem.options.map((opt) => {
        return <MenuItem style={{whiteSpace: "normal"}} value={opt.value}>{opt.name}</MenuItem>;
      })}
    </Select></div>;
      
}