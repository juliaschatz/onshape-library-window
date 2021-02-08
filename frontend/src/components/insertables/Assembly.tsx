import React from 'react';

import { Grid, Paper, Typography } from "@material-ui/core";

import SettingsInputHdmiIcon from '@material-ui/icons/SettingsInputHdmi';

import useStyles from './styles'

const AssemblyIcon = SettingsInputHdmiIcon;

interface AssemblyProps {
  title: string;
}

export default function Assembly(props: AssemblyProps) {
  const classes = useStyles();


  return (
    <Grid item>
      <Paper className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >

          <AssemblyIcon />
          {/* <Divider flexItem variant='fullWidth' /> */}
          <Typography className={classes.title} variant='h5'>{props.title}</Typography>
          {/* <Typography variant='h5'></Typography> */}
          <AssemblyIcon className={classes.transparent} />
        </Grid>
      </Paper>
    </Grid>
  )
}