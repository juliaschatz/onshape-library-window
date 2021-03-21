import React, { useEffect, useState } from 'react'
import Document from './Document';
import { getMkcadDocs, getOnshapeInsertables } from '../../utils/apiWrapper'

import { Theme, makeStyles, createStyles, Grid } from '@material-ui/core';
import { OnshapeDocument } from '../../utils/models/OnshapeDocument';

import { searchTextState } from '../../utils/atoms';
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

export default function DocumentList() {
    const classes = useStyles();

    const [docs, updateDocs] = useState<OnshapeDocument[]>([]);

    let filteredResults: Fuse.FuseResult<OnshapeDocument>[] = [];

    const searchText = useRecoilValue(searchTextState);

    console.log(searchText);

    useEffect(() => {
        (async function () {
            let docs = await getMkcadDocs();
            updateDocs(docs);

            let insertables = await getOnshapeInsertables();

            function getDocByID(documentId: string): OnshapeDocument {
                for (let i = 0; i < docs.length; i++) {
                    if (docs[i].id === documentId) {
                        return docs[i];
                    }
                }
                return docs[0];
            }

            insertables.forEach(i => {
                let doc = getDocByID(i.documentId);
                doc.insertables.push(i);
            })

        })();
    }, [])

    if (searchText !== '') {
        filteredResults = FuzzySearch(searchText, docs);
        console.log(filteredResults);
    }


    return (
        <div className={classes.root}>
            <Grid
                container
                direction='column'
                justify='flex-end'
                alignItems='center'
            >
                {filteredResults.length > 0 && filteredResults.map((res, index) => {
                    return (<Document key={index} doc={res.item} searchText={searchText}/>);
                })}

                {docs.length > 0 && filteredResults.length === 0 && docs.map((doc, index) => (<Document key={index} doc={doc} searchText={searchText}/>))}
            </Grid>
        </div>
    )
}

