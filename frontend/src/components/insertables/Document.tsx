import { Theme, makeStyles, createStyles, Grid, Paper, Accordion, AccordionDetails, AccordionSummary, Typography, withStyles } from '@material-ui/core';
import React from 'react';

import ExpandMore from '@material-ui/icons/ExpandMore';
import Part from './Part';
import Assembly from './Assembly';



// const useStyles = makeStyles((theme: Theme) => 
//     createStyles({
//         root: {
//             // display: 'flex',
//             background: 'gray',
//             // width: '800',
//             // flexGrow: 1
//             // flexBasis: 'auto'
            
//         },
//         grow: {
//             flexGrow: 1
//         },
//         card: {
//             background: 'gray',
//             // paddingLeft: '20%'
            
//         },
//         details: {
//             display: 'flex',
//             flexDirection: 'column',
//         },
//         paper: {
//             // flex: '1 0 auto',
//             padding: theme.spacing(2),
//             width: '90%',
//             backgroundColor: 'gray'

//         },
//         iconStyle: {
//             width: iconSize,
//             height: iconSize,
//         }
//     }
// ));

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            width: '100%',
            paddingTop: '0px',
            // backgroundColor: 'gray'
        },
        rootdiv: {
            width: '100%',
            paddingTop: '10px',
            paddingBottom: '10px'
            
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
            // color: 'white',

            
        },
    })
);
const AccordionSummaryIconLeft = withStyles({
    expandIcon: {
        order: -1,
        
    },
    content: {
        paddingLeft: '20px'
    }
})(AccordionSummary);


export default function Document() {
    const classes = useStyles();

    return (
        <div className={classes.rootdiv}>
            <Accordion className={classes.root}>
                <AccordionSummaryIconLeft
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>Example doc title</Typography>
                </AccordionSummaryIconLeft>
                <AccordionDetails>
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems='stretch'
                        spacing={1}
                    >
                        <Part title='test'/>
                        <Part title='test title 2'/>
                        <Part title='17t Sprocket'/>
                        <Part title='18t Sprocket'/>
                        <Part title='42t 20dp Gear'/>
                        <Part title='VersaHub' />
                        
                        <Assembly title='wcp gearbox' />
                        
                    </Grid>
                    {/* <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography> */}
                </AccordionDetails>
            </Accordion>
        </div>
    )
}