import React, { useRef } from 'react';
import { fade, makeStyles, Theme, createStyles, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Autocomplete } from "@material-ui/lab";
import { Checkbox, TextField } from '@material-ui/core';

import './SearchBar.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 'auto',
      },
    },
    searchColor: {
      color: 'white'
    }
  }),
);




export default function Searchbar() {
  const classes = useStyles();

  const input = useRef(null);

  

  return (
    <div >
      <AppBar position="static">
        <Toolbar>
          <div className={classes.grow} /> 
          <div className={classes.search}>
            <Autocomplete
               ref={input}
               multiple
               disableCloseOnSelect
               options={searchOptions}
               limitTags={3}
               color="white"
               getOptionLabel={(o: SearchOption) => o.title}
               renderOption={(option, { selected }) => (
                 <React.Fragment>
                   <Checkbox
                    checked={selected}
                   />
                   {option.title}
                 </React.Fragment>
               )}
               style={{ width: 600 }}
               renderInput={(params) => (
                 <TextField {...params} 
                  // InputProps={{className: classes.searchColor}}
                  variant="outlined" 
                  placeholder="Search"
                 />
               )}
               />
          </div>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
    </div>
  );
}


const searchOptions: SearchOption[] = [
  { title: 'Part', tag: 'part' },
  { title: 'Assembly', tag: 'asm'},
  { title: "Composite", tag: "composite"},
  { title: 'Configurable', tag: 'config' }
]

interface SearchOption {
  title: string;
  tag: string;
}