import { Theme, makeStyles, createStyles, Grid, Accordion, AccordionDetails, AccordionSummary, Typography, withStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';

import ExpandMore from '@material-ui/icons/ExpandMore';
import Part from './Part';
import Assembly from './Assembly';

import { OnshapeDocument } from '../../utils/models/OnshapeDocument'
import { OnshapeInsertable } from '../../utils/models/OnshapeInsertable';
import { getOnshapeInsertables } from '../../utils/apiWrapper';
import InsertableElement from './InsertableElement';
import { getAllDocumentInsertables } from "../../utils/api";
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            width: '100%',
            paddingTop: '0px',
        },
        rootdiv: {
            width: '100%',
            paddingTop: '10px',
            paddingBottom: '10px'
            
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular, 
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
    doc: OnshapeDocument,
    isLazyAllItems?: boolean,
}

export default function Document(props: DocumentProps) {
    const classes = useStyles();

  const [insertables, setInsertables] = useState<OnshapeInsertable[]>([]);
  const [latched, setLatched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    (async function () {
      if (!props.isLazyAllItems) {
        const allInsertables = await getOnshapeInsertables();
        const filtered = allInsertables.filter(item => item.documentId === props.doc.id);
        setInsertables(filtered);
      }
    })();
  }, [props.doc.id]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (props.isLazyAllItems && !latched) {
      setLatched(true);
      setIsLoading(true);
      getAllDocumentInsertables(props.doc.id).then((result) => {
        setInsertables(result);
      }).finally(() => {
        setIsLoading(false);
      })
    }
  }


  return (
    <div className={classes.rootdiv}>
      <Accordion className={classes.root} TransitionProps={{ timeout: 400 }}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummaryIconLeft
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={handleClick}
        >
          <Typography className={classes.heading}>{props.doc.name}</Typography>
          {isLoading && <CircularProgress /> }
        </AccordionSummaryIconLeft>
        <AccordionDetails>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems='stretch'
            spacing={1}
          >

                        {expanded && insertables.length > 0 && insertables.map((p) => {
                            return <InsertableElement insertable={p} />;
                        })}
                        
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}