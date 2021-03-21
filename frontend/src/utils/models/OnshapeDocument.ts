import { OnshapeInsertable } from "./OnshapeInsertable";

export interface OnshapeDocument {
    id: string;
    name: string;
    insertables: OnshapeInsertable[];
}