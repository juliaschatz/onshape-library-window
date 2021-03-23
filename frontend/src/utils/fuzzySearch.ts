import { OnshapeDocument } from "./models/OnshapeDocument";
import { OnshapeInsertable } from './models/OnshapeInsertable'

import Fuse from 'fuse.js'

const options = {
  includeScore: true,
  // keys: ['name']
  threshold: 0.4,
  keys: ['name', 'insertables.name']
}

export function search(searchTerm: string, docs: OnshapeDocument[]) {
  const fuse = new Fuse(docs, options);
  const results = fuse.search(searchTerm);
  return results;
}

const insertablesOptions = {
  includeScore: true,
  threshold: 0.4,
  keys: ['name']
}

export function insertablesSearch(searchTerm: string, insertables: OnshapeInsertable[]) {
  const fuse = new Fuse(insertables, insertablesOptions);
  const results = fuse.search(searchTerm);
  return results;
}