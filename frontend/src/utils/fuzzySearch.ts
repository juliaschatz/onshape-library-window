import { OnshapeDocument } from "./models/OnshapeDocument";

import Fuse from 'fuse.js'

const options = {
  includeScore: true,

  keys: ['name']
}

export function search(searchTerm: string, docs: OnshapeDocument[]) {
  const fuse = new Fuse(docs, options);
  const results = fuse.search(searchTerm);
  return results;
}