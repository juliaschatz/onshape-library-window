import React, { useEffect, useState } from 'react'
import Document from './Document';
import { getMkcadDocs } from '../../utils/apiWrapper'

import { Theme, makeStyles, createStyles, Grid } from '@material-ui/core';
import { OnshapeDocument } from '../../utils/models/OnshapeDocument';

import { searchOptionsState, searchTextState } from '../../utils/atoms';
import { useRecoilValue } from 'recoil';

import { search as FuzzySearch } from '../../utils/fuzzySearch'

import Fuse from 'fuse.js'

import { FixedSizeList } from 'react-window'


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // display: 'flex',
            // justifyContent: 'center',
            // alignItems: 'stretch'
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
        (async function() {
            updateDocs(await getMkcadDocs());
            console.log(docs);
        })();
    }, [])

    if (searchText !== '') {
        // console.log(FuzzySearch(searchText, docs));
        // console.log('results searched');
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
                {/* {docs.length > 0 && docs.map((doc, index) => (<Document key={index} doc={doc}/>))} */}
                
                {/* {docs.length > 0 && docs.map((doc, index) => {
                    if (searchText === doc.name) return (<Document key={index} doc={doc} />);
                })} */}

                {filteredResults.length > 0 && filteredResults.map((res, index) => {
                    return (<Document key={index} doc={res.item} />);
                })}

                {docs.length > 0 && filteredResults.length === 0 && docs.map((doc, index) => (<Document key={index} doc={doc}/>))}

                {/* <FixedSizeList
                    height={710}
                    itemSize={70}
                    width={'100%'}
                    itemCount={filteredResults.length}
                    

                >
                    {({ index, style }) => {
                        // return (<p>{index}</p>);
                        // return (<Document key={index} doc={docs[index]} style={style}/>)
                        return (<Document key={index} doc={filteredResults[index].item} style={style} />);
                    }}

                </FixedSizeList> */}

            </Grid>
        </div>
    )
}

