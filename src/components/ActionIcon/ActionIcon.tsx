import React, { ReactNode } from 'react';
import { useAsync } from '../../hooks';
import { LoadingOutlined } from '@ant-design/icons';
import { message, Popconfirm, Tooltip } from 'antd';

type MessageContent = ReactNode | (() => ReactNode);

interface ActionIconProps {
  baseIcon: ReactNode;
  disabled?: boolean;
  confirmPrompt?: MessageContent;
  okText?: string;
  cancelText?: string;
  successMessage?: MessageContent;
  errorMessage?: MessageContent | false;
  title?: ReactNode;
  handler: () => void | Promise<void>;
}

function ActionIcon(props: ActionIconProps) {
  const {
    handler = noop,
    baseIcon,
    confirmPrompt,
    disabled = false,
    title,
    successMessage,
    errorMessage = false,
  } = props;
  const { execute, error, loading } = useAsync(handler);

  async function noop() {}

  const showMessage = (success: boolean, err?: Error) => {
    if (success) {
      if (successMessage) {
        setTimeout(() => message.success(showMessage), 0);
      }
    } else {
      if (errorMessage === false) return;
      let msg = errorMessage;
      if (!msg) {
        if (err) {
          // todo: getErrorText
          msg = err.message;
        }
      } else {
        msg = 'Error completing operation';
      }
      msg && setTimeout(() => message.error(msg), 0);
    }
  };

  async function handleClick() {
    if (disabled) return;
    if (props.handler && !loading) {
      return execute()
        .then(() => {
          showMessage(true);
        })
        .catch((err) => {
          showMessage(false, err);
        });
    }
  }

  function base(onClick = handleClick) {
    const style = {
      cursor: 'pointer',
      ...(disabled ? { opacity: '25%' } : {}),
    };

    const render = () => (
      <span onClick={onClick} style={style}>
        {baseIcon}
      </span>
    );
    if (title) {
      return <Tooltip title={title}>{render()}</Tooltip>;
    }
    return render();
  }

  if (loading) return <LoadingOutlined />;
  if (error) {
    // TODO: Style
    return base();
  }
  if (confirmPrompt) {
    const { okText = 'Yes', cancelText = 'Cancel' } = props;
    return (
      <Popconfirm
        title={confirmPrompt}
        onConfirm={handleClick}
        okText={okText}
        cancelText={cancelText}
      >
        {base(noop)}
      </Popconfirm>
    );
  }
  return base();
}

export default ActionIcon;