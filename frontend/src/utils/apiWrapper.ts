import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from "./models/OnshapeInsertable";

import { getMkcadDocsFromApi, getOnshapeInsertablesFromApi } from './api'

let onshapeDocs: OnshapeDocument[] = [];

export async function getMkcadDocs(): Promise<OnshapeDocument[]> {
  if (onshapeDocs.length === 0) {
    onshapeDocs = await getMkcadDocsFromApi();
  }
  return onshapeDocs;
}

let onshapeInsertables: OnshapeInsertable[] = [];

export async function getOnshapeInsertables(): Promise<OnshapeInsertable[]> {
  if (onshapeInsertables.length === 0) {
    onshapeInsertables = await getOnshapeInsertablesFromApi();
  }
  return onshapeInsertables;
}