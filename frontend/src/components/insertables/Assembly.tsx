import React from 'react';

import { Grid, Paper, Typography } from "@material-ui/core";


import useStyles from './styles'

import SvgAssemblyIcon from '../../icons/SvgAssemblyIcon'
import { OnshapeInsertable } from '../../utils/models/OnshapeInsertable';

// const AssemblyIcon = SettingsInputHdmiIcon;

interface AssemblyProps {
  asm: OnshapeInsertable;
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

          <SvgAssemblyIcon className={classes.assemblyIcon}/>
          {/* <Divider flexItem variant='fullWidth' /> */}
          <Typography className={classes.title} variant='h5'>{props.asm.name}</Typography>
          {/* <Typography variant='h5'></Typography> */}
          <SvgAssemblyIcon className={classes.transparent} />
        </Grid>
      </Paper>
    </Grid>
  )
}