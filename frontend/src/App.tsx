import classes from '*.module.css';
import { makeStyles, Theme, createStyles } from '@material-ui/core';
import React from 'react';
import DocumentList from './components/insertables/DocumentList';
import SearchBar from './components/SearchBar';
import './styles.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // backgroundColor: theme.palette.background.default

    }
  }
));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SearchBar />
      <DocumentList />
      
    </div>
  );
}

export default App;
