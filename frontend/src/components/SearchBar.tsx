import React, { useRef } from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Autocomplete } from "@material-ui/lab";
import { Checkbox, TextField } from '@material-ui/core';

import './SearchBar.css'

import { searchOptionsState, searchTextState } from "../utils/atoms";
import { useSetRecoilState } from 'recoil';

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

  const setSearch = useSetRecoilState(searchTextState);
  const setSearchOptions = useSetRecoilState(searchOptionsState);



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
              clearOnBlur={false}
              options={searchOptions}
              limitTags={3}
              classes={{
                input: classes.searchColor
              }}
              color="white"
              getOptionLabel={(o: SearchOption) => o.title}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    checked={selected}
                    // onChange={(e) => {
                    //   console.log('search val changed')
                    //   setSearch(e.target.value);
                    // }}
                  />
                  {option.title}
                </React.Fragment>
              )}
              style={{ width: 600 }}
              onChange={(event, values) => {
                console.log(values);

                let options = {
                  part: false,
                  asm: false,
                  composite: false,
                  config: false
                };

                values.forEach(val => {
                  if (val.tag === 'part') {
                    options.part = true;
                  }
                  if (val.tag === 'asm') {
                    options.asm = true;
                  }
                  if (val.tag === 'composite') {
                    options.composite = true;
                  }
                  if (val.tag === 'config') {
                    options.composite = true;
                  }
                });

                setSearchOptions(options);
              }}

              renderInput={(params) => (
                <TextField {...params}
                  // InputProps={{className: classes.searchColor}}
                  variant="outlined"
                  placeholder="Search"
                  
                  onChange={(event) => {
                    // console.log(event.target.value);
                    setSearch(event.target.value);
                  }}
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
  { title: 'Assembly', tag: 'asm' },
  { title: "Composite", tag: "composite" },
  { title: 'Configurable', tag: 'config' }
]

interface SearchOption {
  title: string;
  tag: string
}