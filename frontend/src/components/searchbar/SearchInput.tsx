
import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import withStyles from "@material-ui/core/styles/withStyles";

import { Avatar, Chip, makeStyles, Theme } from '@material-ui/core'

import { useState } from 'react';

import classNames from "classnames";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: theme.spacing(6),
    display: "flex",
    justifyContent: "space-between",
  },
  iconButton: {
    color: theme.palette.action.active,
    transform: "scale(1, 1)",
    transition: theme.transitions.create(["transform", "color"], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  iconButtonHidden: {
    transform: "scale(0, 0)",
    "& > $icon": {
      opacity: 0,
    },
  },
  searchIconButton: {
    marginRight: theme.spacing(-6),
  },
  icon: {
    transition: theme.transitions.create(["opacity"], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  input: {
    width: "100%",
  },
  searchContainer: {
    margin: "auto 16px",
    width: `calc(100% - ${theme.spacing(6 + 4)}px)`, // 6 button + 4 margin
  },
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

  // const iconClassName = value != '' ? classes.iconButton : classes.iconButtonHidden;
  const iconClassName = classes.iconButton;


  return (
    <Paper className={classNames(classes.root, props.className)}>
      <div className={classes.searchContainer}>
        <Input
          value={value}
          fullWidth
          className={classes.input}
          disableUnderline
          disabled={props.disabled}
          onChange={(e) => {
            if (props.onChange) {
              props.onChange(e.target.value);
            }
            setValue(e.target.value);
          }}
        />
          {/* <Chip size="small" avatar={<Avatar>M</Avatar>} label="Clickable" /> */}
        {/* </Input> */}
        {value === '' && <IconButton
          onClick={(e) => {
            if (props.onRequestSearch) {
              props.onRequestSearch(value);
            }
          }}
          // className={iconClassName}
          className={classNames(classes.iconButton, classes.searchIconButton, {
            [classes.iconButtonHidden]: value !== "",
          })}
        >
          {React.cloneElement(<SearchIcon />, {
            classes: {
              root: classes.icon
            }
          })}
        </IconButton>}

        {value !== '' && <IconButton
          // onClick={handleCancel}
          onClick={() => {
            setValue('');
          }}
          // className={classes.iconButtonHidden}
          className={classNames(classes.iconButton, classes.searchIconButton, {
            [classes.iconButtonHidden]: value === "",
          })}
        // disabled={disabled}
        >
          {React.cloneElement(<ClearIcon />, {
            classes: { root: classes.icon },
          })}
        </IconButton>}

      </div>
    </Paper>
  )
}