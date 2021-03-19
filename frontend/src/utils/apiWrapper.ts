import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from "./models/OnshapeInsertable";

import { getMkcadDocsFromApi, getOnshapeInsertablesFromApi } from "./api";

let onshapeDocs: OnshapeDocument[] = [];
let onshapeInsertables: OnshapeInsertable[] = [];

export async function load() {
  onshapeDocs = await getMkcadDocsFromApi();
  onshapeInsertables = await getOnshapeInsertablesFromApi();
  console.log('finished loading');
}

export async function getMkcadDocs(): Promise<OnshapeDocument[]> {
  // console.log(`onshape docs length: ${onshapeDocs.length}`)
  // if (onshapeDocs.length === 0) {
  //   onshapeDocs = await getMkcadDocsFromApi();
  // }
  if (onshapeDocs.length === 0) {
    await load();
  }
  return onshapeDocs;
}


export async function getOnshapeInsertables(): Promise<OnshapeInsertable[]> {
  // console.log(`onshape insertables length: ${onshapeInsertables.length}`);
  // if (onshapeInsertables.length === 0) {
  //   console.log('api called :(')
    // onshapeInsertables = await getOnshapeInsertablesFromApi();
  // }
  return onshapeInsertables;
}