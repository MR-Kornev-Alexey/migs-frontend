import React from 'react';
import type { SVGProps } from 'react';

export function LineMdPlayFilledToPauseTransition(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}>
      <g fill="#9f093e" stroke="#9f093e" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3}>
        <path d="M9 18L7 18L7 6L9 6L9 18"></path>
        <path d="M15 6L17 6L17 18L15 18L15 6"></path>
      </g>
    </svg>
  );
}
