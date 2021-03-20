import React from "react";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Grid, Paper, SvgIcon, Typography } from "@material-ui/core";

import Divider from "@material-ui/core/Divider";

import SettingsInputCompositeIcon from "@material-ui/icons/SettingsInputComposite";
import SettingsInputHdmiIcon from "@material-ui/icons/SettingsInputHdmi";
import SettingsInputAntennaIcon from "@material-ui/icons/SettingsInputAntenna";

import useStyles from "./styles";

import PartIcon2 from "../../icons/SvgPartIcon";
import InsertDialog from "../InsertDialog";
import { OnshapeInsertable } from "../../utils/models/OnshapeInsertable";

import { CircularProgress } from '@material-ui/core';

import { insertPart } from "../../utils/api"

const PartIcon = SettingsInputCompositeIcon;
const AssemblyIcon = SettingsInputHdmiIcon;
const CompositeIcon = SettingsInputAntennaIcon;

interface ElementProps {
    insertable: OnshapeInsertable;
}

// function PartSVGIcon() {
//     console.log(PartIcon2);
//     return (
//         <>
//             <SvgIcon viewBox="0 0 50 50" color='primary'>
//                 {PartIcon2}
//             </SvgIcon>
//         </>
//     )
// }

export default function InsertableElement(props: ElementProps) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [configOpts, setConfigOpts] = React.useState({});

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setConfigOpts({});
    if (!props.insertable.config || props.insertable.config.length === 0) {
      handleInsert();
    }
    else {
      setOpen(true);
    }
  };

  const handleInsert = () => {
    setOpen(false);
    // Collect configuration
    let configStr = "";
    for (const key in configOpts) {
      configStr += `${key}=${(configOpts as any)[key] as string};`;
    }
    configStr = configStr.substring(0, configStr.length-1);
    console.log(configStr);
    var t0 = performance.now();
    setLoading(true);
    insertPart(props.insertable, configStr).then((result: boolean) => {
      var t1 = performance.now();
      console.log(`Result: ${result}. ${t1 - t0} ms`);
      setLoading(false);
    });
  };

  const dialog = <InsertDialog 
    insertable={props.insertable} 
    open={open} 
    setOpen={setOpen} 
    configOpts={configOpts} 
    setConfigOpts={setConfigOpts} 
    handleInsert={handleInsert} />;

  return (
    <Grid item>
      <Paper className={classes.paper} onClick={handleClick}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          {props.insertable.type === "ASSEMBLY" ? <AssemblyIcon className={classes.icon}/> : <PartIcon2 className={classes.icon} />}
          {props.insertable.thumb && <img className={classes.image} src={`data:image/png;base64,${props.insertable.thumb}`} />}
          {<Divider flexItem variant='fullWidth' />}
          <Typography className={classes.title} variant='subtitle1'>{props.insertable.name}</Typography>
          {loading && <CircularProgress />}
          <PartIcon2 className={classes.transparent}/>
          {/* <Grid item xs={6} sm={12} /> */}
        </Grid>
      </Paper>
      {dialog}
    </Grid>
        
  );
}
