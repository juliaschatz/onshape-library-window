import { Checkbox, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { useRecoilState } from "recoil";
import { searchOptionsState } from "../../utils/atoms";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(0.5),
      marginTop: '0px',
      marginBottom: '0px',
      textAlign: 'center',
      background: 'transparent'
    },
    switch: {
      color: 'white'
    },
    red: {
      backgroundColor: 'red'
    },
    white: {
      color: 'white'
    }
  })
);

interface FilterSwitchProps {
  name: string;
  optionKey: 'part' | 'asm' | 'config';
}

export function FilterSwitch(props: FilterSwitchProps) {
  const classes = useStyles();
  const [searchOptions, setSearchOptions] = useRecoilState(searchOptionsState);

  let checked = false;
  switch (props.optionKey) {
    case 'part':
      checked = searchOptions.part;
      break;
    case 'asm':
      checked = searchOptions.asm;
      break;
    case 'config':
      checked = searchOptions.config;
      break;
  }

  function handleClick() {
    checked = !checked;
    let options = { ...searchOptions };
    switch (props.optionKey) {
      case 'part':
        options.part = checked;
        break;
      case 'asm':
        options.asm = checked;
        break;
      case 'config':
        options.config = checked;
        break;
    }
    console.log(options);
    setSearchOptions(options)
  }

  return (
    <Grid item xs={4}>
      <div
        className={classes.paper}
        onClick={handleClick}
      >
        <Checkbox checked={checked}
          color="secondary"
        />
        <span className={classes.white}>{props.name}</span>
      </div>
    </Grid>
  )
}