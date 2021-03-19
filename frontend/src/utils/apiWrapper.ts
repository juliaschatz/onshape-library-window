import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from "./models/OnshapeInsertable";

import { getMkcadDocsFromApi, getOnshapeInsertablesFromApi, getOnshapeInsertablesThumbsFromApi } from "./api";

let onshapeDocs: OnshapeDocument[] = [];
let onshapeInsertables: Promise<OnshapeInsertable[]>;

export async function getMkcadDocs(): Promise<OnshapeDocument[]> {
  // console.log(`onshape docs length: ${onshapeDocs.length}`)
  // if (onshapeDocs.length === 0) {
  //   onshapeDocs = await getMkcadDocsFromApi();
  // }
  return getMkcadDocsFromApi();
}

let startedFetch: boolean = false;

export async function getOnshapeInsertables(): Promise<OnshapeInsertable[]> {
  if (!startedFetch) {
    startedFetch = true;
    console.log("Fetching insertables");
    const insertablePromise: Promise<OnshapeInsertable[]> = getOnshapeInsertablesFromApi();
    onshapeInsertables = insertablePromise;
  }
  return onshapeInsertables;
}