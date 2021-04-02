
import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import withStyles from "@material-ui/core/styles/withStyles";

import { Avatar, Chip, makeStyles, Theme, TextField, PopperProps } from '@material-ui/core';

import { useState } from 'react';

import classNames from "classnames";
import { Autocomplete } from "@material-ui/lab";
import { useRecoilState } from "recoil";
import { searchOptionsState } from "../../utils/atoms";

// const useStyles = makeStyles((theme: Theme) => ({
//   root: {
//     height: theme.spacing(6),
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   iconButton: {
//     color: theme.palette.action.active,
//     transform: "scale(1, 1)",
//     transition: theme.transitions.create(["transform", "color"], {
//       duration: theme.transitions.duration.shorter,
//       easing: theme.transitions.easing.easeInOut,
//     }),
//   },
//   iconButtonHidden: {
//     transform: "scale(0, 0)",
//     "& > $icon": {
//       opacity: 0,
//     },
//   },
//   searchIconButton: {
//     marginRight: theme.spacing(-6),
//   },
//   icon: {
//     transition: theme.transitions.create(["opacity"], {
//       duration: theme.transitions.duration.shorter,
//       easing: theme.transitions.easing.easeInOut,
//     }),
//   },
//   input: {
//     width: "100%",
//   },
//   searchContainer: {
//     margin: "auto 16px",
//     width: `calc(100% - ${theme.spacing(6 + 4)}px)`, // 6 button + 4 margin
//   },
//   searchColor: {
//     color: 'white'
//   },
//   autocomplete: {
//     marginTop: '10px',
//     marginBottom: '10px'
//   }
// }));

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    // height: '25px',
    padding: '6px',
    backgroundColor: 'white',
    marginTop: '10px',
    borderRadius: '5px',
    // borderColor: 'black',
    borderStyle: 'solid',
    minHeight: '36px'

  },
  chips: {
    margin: '2px',
  },
  input: {
    marginLeft: '5px',
    flexGrow: 1
  }
}));

interface SearchInputProps {
  cancelOnEscape?: boolean;
  classes?: {
    root?: string,
    iconButton?: string,
    iconButtonHidden?: string,
    iconButtonDisabled?: string,
    searchIconButton?: string,
    icon?: string,
    input?: string,
    searchContainer?: string
  };
  className: string;
  closeIcon?: JSX.Element;
  disabled?: boolean;
  onCancelSearch?(): void;
  onChange?(query: string): void;
  onRequestSearch?(query: string): void;
  placeholder?: string;
  searchIcon?: JSX.Element;
  style?: object;
  // value?: string;
}


export function SearchInput(props: SearchInputProps) {
  const classes = useStyles();
  const [value, setValue] = useState('');
  // const searchOptions = useRecoilValue(searchOptionsState);
  const [searchOptions, setSearchOptions] = useRecoilState(searchOptionsState);

  // const iconClassName = value != '' ? classes.iconButton : classes.iconButtonHidden;
  // const iconClassName = classes.iconButton;

  function handleChipDelete(key: 'part' | 'asm' | 'config') {
    let options = { ...searchOptions };
    options[key] = false;
    setSearchOptions(options);
  }

  return (
    <div className={classes.root}>
      {searchOptions.part && <Chip
        className={classes.chips}
        label="Part"
        onDelete={() => handleChipDelete('part')}
      />}
      {searchOptions.asm && <Chip
        className={classes.chips}
        label="Assembly"
        onDelete={() => handleChipDelete('asm')}
      />}
      {searchOptions.config && <Chip
        className={classes.chips}
        label="Configurable"
        onDelete={() => handleChipDelete('config')}
      />}
      <Input
        className={classes.input}
        disableUnderline
        value={value}
        placeholder="Search"
        onChange={(e) => setValue(e.target.value)}
      />
      {value !== '' && <IconButton size="small" onClick={() => setValue('')}>
        <ClearIcon />
      </IconButton>}
    </div>
  )

}

const searchOptions: SearchOption[] = [
  { title: 'Part', tag: 'part' },
  { title: 'Assembly', tag: 'asm' },
  // { title: "Composite", tag: "composite" },
  { title: 'Configurable', tag: 'config' }
];

interface SearchOption {
  title: string;
  tag: string
}

function PopperPlaceholder(props: PopperProps) {
  return (<></>)
}