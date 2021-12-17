// Modified from https://github.com/selvagsz/react-async-button
import React, { ReactNode } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';
import { useAsync, AsyncState } from '@/hooks';

interface AsyncButtonProps {
  className?: string;
  loadingClass?: string;
  fulFilledClass?: string;
  rejectedClass?: string;
  disabled?: boolean;
  text?: string;
  pendingText?: string;
  fulFilledText?: string;
  rejectedText?: string;
  icon?: ReactNode;
  danger?: boolean;
  ghost?: boolean;
  onClick?: (...args: any[]) => void | Promise<void>;
}

const AsyncButton: React.FC<AsyncButtonProps> = (props) => {
  const { execute, status } = useAsync(props.onClick || noop);

  function noop() {}

  const {
    children,
    text,
    pendingText,
    fulFilledText,
    rejectedText,
    className = '',
    loadingClass = 'AsyncButton--loading',
    fulFilledClass = 'AsyncButton--fulfilled',
    rejectedClass = 'AsyncButton--rejected',
    disabled,
    ...attributes
  } = props;

  const isPending = status === AsyncState.PENDING;
  const isFulfilled = status === AsyncState.SUCCESS;
  const isRejected = status === AsyncState.ERROR;
  const isDisabled = disabled || isPending;
  let buttonText: ReactNode;

  if (isPending) {
    buttonText = pendingText;
  } else if (isFulfilled) {
    buttonText = fulFilledText;
  } else if (isRejected) {
    buttonText = rejectedText;
  }
  buttonText = buttonText || text || 'Confirm';

  function renderChildren() {
    const filhos = children || buttonText;
    if (typeof children === 'function')
      return children({
        buttonText,
        isPending,
        isFulfilled,
        isRejected,
      });
    return { filhos };
  }

  return (
    <Button
      {...attributes}
      className={classNames(className, {
        [loadingClass]: isPending,
        [fulFilledClass]: isFulfilled,
        [rejectedClass]: isRejected,
      })}
      disabled={isDisabled}
      loading={isPending}
      onClick={(event: any) => execute(event)}
    >
      {typeof children === 'function'
        ? children({
            buttonText,
            isPending,
            isFulfilled,
            isRejected,
          })
        : children || buttonText}
    </Button>
  );
};

export default AsyncButton;
