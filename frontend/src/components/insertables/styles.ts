import { makeStyles, Theme, createStyles } from "@material-ui/core";

const iconSize = "1.5em";
const assemblyIconSize = "2em";

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: "15px",
      textAlign: "center",
      color: theme.palette.text.secondary,
      backgroundColor: "#b0b0b8"
    },
    title: {
      color: "white"
    },
    transparent: {
      // display: 'hidden',
      // width: '2em',
      // height: '2em'
      // flexGrow: 
      visibility: "hidden",
      width: iconSize,
      height: iconSize
    },
    icon: {
      width: iconSize,
      height: iconSize
    },
    assemblyIcon: {
      width: assemblyIconSize,
      height: assemblyIconSize
    }
  })
);