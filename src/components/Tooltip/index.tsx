import React from 'react';
import styled, { keyframes } from 'styled-components';
import { violet } from '@radix-ui/colors';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const StyledContent = styled(TooltipPrimitive.Content)`
  border-radius: 4px;
  padding: 10px 15px;
  font-size: 15px;
  line-height: 1px;
  color: ${violet.violet11};
  background-color: white;
  box-shadow:
    hsl(206 22% 7% / 35%) 0 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  @media (prefers-reduced-motion: no-preference) {
    animation-duration: 400ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
    &[data-state="delayed-open"] {
      &[data-side="top"] { animation-name: ${slideDownAndFade} },
      &[data-side="right"] { animation-name: ${slideLeftAndFade} },
      &[data-side="bottom"] { animation-name: ${slideUpAndFade} },
      &[data-side="left"] { animation-name: ${slideRightAndFade} },
    }
  }
`;

const StyledArrow = styled(TooltipPrimitive.Arrow)`
  fill: white;
`;

// Exports
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = StyledContent;
export const TooltipArrow = StyledArrow;
