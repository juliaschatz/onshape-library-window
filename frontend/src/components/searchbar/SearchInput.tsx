import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import ClearIcon from "@material-ui/icons/Clear";

import { makeStyles, Theme } from '@material-ui/core';

import { useState } from 'react';

import { useSetRecoilState } from "recoil";
import { searchTextState } from "../../utils/atoms";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    padding: '6px',
    backgroundColor: 'white',
    marginTop: '10px',
    borderRadius: '5px',
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

export function SearchInput() {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const setSearchText = useSetRecoilState(searchTextState);

  function handleSearchInputChange(searchValue: string) {
    setValue(searchValue);
    setSearchText(searchValue);
  }

  return (
    <div className={classes.root}>
      <Input
        className={classes.input}
        disableUnderline
        value={value}
        placeholder="Search"
        onChange={(e) => handleSearchInputChange(e.target.value)}
      />
      {value !== '' && <IconButton size="small" onClick={() => {setValue(''); handleSearchInputChange('')}}>
        <ClearIcon />
      </IconButton>}
    </div>
  )
}