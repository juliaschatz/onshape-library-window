import React, { useCallback } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FieldProps from "./FieldProps";

export default function BooleanField(props: FieldProps) {
  const configItem = props.configItem;
  const [checked, setChecked] = React.useState(configItem.default);

  const applyChange = useCallback((newValue: boolean) => {
    setChecked(newValue);
    const newResult = {...props.results};
    newResult[configItem.id] = newValue as any as string;
    props.setResult(newResult);
  }, [props.results, configItem.id, props.setResult]);

  React.useEffect(()=>{
    applyChange(configItem.default);
  }, [applyChange, configItem.default]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyChange(event.target.checked);
  };
  
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
  />;
      
}