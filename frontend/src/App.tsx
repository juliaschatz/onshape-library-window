import classes from "*.module.css";
import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core";
import React from 'react';
import DocumentList from "./components/insertables/DocumentList";
import SearchBar from "./components/SearchBar";
import AdminWindow from "./components/AdminWindow";
import "./styles.css";

import { RecoilRoot } from "recoil";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // backgroundColor: theme.palette.background.default

    }
  }
  ));
  

function App() {
  const classes = useStyles();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const GlobalCss = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {
      '.MuiSelect-selectMenu': {
        whiteSpace: "normal", // apparently MUI doesn't let you change this so here we are
      },
    },
  })(() => null);
  
  // …
  
  

  return (
    <RecoilRoot >
    <div className={classes.root}>
      <GlobalCss />
      <SearchBar isAdmin={isAdmin} setAdmin={setIsAdmin} showAdmin={true} />
      {!isAdmin && <DocumentList />}
      {isAdmin && <AdminWindow />}
    </div>
    </RecoilRoot>
  );
}

export default App;
