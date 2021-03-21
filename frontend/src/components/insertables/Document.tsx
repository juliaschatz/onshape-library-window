import { Theme, makeStyles, createStyles, Grid, Accordion, AccordionDetails, AccordionSummary, Typography, withStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';

import ExpandMore from '@material-ui/icons/ExpandMore';

import { OnshapeDocument } from '../../utils/models/OnshapeDocument'
import { OnshapeInsertable } from '../../utils/models/OnshapeInsertable';
import { getOnshapeInsertables } from '../../utils/apiWrapper';
import InsertableElement from './InsertableElement';
import { getAllDocumentInsertables } from "../../utils/api";
import { CircularProgress } from '@material-ui/core';

import { searchOptionsState } from "../../utils/atoms";
import { useRecoilValue } from 'recoil';

import { insertablesSearch } from '../../utils/fuzzySearch'

import Fuse from 'fuse.js';

const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        root: {
            width: '100%',
            paddingTop: '0px',
        },
        rootdiv: {
            width: '100%',
            paddingTop: '2px',
            paddingBottom: '2px'
            
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
  searchText: string
}

export default function Document(props: DocumentProps) {
  const classes = useStyles();

  const [insertables, setInsertables] = useState<OnshapeInsertable[]>([]);
  const [latched, setLatched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);

  const searchOptions = useRecoilValue(searchOptionsState);

  const resetInsertables = () => {
    getOnshapeInsertables().then((allInsertables) => {
      const filtered = allInsertables.filter(item => item.documentId === props.doc.id);
      setInsertables(filtered);
    });
  };

  useEffect(() => {
    (async function () {
      if (!props.isLazyAllItems) {
        resetInsertables();
      }
    })();
  }, [props.doc.id]);

  useEffect(() => {
    (async function () {
      setExpanded(false);
      setLatched(false);
      setInsertables([]);
      if (!props.isLazyAllItems) {
        resetInsertables();
      }
    })();
  }, [props.isLazyAllItems]);

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

  const filtered = insertables.filter(p => {
    if (!searchOptions.part && !searchOptions.asm && !searchOptions.config && !searchOptions.composite) {
      return true;
    }
    if (searchOptions.asm === (p.type === 'ASSEMBLY') && !searchOptions.config) {
      return true;
    }
    if ((searchOptions.part === (p.type === "PART") || searchOptions.part === (p.type === 'PARTSTUDIO')) && searchOptions.asm === (p.type === "ASSEMBLY") && searchOptions.config === (p.config.length > 0)) {
      return true;
    }
    if (searchOptions.config && !searchOptions.part && !searchOptions.asm && p.type === 'ASSEMBLY') {
      return true;
    }
    return false;
  });

  if (filtered.length === 0 && !props.isLazyAllItems) {
    return (<></>);
  }

  let searchedInsertables: OnshapeInsertable[] = []
  if (props.searchText !== '') {
    searchedInsertables = insertablesSearch(props.searchText, filtered).map((item) => item.item);
  }
  else {
    searchedInsertables = filtered;
  }

  if (searchedInsertables.length === 0 && !props.isLazyAllItems) {
    return (<></>);
  }

  return (
    <div className={classes.rootdiv}>
      <Accordion className={classes.root} TransitionProps={{ timeout: 400 }}
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
      >
        <AccordionSummaryIconLeft
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onClick={handleClick}
        >
          <Typography className={classes.heading}>{props.doc.name}&nbsp;&nbsp;&nbsp;</Typography>
          
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
            {expanded && searchedInsertables && searchedInsertables.length > 0 && searchedInsertables.sort((a, b) => a.name.localeCompare(b.name)).map((p, index) => {
              return (<InsertableElement insertable={p} key={index} isAdminElement={!!props.isLazyAllItems} />);
            })}
                        
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
    )
}