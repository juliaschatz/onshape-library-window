import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Paper, SvgIcon, Typography } from "@material-ui/core";

import Divider from '@material-ui/core/Divider';

import SettingsInputCompositeIcon from '@material-ui/icons/SettingsInputComposite';
import SettingsInputHdmiIcon from '@material-ui/icons/SettingsInputHdmi';
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';

import useStyles from './styles'

import PartIcon2 from '../../icons/SvgPartIcon'

const PartIcon = SettingsInputCompositeIcon;
const AssemblyIcon = SettingsInputHdmiIcon;
const CompositeIcon = SettingsInputAntennaIcon;

interface PartProps {
    title: string;
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

export default function Part(props: PartProps) {
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
                    {/* <PartIcon /> */}
                    <PartIcon2 className={classes.icon}/>
                    {/* <Divider flexItem variant='fullWidth' /> */}
                    <Typography className={classes.title} variant='h5'>{props.title}</Typography>
                    {/* <Typography variant='h5'></Typography> */}
                    <PartIcon2 className={classes.transparent}/>
                    {/* <Grid item xs={6} sm={12} /> */}
                </Grid>
            </Paper>
        </Grid>
    )
}
