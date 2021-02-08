import { makeStyles, Theme, createStyles } from "@material-ui/core";


export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: '15px',
      textAlign: 'center',
      color: theme.palette.text.secondary,
      backgroundColor: '#b0b0b8'
    },
    title: {
      color: 'white'
    },
    transparent: {
      color: '#b0b0b8'
    }
  })
);