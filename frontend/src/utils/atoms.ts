import { atom } from 'recoil'
import { isPartStudioContext } from './api';
import { isAdmin } from './apiWrapper';

export const searchTextState = atom({
  key: "searchState",
  default: ""
});

export const searchOptionsState = atom({
  key: "searchOptions",
  default: {
    part: true,
    asm: !isPartStudioContext(),
    composite: false,
    config: false
  }
});