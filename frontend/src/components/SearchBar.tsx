import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import React, { useEffect, useState } from 'react'

import { Button, Grid } from "@material-ui/core";
import { SwapHoriz } from "@material-ui/icons";

import "./SearchBar.css";

import { SearchInput } from "./searchbar/SearchInput";
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { useRecoilState } from "recoil";
import { searchOptionsState } from "../utils/atoms";
import SvgPartIcon from '../icons/SvgPartIcon';
import SvgAssemblyIcon from '../icons/SvgAssemblyIcon';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    root: {
      margin: '5px',
      borderRadius: '5px',
      paddingBottom: '5px'
    },
    searchColor: {
      color: "white"
    },
    paper: {
      padding: theme.spacing(2),
      marginTop: '10px',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    searchBar: {
      marginTop: '10px',
    },
    adminButton: {
      marginTop: '10px',
      marginLeft: '25%',
      textAlign: 'center'
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
  const [searchOptions, setSearchOptions] = useRecoilState(searchOptionsState);
  const [mySearchOpts, setMySearchOpts] = useState<string[]>([]);

  useEffect(() => {
    let arr: string[] = [];
    if (searchOptions.part) {
      arr.push("part");
    }
    if (searchOptions.asm) {
      arr.push("asm");
    }
    if (searchOptions.config) {
      arr.push("config");
    }
    setMySearchOpts(arr);
  }, [searchOptions]);

  const toggleStyles = makeStyles((theme) => ({
    root: () => {
      return {
        color: 'white !important',
        selected: {
          color: 'white !important'
        }
      };
    },
    selected: () => {
      return {
        color: 'white !important'
      };
    }
  }));

  const handleChange = (event: React.MouseEvent<HTMLElement>, newSetting: string[]) => {
    setMySearchOpts(newSetting);
    let options = { ...searchOptions };
    options.part = newSetting.includes("part");
    options.asm = newSetting.includes("asm");
    options.config = newSetting.includes("config");
    setSearchOptions(options);
  }

  return (
    <div >
      <AppBar position="static" color={props.isAdmin ? "secondary" : "primary"} className={classes.root}>
        <Toolbar>
          <Grid container>
            <Grid item xs={(props.showAdmin ? 9 : 12)}>
              <div>
                <SearchInput />
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
            <Grid item xs={12}>
              <ToggleButtonGroup value={mySearchOpts} onChange={handleChange} aria-label="search options" size="small">
                <ToggleButton value="part" aria-label="part" classes={toggleStyles()}>
                  <SvgPartIcon />
                </ToggleButton>
                <ToggleButton value="asm" aria-label="assembly" classes={toggleStyles()}>
                  <SvgAssemblyIcon />
                </ToggleButton>
                <ToggleButton value="config" aria-label="configurable only" classes={toggleStyles()}>
                  Configurable Only
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
          
        </Toolbar>
      </AppBar>
    </div>
  );
}