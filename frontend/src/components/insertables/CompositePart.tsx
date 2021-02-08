import React from 'react';

import { Grid, Paper, Typography } from "@material-ui/core";

import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';

import useStyles from './styles'


const CompositeIcon = SettingsInputAntennaIcon;

interface CompositePartProps {
  title: string;
}

export default function CompositePart(props: CompositePartProps) {
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

          <CompositeIcon />
          {/* <Divider flexItem variant='fullWidth' /> */}
          <Typography className={classes.title} variant='h5'>{props.title}</Typography>
          {/* <Typography variant='h5'></Typography> */}
          <CompositeIcon className={classes.transparent} />
          
        </Grid>
      </Paper>
    </Grid>
  )
}