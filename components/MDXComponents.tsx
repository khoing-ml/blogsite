import React from "react";

const components: Record<string, any> = {};

export default function MDXContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
