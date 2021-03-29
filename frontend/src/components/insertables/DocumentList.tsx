import React, { useEffect, useState } from 'react'
import Document from './Document';
import { getMkcadDocs, getOnshapeInsertables } from '../../utils/apiWrapper'

import { Theme, makeStyles, createStyles, Grid } from '@material-ui/core';
import { OnshapeDocument } from '../../utils/models/OnshapeDocument';

import { searchTextState } from '../../utils/atoms';
import { useRecoilValue } from 'recoil';

import { search as FuzzySearch } from '../../utils/fuzzySearch'

import Fuse from 'fuse.js'
import FavoritesService from '../../utils/favorites';
import { OnshapeInsertable } from '../../utils/models/OnshapeInsertable';

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

class FavoriteDocuments implements OnshapeDocument {
    constructor() {
        this.id = '';
        this.name = 'Favorites'
        this.insertables = [];
    }
    id: string;
    name: string;
    insertables: OnshapeInsertable[];
}

export default function DocumentList(props: DocumentListProps) {
    const classes = useStyles();

    const [docs, updateDocs] = useState<OnshapeDocument[]>([]);

    let filteredResults: OnshapeDocument[] = [];

    let favoritesService: FavoritesService = FavoritesService.getInstance();
    let favorites: FavoriteDocuments = new FavoriteDocuments();

    const searchText = useRecoilValue(searchTextState);

    // console.log(searchText);

    useEffect(() => {
        (async function () {
            // Get documents
            let docs = await getMkcadDocs();
            updateDocs(docs);

            // Get Parts
            let insertables = await getOnshapeInsertables();

            function getDocByID(documentId: string): OnshapeDocument {
                for (let i = 0; i < docs.length; i++) {
                    if (docs[i].id === documentId) {
                        return docs[i];
                    }
                }
                return docs[0];
            }

            // Assign parts to documents
            insertables.forEach(i => {
                let doc = getDocByID(i.documentId);
                doc.insertables.push(i);
            })

            // Assign favorite parts to favorite doc
            favorites.insertables = insertables.filter(i => favoritesService.isInFavorites(i.elementId));

        })();
    }, [])

    if (searchText !== '') {
      filteredResults = FuzzySearch(searchText, docs).map((res) => res.item);
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
                {/* Favorite Documents */}
                <Document isLazyAllItems={props.admin} key={0} doc={favorites} searchText={searchText} isFavorites={true}/>
                

                {/* Other Documents */}
                {filteredResults.length > 0 && filteredResults.sort((a, b) => a.name.localeCompare(b.name)).map((res, index) => {
                    return (<Document isLazyAllItems={props.admin} key={index} doc={res} searchText={searchText} isFavorites={false} />);
                })}

                {/*docs.length > 0 && filteredResults.length === 0 && docs.map((doc, index) => (<Document isLazyAllItems={props.admin} key={index} doc={doc}/>))*/}
            </Grid>
        </div>
    )
}

