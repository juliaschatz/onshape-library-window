
import { Grid, Paper, Typography } from "@material-ui/core";



import useStyles from './styles'

import PartIcon2 from '../../icons/SvgPartIcon'
import { OnshapeInsertable } from '../../utils/models/OnshapeInsertable';


interface PartProps {
    part: OnshapeInsertable
}

// function PartSVGIcon() {
//     console.log(PartIcon2);
//     return (
//         <>
//             <SvgIcon viewBox="0 0 50 50" color='primary'>
//                 {PartIcon2}
//             </SvgIcon>
//         </>
//     )
// }

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
                    {/* <PartIcon /> */}
                    <PartIcon2 className={classes.icon}/>
                    {/* <Divider flexItem variant='fullWidth' /> */}
                    <Typography className={classes.title} variant='h5'>{props.part.name}</Typography>
                    {/* <Typography variant='h5'></Typography> */}
                    <PartIcon2 className={classes.transparent}/>
                    {/* <Grid item xs={6} sm={12} /> */}
                </Grid>
            </Paper>
        </Grid>
    )
}
