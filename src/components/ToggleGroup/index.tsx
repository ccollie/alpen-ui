import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { violet, blackA, mauve } from '@radix-ui/colors';
import styled from 'styled-components';

const StyledToggleGroup = styled(ToggleGroupPrimitive.Root)`
  display: inline-flex;
  background-color: ${mauve.mauve6};
  border-radius: 4px;
  box-shadow: 0 2px 10px ${blackA.blackA7};
`;

const StyledItem = styled(ToggleGroupPrimitive.Item)`
  all: unset;
  background-color: white;
  height: 35px;
  width: 35px;
  display: flex;
  font-size: 15px;
  line-height: 1px;
  align-items: center;
  justify-content: center;
  margin-left: 1px;
  &:first-child {
    margin-left: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  &:hover {
    background-color: ${violet.violet3};
  }
  &[data-state='on'] {
    background-color: ${violet.violet5};
    color: ${violet.violet11};
  }
  &:focus {
    position: relative;
    box-shadow: 0 0 0 2px black;
  }
`;

// Exports
export const ToggleGroup = StyledToggleGroup;
export const ToggleGroupItem = StyledItem;
