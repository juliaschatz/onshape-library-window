import { atom } from 'recoil'

export const searchTextState = atom({
  key: "searchState",
  default: ""
});

export const searchOptionsState = atom({
  key: "searchOptions",
  default: {
    part: true,
    asm: true,
    composite: false,
    config: false
  }
});