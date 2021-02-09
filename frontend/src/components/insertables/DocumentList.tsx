import React, { useEffect, useState } from 'react'
import Document from './Document';
import { getMkcadDocs } from '../../utils/apiWrapper'

import { Theme, makeStyles, createStyles, Grid } from '@material-ui/core';
import { OnshapeDocument } from '../../utils/models/OnshapeDocument';


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

    const [docs, updateDocs] = useState<OnshapeDocument[]>([]);

    useEffect(() => {
        (async function() {
            updateDocs(await getMkcadDocs());
        })();
    }, [])

    return (
        <div className={classes.root}>
            <Grid
                container
                direction='column'
                justify='flex-end'
                alignItems='center' 
            >
                {docs.length > 0 && docs.map(doc => (<Document key={doc.id} doc={doc}/>))}
                

            </Grid>
        </div>
    )
}

