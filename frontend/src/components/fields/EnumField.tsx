import React from "react";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { Configuration } from "../../utils/models/Configuration";
import { fade, makeStyles, Theme, createStyles, createMuiTheme } from "@material-ui/core/styles";
import FieldProps from "./FieldProps";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    
  }),
);

export default function EnumField(props: FieldProps) {
  const configItem = props.configItem;
  const [value, setValue] = React.useState(configItem.default as string);
  const classes = useStyles();

  const onChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setValue(event.target.value as string);
    const newVal = event.target.value as string;
    const newResult = {...props.results};
    newResult[configItem.id] = newVal;
    props.setResult(newResult);
  };
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