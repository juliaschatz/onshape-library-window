import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { OnshapeInsertable } from "../utils/models/OnshapeInsertable";
import QuantityField from "./fields/QuantityField";
import BooleanField from "./fields/BooleanField";
import EnumField from "./fields/EnumField";
import StringField from "./fields/StringField";

interface InsertDialogProps {
  insertable: OnshapeInsertable;
  open: boolean;
  setOpen: (open: boolean) => void;
  setConfigOpts: (configOpts: Object) => void;
  configOpts: {[key: string]: string};
  handleInsert: () => void;
}

export default function InsertDialog(props: InsertDialogProps) {
  const configOpts = props.configOpts;
  const setConfigOpts = props.setConfigOpts;
  const insertable = props.insertable;

  const [errors, setErrors] = React.useState({});

  const handleClose = () => {
    props.setOpen(false);
  };

  const hasErrorsInFields = (): boolean => {
    return Object.values(errors).some((a) => a);
  }

  const handleInsert = (): void => {
    window.focus();
    if (!hasErrorsInFields()) {
      props.handleInsert();
    }
  }

  return (
    <div>
      <Dialog open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg" >
        <DialogTitle id="form-dialog-title">Insert</DialogTitle>
        <DialogContent>
          {insertable.config && insertable.config.map((configItem) => {
            if (configItem.type === "QUANTITY") {
              return <div><QuantityField configItem={configItem} setResult={setConfigOpts} results={configOpts} setErrors={setErrors} errors={errors} /></div>;
            }
            else if (configItem.type === "BOOLEAN") {
              return <div><BooleanField configItem={configItem} setResult={setConfigOpts} results={configOpts} setErrors={setErrors} errors={errors} /></div>;
            }
            else if (configItem.type === "ENUM") {
              return <div><EnumField configItem={configItem} setResult={setConfigOpts} results={configOpts} setErrors={setErrors} errors={errors} /></div>;
            }
            else if (configItem.type === "STRING") {
              return <div><StringField configItem={configItem} setResult={setConfigOpts} results={configOpts} setErrors={setErrors} errors={errors} /></div>;
            }
            return "";
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleInsert} color="primary" disabled={hasErrorsInFields()}>
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
