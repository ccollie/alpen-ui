import React from 'react';
import styled from 'styled-components';
import { violet, blackA } from '@radix-ui/colors';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

const StyledCheckbox = styled(CheckboxPrimitive.Root)`
  all: unset;
  background-color: white;
  width: 25px;
  height: 25px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px ${blackA.blackA7};
  &:hover {
    background-color: ${violet.violet3};
  }
  &:focus {
    box-shadow: 0 0 0 2px black;
  }
`;

const StyledIndicator = styled(CheckboxPrimitive.Indicator)`
  color: ${violet.violet11};
`;

// Exports
export const Checkbox = StyledCheckbox;
export const CheckboxIndicator = StyledIndicator;
