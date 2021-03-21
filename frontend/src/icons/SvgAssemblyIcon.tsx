import * as React from "react";

import { SvgIcon } from "@material-ui/core";

function SvgAssemblyIcon(props: any) {
  return (
    <SvgIcon viewBox="0 0 20 20" width="1em" height="1em" {...props}>
      <path d="M1 1h14l4 4v14H5l-4-4V1z" fill="#333" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 14.5V2h12.5L18 5.5V18H5.5L2 14.5z"
        fill="#fff"
      />
      <path d="M2 2h8l3.5 3.5v8h-8L2 10V2z" fill="#999" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.677 1.323L5.604 5.25h7.292L9.323 1.677l.354-.354 3.927 3.927H18.5v.5h-4.75v8h-8v4.75h-.5v-4.896L1.323 9.677l.354-.354 3.573 3.573V5.604L1.323 1.677l.354-.354zM5.75 13.25h7.5v-7.5h-7.5v7.5z"
        fill="#333"
      />
    </SvgIcon>
  );
}

export default SvgAssemblyIcon;