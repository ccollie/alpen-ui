import React from 'react';
import styled from 'styled-components';
import { mauve, blackA } from '@radix-ui/colors';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

const SCROLLBAR_SIZE = '10px';

const StyledScrollArea = styled(ScrollAreaPrimitive.Root)`
  width: 200px;
  height: 225px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 10px ${blackA.blackA7};
`;

const StyledViewport = styled(ScrollAreaPrimitive.Viewport)`
  width: 100%;
  height: 100%;
  border-radius: inherit;
`;

const StyledScrollbar = styled(ScrollAreaPrimitive.Scrollbar)`
  display: flex;
  user-select: none;
  touch-action: none;
  padding: 2px;
  background: ${blackA.blackA6};
  transition: background 160ms ease-out;
  &:hover {
    background: ${blackA.blackA8};
  }
  &[data-orientation='vertical'] {
    width: ${SCROLLBAR_SIZE};
  }
  &[data-orientation='horizontal'] {
    flex-direction: column;
    height: ${SCROLLBAR_SIZE};
  }
`;

const StyledThumb = styled(ScrollAreaPrimitive.Thumb)`
  flex: 1;
  background: ${mauve.mauve10};
  border-radius: ${SCROLLBAR_SIZE}
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 44px;
    min-height: 44px
  }
`;

const StyledCorner = styled(ScrollAreaPrimitive.Corner)`
  background: ${blackA.blackA8};
`;

// Exports
export const ScrollArea = StyledScrollArea;
export const ScrollAreaViewport = StyledViewport;
export const ScrollAreaScrollbar = StyledScrollbar;
export const ScrollAreaThumb = StyledThumb;
export const ScrollAreaCorner = StyledCorner;
