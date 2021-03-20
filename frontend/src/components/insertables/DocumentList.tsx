import React, { useEffect, useState } from 'react'
import Document from './Document';
import { getMkcadDocs } from '../../utils/apiWrapper'

import { Theme, makeStyles, createStyles, Grid } from '@material-ui/core';
import { OnshapeDocument } from '../../utils/models/OnshapeDocument';

import { searchOptionsState, searchTextState } from '../../utils/atoms';
import { useRecoilValue } from 'recoil';

import { search as FuzzySearch } from '../../utils/fuzzySearch'

import Fuse from 'fuse.js'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingTop: '0px',
            flexGrow: 1,
            
        },
    }
));

interface DocumentListProps {
  admin: boolean;
}

export default function DocumentList(props: DocumentListProps) {
    const classes = useStyles();

    const [docs, updateDocs] = useState<OnshapeDocument[]>([]);

    let filteredResults: OnshapeDocument[] = [];

    const searchText = useRecoilValue(searchTextState);

    console.log(searchText);

    useEffect(() => {
        (async function() {
            updateDocs(await getMkcadDocs());
        })();
    }, [])

    if (searchText !== '') {
        filteredResults = FuzzySearch(searchText, docs).map((res) => res.item);
        console.log(filteredResults);
    }
    else {
      filteredResults = docs;
    }

    return (
        <div className={classes.root}>
            <Grid
                container
                direction='column'
                justify='flex-end'
                alignItems='center' 
                spacing={0}
            >
                {filteredResults.length > 0 && filteredResults.map((res, index) => {
                    return (<Document isLazyAllItems={props.admin} key={index} doc={res} />);
                })}

                {/*docs.length > 0 && filteredResults.length === 0 && docs.map((doc, index) => (<Document isLazyAllItems={props.admin} key={index} doc={doc}/>))*/}
            </Grid>
        </div>
    )
}

