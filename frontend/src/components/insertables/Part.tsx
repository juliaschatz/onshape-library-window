import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Grid, Paper, Typography } from "@material-ui/core";

import Divider from '@material-ui/core/Divider';

import SettingsInputCompositeIcon from '@material-ui/icons/SettingsInputComposite';
import SettingsInputHdmiIcon from '@material-ui/icons/SettingsInputHdmi';
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';

const PartIcon = SettingsInputCompositeIcon;
const AssemblyIcon = SettingsInputHdmiIcon;
const CompositeIcon = SettingsInputAntennaIcon;

// const useStyles = makeStyles((theme: Theme) => {
//     createStyles({
//         root: {
//             flexGrow: 1
//         },
//         paper: {
//             padding: theme.spacing(2),
//             textAlign: 'center',
//             color: theme.palette.text.secondary
//         }
//     })
// });


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: '15px',
            textAlign: 'center',
            color: theme.palette.text.secondary,
            backgroundColor: '#b0b0b8'
        },
        title: {
            // marginRight: '84%',
            color: 'white'
        },
        transparent: {
            color: '#b0b0b8'
        }
    })
);

interface PartProps {
    title: string;
}

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
                    
                    <PartIcon />
                    {/* <Divider flexItem variant='fullWidth' /> */}
                    <Typography className={classes.title} variant='h5'>{props.title}</Typography>
                    {/* <Typography variant='h5'></Typography> */}
                    <PartIcon className={classes.transparent}/>
                </Grid>

                


            </Paper>
        </Grid>
    )
}
