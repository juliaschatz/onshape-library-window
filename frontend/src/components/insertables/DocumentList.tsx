import React from 'react'
import Document from './Document';

import { Theme, makeStyles, createStyles, Grid } from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'stretch'
            paddingTop: '15px',
            flexGrow: 1,
            
        },
    }
));

export default function DocumentList() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid
                container
                direction='column'
                justify='flex-end'
                alignItems='center' 
            >
                <Document />
                <Document />

            </Grid>
        </div>
    )
}
