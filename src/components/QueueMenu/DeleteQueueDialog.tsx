import { Form, Input, Modal, Typography } from 'antd';
import React, { useState } from 'react';
import { Queue } from '@/api';
import { useDisclosure } from '@/hooks';
const { Title } = Typography;

type DeleteQueueProps = {
  queue: Queue;
  onDeleted?: (queue?: Queue) => void;
  onDelete: (queueId?: string) => Promise<void>;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

const DeleteQueueDialog: React.FC<DeleteQueueProps> = (props) => {
  const { queue, onDeleted, onDelete } = props;
  const [isPending, setIsPending] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState(false);
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!props.isOpen,
  });

  function handleClose() {
    props.onClose && props.onClose();
    onClose();
  }

  function handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;
    const isConfirmed = newValue === queue.name;
    setCanDelete(isConfirmed);
  }

  const handleDelete = () => {
    setIsPending(true);
    Promise.resolve(onDelete(queue.id))
      .then(() => {
        onDeleted && onDeleted(queue);
      })
      .finally(() => {
        setIsPending(false);
        handleClose();
      });
  };

  return (
    <Modal
      title="Delete Queue"
      visible={isOpen}
      onOk={handleDelete}
      onCancel={handleClose}
      confirmLoading={isPending}
      okText="Delete"
      okButtonProps={{
        disabled: !canDelete,
      }}
    >
      <Title>Are you sure? You can't undo this action afterwards.</Title>
      <p>
        <Form.Item
          htmlFor="name"
          label="Enter Queue Name"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (queue.name === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  'The queue name you entered does not match!',
                );
              },
            }),
          ]}
        >
          <Input
            placeholder="Enter the queue name to confirm"
            name="name"
            onChange={handleInputChange}
          />
        </Form.Item>
      </p>
    </Modal>
  );
};

export default DeleteQueueDialog;
