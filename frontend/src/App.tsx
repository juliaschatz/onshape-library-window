import { makeStyles, Theme, createStyles, withStyles } from "@material-ui/core";
import React, { useEffect } from 'react';
import DocumentList from "./components/insertables/DocumentList";
import SearchBar from "./components/SearchBar";
import "./styles.css";
import { getIsAdmin } from "./utils/api";
import { isAdmin, getOnshapeInsertables } from "./utils/apiWrapper";

import { RecoilRoot } from "recoil";

import ReactGA from 'react-ga';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // backgroundColor: theme.palette.background.default

    }
  }
  ));
  

function App() {
  const classes = useStyles();
  const [isAdminMode, setIsAdminMode] = React.useState(false);
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
  
  isAdmin().then((showAdm) => {
    setShowAdmin(showAdm);
  });

  const GACode = 'UA-137025363-3';
  useEffect(() => {
    ReactGA.initialize( GACode, { debug: false });
    ReactGA.pageview(window.location.pathname + window.location.search);
    
  });
  

  return (
    <RecoilRoot >
    <div className={classes.root}>
      <GlobalCss />
      <SearchBar isAdmin={isAdminMode} setAdmin={setIsAdminMode} showAdmin={showAdmin} />
      {<DocumentList admin={isAdminMode} />}
      {/*isAdmin && <DocumentList admin={true} />*/}
    </div>
    </RecoilRoot>
  );
}

export default App;
