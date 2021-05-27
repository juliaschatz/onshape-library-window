import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from "./models/OnshapeInsertable";

import { getDocsFromApi, getOnshapeInsertablesFromApi, getIsAdmin } from "./api";

//let onshapeDocs: OnshapeDocument[] = [];
let onshapeInsertables: Promise<OnshapeInsertable[]>;

export async function getDocs(): Promise<OnshapeDocument[]> {
  // console.log(`onshape docs length: ${onshapeDocs.length}`)
  // if (onshapeDocs.length === 0) {
  //   onshapeDocs = await getDocsFromApi();
  // }
  let docs = await getDocsFromApi();
  docs.forEach(doc => {
    doc.insertables = [];
  })
  return docs;
}

let startedFetch: boolean = false;

export async function getOnshapeInsertables(): Promise<OnshapeInsertable[]> {
  if (!startedFetch) {
    startedFetch = true;
    const insertablePromise: Promise<OnshapeInsertable[]> = getOnshapeInsertablesFromApi();
    onshapeInsertables = insertablePromise;
  }
  return onshapeInsertables;
}

// Initiate data request asap
getOnshapeInsertables();

let isAdminResult: boolean = false;
let knowsAdmin: boolean = false;
export async function isAdmin(): Promise<boolean> {
  if (!knowsAdmin) {
    knowsAdmin = true;
    isAdminResult = await getIsAdmin();
  }
  return isAdminResult;
}