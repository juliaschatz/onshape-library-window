import React, { useRef, useEffect } from 'react';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Autocomplete } from "@material-ui/lab";
import { Avatar, Button, Checkbox, Grid, Paper, TextField } from "@material-ui/core";
import { SwapHoriz } from "@material-ui/icons";

import "./SearchBar.css";

import { searchOptionsState, searchTextState } from "../utils/atoms";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styles from './insertables/styles';

import SearchBar from 'material-ui-search-bar'

import { FilterSwitch } from './searchbar/FilterSwitch';

import Chip from '@material-ui/core/Chip';

import { SearchInput } from "./searchbar/SearchInput";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
      // flexShrink: 3
    },
    root: {
      margin: '5px',
      borderRadius: '5px',
      paddingBottom: '5px'
    },
    // search: {
    //   marginTop: '10px',
    //   paddingLeft: '9px',
    //   paddingBottom: '0px',
    //   flexGrow: 1,
    //   position: "relative",
    //   borderRadius: theme.shape.borderRadius,
    //   backgroundColor: fade(theme.palette.common.white, 0.15),
    //   marginLeft: 0,
    //   [theme.breakpoints.up("sm")]: {
    //     width: "auto",
    //   },
    // },
    searchColor: {
      color: "white"
    },
    paper: {
      padding: theme.spacing(2),
      // paddingTop: '5px',
      marginTop: '10px',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    searchBar: {
      marginTop: '10px',
      // height: '40px'
    },
    adminButton: {
      marginTop: '10px',
      // marginRight: '0%',
      marginLeft: '25%',
      textAlign: 'center'
      // fontSize: '20px'
    }
  }),
);

interface SearchbarProps {
  isAdmin: boolean;
  setAdmin: (admin: boolean) => void;
  showAdmin: boolean;
}

let clearRef: HTMLButtonElement | undefined = undefined;

export default function Searchbar(props: SearchbarProps) {
  const classes = useStyles();

  const input = useRef(null);

  const setSearch = useSetRecoilState(searchTextState);

  const setSearchOptions = useSetRecoilState(searchOptionsState);

  const search = useRecoilValue(searchTextState);

  // useEffect(() => {
  //   let button = document.querySelectorAll('button')[0];
  //   clearRef = button;
  //   button.addEventListener('click', () => {
  //     setSearch('');
  //   });
  // }, []);

  return (
    <div >
      <AppBar position="static" color={props.isAdmin ? "secondary" : "primary"} className={classes.root}>
        <Toolbar>
          <Grid container spacing={1}>

            <Grid item xs={(props.showAdmin ? 9 : 12)}>
              {/* <Paper className={classes.paper}>xs=12</Paper> */}
              {/* <Chip size="small" avatar={<Avatar>M</Avatar>} label="Clickable" /> */}
              {/* <SearchBar className={classes.searchBar} ></SearchBar> */}
              <div>
                <SearchInput className={classes.searchBar} />
              </div>
            </Grid>

            {props.showAdmin && <Grid item xs={3}>
              <Button
                startIcon={<SwapHoriz />}
                className={classes.adminButton}
                size="large"
                color="inherit"
                onClick={() => props.setAdmin(!props.isAdmin)}>
                {props.isAdmin ? "User" : "Admin"}
              </Button>
            </Grid>}

            <FilterSwitch name="Part" optionKey="part"/>
            <FilterSwitch name="Assembly" optionKey="asm"/>
            <FilterSwitch name="Configurable" optionKey="config"/>




            {/* <Grid item xs={12} > */}
            {/* <FormControl component="fieldset"> */}
            {/* <FormGroup aria-label="position" row> */}
            {/* <Grid item xs={4} >
                  <FormControlLabel
                    value="top"
                    control={<Switch color="primary" />}
                    label="Top"
                    labelPlacement="top"
                  />
                
                </Grid>
                <Grid item xs={4} >
                  <FormControlLabel
                    value="top"
                    control={<Switch color="primary" />}
                    label="Top"
                    labelPlacement="top"
                  />

                </Grid>
                <Grid item xs={4} >
                  <FormControlLabel
                    value="top"
                    control={<Switch color="primary" />}
                    label="Top"
                    labelPlacement="top"
                  /> */}

            {/* </Grid> */}

            {/* <FormControlLabel
                    value="start"
                    control={<Switch color="primary" />}
                    label="Start"
                    labelPlacement="top"
                  />
                  <FormControlLabel
                    value="bottom"
                    control={<Switch color="primary" />}
                    label="Bottom"
                    labelPlacement="top"
                  />
                  <FormControlLabel
                    value="end"
                    control={<Switch color="primary" />}
                    label="End"
                    labelPlacement="top"
                  /> */}
            {/* </FormGroup> */}
            {/* </FormControl> */}
            {/* </Grid> */}

            {/* <Grid item xs={6}>
              <Paper className={classes.paper}>xs=6</Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper}>xs=6</Paper>
            </Grid> */}
          </Grid>


          {/* <div>
            <div>
              <SearchBar
              
              />
              {(props.showAdmin || true) && <Button
                startIcon={<SwapHoriz />}
                color="inherit"
                onClick={() => props.setAdmin(!props.isAdmin)}>
                {props.isAdmin ? "User" : "Admin"}
              </Button>}
            </div>
            <div>
              
            </div>
          </div> */}


          {/* <div className={classes.search}> */}
          {/* 
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

              filterOptions={(options, state) => options}
              
              inputValue={search}

              renderOption={(option, { selected }) => {
                return (
                  <React.Fragment>
                    <Checkbox
                      checked={selected}
                    />
                  {option.title}
                  </React.Fragment>)
              }}
              onChange={(event, values) => {
                console.log(search);

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
                  if (val.tag === 'config') {
                    options.config = true;
                  }
                });
                setSearchOptions(options);
              }}

              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search"
                  autoFocus
                  onChange={(event) => {
                    // extremely jank way of keeping clear button visible but who cares 
                    clearRef?.classList.add('MuiAutocomplete-clearIndicatorDirty');

                    setSearch(event.target.value);
                  }}
                />
              )}
            /> */}
          {/* <TextField
              // {...params}
              className={classes.searchColor}
              variant="outlined"
              placeholder="Search"
              autoFocus
              onChange={(event) => {
              // extremely jank way of keeping clear button visible but who cares 
              // clearRef?.classList.add('MuiAutocomplete-clearIndicatorDirty');  
              setSearch(event.target.value);
            }} 
          />
          */}


          {/* </div> */}



          {/* {props.showAdmin && <Button 
            startIcon={<SwapHoriz />}
            color="inherit" 
            onClick={() => props.setAdmin(!props.isAdmin)}>
              {props.isAdmin ? "User" : "Admin"}
          </Button>} */}


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