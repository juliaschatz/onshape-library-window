import { Grid, Paper, Typography } from "@material-ui/core";
import useStyles from './styles'
import PartIcon2 from '../../icons/SvgPartIcon'
import InsertDialog from '../InsertDialog';
import { OnshapeInsertable } from '../../utils/models/OnshapeInsertable';

interface PartProps {
    title: string;
    insertable: OnshapeInsertable;
}

export default function Part(props: PartProps) {
    const classes = useStyles();
    
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {

    };

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
                    <Typography className={classes.title} variant='h5'>{props.insertable.name}</Typography>
                    <PartIcon2 className={classes.transparent}/>
                </Grid>
            </Paper>
        </Grid>
        
    )
}
