"use client";
import React from "react";

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const whyDidYouRender = require("@welldone-software/why-did-you-render");

  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    logOnDifferentValues: true,
  });
}

export default function Wdyr() {
  return null;
}
