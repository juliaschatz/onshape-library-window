import React from "react";
import TextField from "@material-ui/core/TextField";
import FieldProps from "./FieldProps";

export default function StringField(props: FieldProps) {
  const configItem = props.configItem;
  const [value, setValue] = React.useState(configItem.default);

  const applyChange = React.useCallback((newValue: string) => {
    setValue(newValue);
    const newResult = {...props.results};
    newResult[configItem.id] = newValue;
    props.setResult(newResult);
  }, [setValue, props.results, configItem.id, props.setResult]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyChange(event.target.value);
  };

  React.useEffect(()=>{
    applyChange(configItem.default);
  }, [configItem.default, applyChange]);
  
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