import classes from "*.module.css";
import { createStyles, FormControlLabel, Grid, makeStyles, Paper, Switch, Theme } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(0.5),
      // paddingTop: '5px',
      marginTop: '0px',
      marginBottom: '0px',
      textAlign: 'center',
      // color: theme.palette.text.primary
      background: 'transparent' // #01579b
    },
    switch: {
      color: 'white'
    }
  }
));

interface FilterSwitchProps {
  name: string;
}

export function FilterSwitch(props: FilterSwitchProps) {
  const classes = useStyles();

  return (
    <Grid item xs={4}>
      <Paper className={classes.paper} >
        <FormControlLabel
          className={classes.switch}
          value="top"
          control={<Switch color="secondary" />}
          label={props.name}
          labelPlacement="start"
        />
      </Paper>
    </Grid>
  )
}