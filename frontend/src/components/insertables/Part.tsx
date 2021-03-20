import { Grid, Paper, Typography } from "@material-ui/core";
import useStyles from './styles'
import PartIcon2 from '../../icons/SvgPartIcon'
import { OnshapeInsertable } from '../../utils/models/OnshapeInsertable';

interface PartProps {
    part: OnshapeInsertable
}

export default function Part(props: PartProps) {
    const classes = useStyles();
    
    return (
        <Grid item>
            <Paper className={classes.paper}>
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                >
                    <PartIcon2 className={classes.icon}/>
                    <Typography className={classes.title} variant='h5'>{props.part.name}</Typography>
                    <PartIcon2 className={classes.transparent}/>
                </Grid>
            </Paper>
        </Grid>
    )
}
