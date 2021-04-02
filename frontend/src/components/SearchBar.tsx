import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { Button, Grid } from "@material-ui/core";
import { SwapHoriz } from "@material-ui/icons";

import "./SearchBar.css";

import { FilterSwitch } from './searchbar/FilterSwitch';

import { SearchInput } from "./searchbar/SearchInput";


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

  return (
    <div >
      <AppBar position="static" color={props.isAdmin ? "secondary" : "primary"} className={classes.root}>
        <Toolbar>
          <Grid container spacing={1}>
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
            <FilterSwitch name="Part" optionKey="part"/>
            <FilterSwitch name="Assembly" optionKey="asm"/>
            <FilterSwitch name="Configurable" optionKey="config"/>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}