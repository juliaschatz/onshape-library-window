import classes from "*.module.css";
import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core";
import React from 'react';
import DocumentList from "./components/insertables/DocumentList";
import SearchBar from "./components/SearchBar";
import "./styles.css";
import { getIsAdmin } from "./utils/api";

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
  const [showAdmin, setShowAdmin] = React.useState(false);
  const GlobalCss = withStyles({
    // @global is handled by jss-plugin-global.
    '@global': {
      '.MuiSelect-selectMenu': {
        whiteSpace: "normal", // apparently MUI doesn't let you change this so here we are
      },
    },
  })(() => null);
  
  // …
  getIsAdmin().then((showAdm) => {
    setShowAdmin(showAdm);
  });
  

  return (
    <RecoilRoot >
    <div className={classes.root}>
      <GlobalCss />
      <SearchBar isAdmin={isAdmin} setAdmin={setIsAdmin} showAdmin={showAdmin} />
      {<DocumentList admin={isAdmin} />}
      {/*isAdmin && <DocumentList admin={true} />*/}
    </div>
    </RecoilRoot>
  );
}

export default App;
