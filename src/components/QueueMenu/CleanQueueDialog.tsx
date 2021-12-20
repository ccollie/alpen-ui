import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, InputNumber } from 'antd';
import { FaClock } from 'react-icons/fa';
import { useDisclosure } from '@/hooks';
import { parseDuration } from '@/lib/dates';
import ms from 'ms';

type CleanQueueDialogProps = {
  queueId: string;
  max?: number;
  isOpen: boolean;
  onCleanQueue: (
    id: string,
    gracePeriod: number,
    limit?: number,
  ) => Promise<void>;
  onClose?: () => void;
};

const DEFAULT_GRACE_PERIOD = ms('5 mins');

const CleanQueueDialog: React.FC<CleanQueueDialogProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPending, setIsPending] = useState(false);
  const [canClean, setCanClean] = useState(false);
  const [limit, setLimit] = useState(props.max ?? 1000);
  const [gracePeriod, setGracePeriod] = useState(DEFAULT_GRACE_PERIOD);
  const { queueId } = props;

  function validateDuration(val: string): boolean {
    const parsed = parseDuration(val);
    return !isNaN(parsed);
  }

  function handleClose() {
    props.onClose && props.onClose();
    onClose();
  }

  function handleCleanQueue(data: Record<string, any>): void {
    setIsPending(true);
    Promise.resolve(props.onCleanQueue(queueId, gracePeriod, limit)).finally(
      () => {
        setIsPending(false);
        handleClose();
      },
    );
  }

  useEffect(() => {
    if (props.isOpen) {
      onOpen();
    } else {
      handleClose();
    }
  }, [props.isOpen]);

  useEffect(() => {}, [limit]);

  const onLimitChange = (value: string | number | null | undefined) => {
    const newNumber = parseInt(String(value ?? '0'), 10);
    if (Number.isNaN(newNumber)) {
      return;
    }
    setLimit(newNumber);
    // triggerChange({ number: newNumber });
  };

  function onGracePeriodChange(e: React.FormEvent<HTMLInputElement>) {
    const newNumber = parseInt(e.currentTarget.value || '0', 10);
    if (Number.isNaN(newNumber)) {
      return;
    }
    setGracePeriod(newNumber);
  }

  return (
    <Modal
      title="Clean Queue"
      visible={isOpen}
      okText={isPending ? 'Cleaning...' : 'Save'}
      okButtonProps={{
        disabled: !canClean,
      }}
      onOk={handleCleanQueue}
      onCancel={handleClose}
      confirmLoading={isPending}
    >
      <p>Clean Queue? You can't undo this action afterwards.</p>
      <Form>
        <Form.Item
          label="Grace Period"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('grace') === value) {
                  return Promise.resolve();
                }
                const duration = parseDuration(value);
                return Promise.reject(
                  'The two passwords that you entered do not match!',
                );
              },
            }),
          ]}
        >
          <Input
            addonBefore={<FaClock />}
            name="grace"
            onChange={onGracePeriodChange}
          />
        </Form.Item>
        <Form.Item label="Limit">
          <InputNumber defaultValue={1000} min={1} onChange={onLimitChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CleanQueueDialog;
