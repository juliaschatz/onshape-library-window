import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { OnshapeInsertable } from '../utils/models/OnshapeInsertable';
import QuantityField from './fields/QuantityField';
import BooleanField from './fields/BooleanField';
import EnumField from './fields/EnumField';
import StringField from './fields/StringField';

interface InsertDialogProps {
  insertable: OnshapeInsertable;
  open: boolean;
  setOpen: (open: boolean) => void;
  setConfigOpts: ({}) => void;
  configOpts: {[key: string]: string};
  handleInsert: () => void;
}

export default function InsertDialog(props: InsertDialogProps) {
  var configOpts = props.configOpts;
  var setConfigOpts = props.setConfigOpts;
  var insertable = props.insertable;

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Insert</DialogTitle>
        <DialogContent>
          {insertable.config && insertable.config.map((configItem) => {
            if (configItem.type === "QUANTITY") {
              return <div><QuantityField configItem={configItem} setResult={setConfigOpts} results={configOpts}/></div>
            }
            else if (configItem.type === "BOOLEAN") {
              return <div><BooleanField configItem={configItem} setResult={setConfigOpts} results={configOpts}/></div>
            }
            else if (configItem.type === "ENUM") {
              return <div><EnumField configItem={configItem} setResult={setConfigOpts} results={configOpts}/></div>
            }
            else if (configItem.type === "STRING") {
              return <div><StringField configItem={configItem} setResult={setConfigOpts} results={configOpts}/></div>
            }
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={props.handleInsert} color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
