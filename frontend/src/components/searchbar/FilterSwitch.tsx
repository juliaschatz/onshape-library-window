import classes from "*.module.css";
import { Checkbox, createStyles, FormControlLabel, Grid, makeStyles, Paper, Switch, Theme, Typography } from "@material-ui/core";
import React, { useState } from "react";
import classNames from 'classnames'
import { ClassExpression } from "typescript";
import { useRecoilState, useSetRecoilState } from "recoil";
import { searchOptionsState } from "../../utils/atoms";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(0.5),
      // paddingTop: '5px',
      marginTop: '0px',
      marginBottom: '0px',
      textAlign: 'center',
      // color: theme.palette.text.primary
      background: 'transparent' // '#7FFFD4' // #01579b
    },
    switch: {
      color: 'white'
    },
    red: {
      backgroundColor: 'red'
    },
    white: {
      color: 'white'
    }
  }
  ));

interface FilterSwitchProps {
  name: string;
  optionKey: 'part' | 'asm' | 'config';
}

export function FilterSwitch(props: FilterSwitchProps) {
  const classes = useStyles();

  let [checked, setChecked] = useState(false);
  let [searchOptions, setSearchOptions] = useRecoilState(searchOptionsState);
  // console.log(searchOptions);

  switch (props.optionKey) {
    case 'part':
      checked = searchOptions.part;
      break;
    case 'asm':
      checked = searchOptions.asm;
      break;
    case 'config':
      checked = searchOptions.config;
      break;
  }

  function getChecked(key: string): boolean {
    console.log(key);
    switch (key) {
      case 'part':
        return searchOptions.part;
      case 'asm':
        return searchOptions.asm;
      case 'config':
        return searchOptions.config;
    }
    console.log('oh no');
    return false;
  }
  
  function handleClick() {
    // something going wrong here
    checked = !checked;
    // setChecked();
    let options = {...searchOptions};
    switch (props.optionKey) {
      case 'part':
        options.part = checked;
        break;
      case 'asm':
        options.asm = checked;
        break;
      case 'config':
        options.config = checked;
        break;
    }
    console.log(options);
    setSearchOptions(options)
  }

  return (
    <Grid item xs={4}>
      <div
        // className={classNames(classes.paper, (checked ? classes.red : classes.paper))}
        className={classes.paper}
        onClick={handleClick}
      // onClick={() => setChecked(!checked)}
      >
        {/* <FormControlLabel
          className={classes.switch}
          value="top"
          control={<Switch color="secondary" />}
          label={props.name}
          labelPlacement="start"
        /> */}
        {/* <Typography typeof='h1'>
          {props.name}
        </Typography> */}
        <Checkbox checked={checked}
          color="secondary"
          // onClick={() => setChecked(!checked)}
        />
        <span className={classes.white}>
          {props.name}
        </span>
      </div>
    </Grid>
  )
}