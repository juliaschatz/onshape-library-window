import React, { useRef } from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Autocomplete } from "@material-ui/lab";
import { Button, Checkbox, TextField } from "@material-ui/core";
import { SwapHoriz } from "@material-ui/icons";

import "./SearchBar.css";

import { searchOptionsState, searchTextState } from "../utils/atoms";
import { useSetRecoilState } from 'recoil';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
      flexShrink: 3
    },
    search: {
      flexGrow: 1,
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      marginLeft: 0,
      [theme.breakpoints.up("sm")]: {
        width: "auto",
      },
    },
    searchColor: {
      color: "white"
    }
  }),
);

interface SearchbarProps {
  isAdmin: boolean;
  setAdmin: (admin: boolean) => void;
  showAdmin: boolean;
}


export default function Searchbar(props: SearchbarProps) {
  const classes = useStyles();

  const input = useRef(null);

  const setSearch = useSetRecoilState(searchTextState);
  const setSearchOptions = useSetRecoilState(searchOptionsState);

  return (
    <div >
      <AppBar position="static" color={props.isAdmin ? "secondary" : "primary"}>
        <Toolbar>
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
                  />
                  {option.title}
                </React.Fragment>
              )}
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
                  // if (val.tag === 'composite') {
                  //   options.composite = true;
                  // }
                  if (val.tag === 'config') {
                    options.config = true;
                  }
                });
                console.log(options);
                setSearchOptions(options);
              }}

              renderInput={(params) => (
                <TextField {...params}
                  variant="outlined"
                  placeholder="Search"
                  onChange={(event) => {
                    setSearch(event.target.value);
                  }}
                />
              )}
            />
          </div>
          {props.showAdmin && <Button 
            startIcon={<SwapHoriz />}
            color="inherit" 
            onClick={() => props.setAdmin(!props.isAdmin)}>
              {props.isAdmin ? "User" : "Admin"}
          </Button>}
        </Toolbar>
      </AppBar>
    </div>
  );
}


const searchOptions: SearchOption[] = [
  { title: 'Part', tag: 'part' },
  { title: 'Assembly', tag: 'asm' },
  // { title: "Composite", tag: "composite" },
  { title: 'Configurable', tag: 'config' }
]

interface SearchOption {
  title: string;
  tag: string
}