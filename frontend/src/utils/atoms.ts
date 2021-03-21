import { atom } from 'recoil'

export const searchTextState = atom({
  key: "searchState",
  default: ""
});

export const searchOptionsState = atom({
  key: "searchOptions",
  default: {
    part: false,
    asm: false,
    composite: false,
    config: false
  }
});