import { forwardRef, HTMLAttributes } from "react";
import styled from "styled-components";

export type Props = HTMLAttributes<HTMLButtonElement> & {
  cursor?: string;
};

export const Action = forwardRef<HTMLButtonElement, Props>(({ cursor, ...props }, ref) => {
  return <ActionButton ref={ref} tabIndex={0} $cursor={cursor} {...props} />;
});

Action.displayName = "Action";

const ActionButton = styled.button<{ $cursor?: string }>`
  display: flex;
  position: relative;
  transition: color 0.2s;
  justify-content: center;

  margin: 0;
  padding: 5px;

  border: none;
  appearance: none;
  background: none;
  user-select: none;
  cursor: ${({ $cursor }) => $cursor || "pointer"};

  &:hover {
    color: var(--color-text-hover);
  }

  &:focus {
    outline: none;
    color: var(--color-text-hover);
  }

  &:active {
    color: var(--color-text-active);
  }
`;
