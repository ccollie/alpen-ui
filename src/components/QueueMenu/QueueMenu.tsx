import { QueueActions } from '../../@types';
import { Queue } from '@/api';
import React from 'react';
import { Menu, Dropdown, Tooltip } from 'antd';
import { FaBatteryEmpty } from 'react-icons/fa';
import { Modal } from 'antd';
import { useDisclosure } from '@/hooks';
import DeleteQueueDialog from './DeleteQueueDialog';

import {
  CloseOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PauseOutlined,
  PlaySquareOutlined,
  MoreOutlined,
} from '@ant-design/icons';
const { confirm } = Modal;

type QueueMenuProps = {
  queue: Queue;
  actions: QueueActions;
};

const QueueMenu: React.FC<QueueMenuProps> = (props) => {
  const { queue, actions } = props;
  const queueId = queue.id;
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onClose: closeDeleteDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  function pause() {
    return actions.pauseQueue(queueId);
  }

  function resume() {
    return actions.resumeQueue(queueId);
  }

  async function handleDrainQueue(): Promise<void> {
    // TODO: add a special drain Confirm dialog to capture "delayed" option
    await actions.drainQueue(queueId, true);
  }

  function drain() {
    confirm({
      title: 'Drain Queue',
      icon: <ExclamationCircleOutlined />,
      content: 'Remove all waiting or delayed jobs',
      onOk() {
        return handleDrainQueue();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  function remove() {
    confirm({
      title: 'Remove Queue',
      icon: <ExclamationCircleOutlined />,
      content:
        'Non-destructively remove the queue from the host. <br/> This queue can be re-added to the interface',
      onOk() {
        return actions.unregisterQueue(queueId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  async function handleDelete(): Promise<void> {
    await actions.deleteQueue(queueId);
  }

  const iconStyle = {
    marginRight: '3px',
  };

  const menu = (
    <Menu>
      {queue.isPaused ? (
        <Menu.Item onClick={resume} key="queue-resume-menu-item">
          <PlaySquareOutlined style={iconStyle} /> Resume
        </Menu.Item>
      ) : (
        <Menu.Item onClick={pause} key="queue-pause-menu-item">
          <PauseOutlined style={iconStyle} /> Pause
        </Menu.Item>
      )}
      <Menu.Item onClick={drain} key="queue-drain-menu-item">
        <FaBatteryEmpty style={iconStyle} /> Drain
      </Menu.Item>
      <Menu.Item onClick={remove} key="queue-remove-menu-item">
        <CloseOutlined style={iconStyle} /> Remove
      </Menu.Item>
      <Menu.Item danger onClick={openDeleteDialog} key="queue-delete-menu-item">
        <DeleteOutlined style={iconStyle} /> Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <DeleteQueueDialog
        queue={queue}
        onDelete={handleDelete}
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
      />
      <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <Tooltip title="Actions">
            <MoreOutlined />
          </Tooltip>
        </a>
      </Dropdown>
    </>
  );
};

export default QueueMenu;
