import { Theme, makeStyles, createStyles, Grid, Paper, Accordion, AccordionDetails, AccordionSummary, Typography, withStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import ExpandMore from '@material-ui/icons/ExpandMore';
import Part from './Part';
import Assembly from './Assembly';
import CompositePart from './CompositePart';

import { OnshapeDocument } from '../../utils/models/OnshapeDocument'
import { OnshapeInsertable } from '../../utils/models/OnshapeInsertable';
import { getMkcadDocs, getOnshapeInsertables } from '../../utils/apiWrapper';


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

interface DocumentProps {
    doc: OnshapeDocument
}

export default function Document(props: DocumentProps) {
    const classes = useStyles();

    const [insertables, setInsertables] = useState<OnshapeInsertable[]>([]);

    useEffect(() => {
        (async function () {
            const allInsertables = await getOnshapeInsertables();
            const filtered = allInsertables.filter(item => item.documentId === props.doc.id);
            setInsertables(filtered);
        })();
    }, [])


    return (
        <div className={classes.rootdiv}>
            <Accordion className={classes.root}>
                <AccordionSummaryIconLeft
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography className={classes.heading}>{props.doc.name}</Typography>
                </AccordionSummaryIconLeft>
                <AccordionDetails>
                    <Grid
                        container
                        direction="column"
                        justify="flex-start"
                        alignItems='stretch'
                        spacing={1}
                    >
                        {/* <Part title='test'/>
                        <Part title='test title 2'/>
                        <Part title='17t Sprocket'/>
                        <Part title='18t Sprocket'/>
                        <Part title='42t 20dp Gear'/>
                        <Part title='VersaHub' />
                        
                        <Assembly title='wcp gearbox' />

                        <CompositePart title="test" /> */}

                        {insertables.length > 0 && insertables.map(p => (<p key={p.elementId}>{p.name}</p>))}
                        
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