import * as React from "react";

import { SvgIcon } from "@material-ui/core";



function SvgConfigurablePartIcon(props: any) {
  return (
    <SvgIcon viewBox="0 0 20 20" width="2em" height="2em" {...props}>
      <path d="M9 1l6 .003L19 5v14H5l-4-4V9h8V1z" fill="#333"></path>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2h4.5L18 5.5V18H5.5L2 14.5V10h8V2z" fill="#fff"></path>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.68 1.32l3.924 3.93H18.5v.5h-4.75v8h-8v4.75h-.5v-4.896L1.323 9.677l.354-.354 3.927 3.927h7.292L9.323 9.677l.354-.354 3.573 3.573V5.604L9.32 1.68l.36-.36z" fill="#333"></path>
      <path fill="#90CEF1" d="M0 0h10v4H0z"></path><path fill="#fff" d="M0 4h10v4H0z"></path>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6 0H0v8h10V0H6zm0 1H4v2h2V1zm0 3H4v1h2V4zm1 1V4h2v1H7zM6 6H4v1h2V6zm1 1h2V6H7v1zm0-4V1h2v2H7zM1 1h2v2H1V1zm0 3h2v1H1V4zm0 2h2v1H1V6z" fill="#1651B0"></path>
    </SvgIcon>
  );
}

export default SvgConfigurablePartIcon;