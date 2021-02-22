import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, InputNumber, Checkbox } from 'antd';
import { JobStatus } from '../../api';
import { useDisclosure } from '../../hooks';
import { ucFirst } from '../../lib';
import { parseDuration } from '../../lib/dates';
import ms from 'ms';
import { ClockCircleOutlined } from '@ant-design/icons';

type CleanJobsDialogProps = {
  max?: number;
  isOpen: boolean;
  status: JobStatus;
  onCleanJobs: (
    status: JobStatus,
    grace: number,
    limit?: number,
  ) => Promise<void>;
  onClose?: () => void;
};

const DEFAULT_GRACE_PERIOD = ms('5 secs');

const CleanJobsDialog: React.FC<CleanJobsDialogProps> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPending, setIsPending] = useState(false);
  const [canClean, setCanClean] = useState(true);
  const [deleteAll, setDeleteAll] = useState(false);
  const [limit, setLimit] = useState(props.max ?? 1000);
  const [gracePeriod, setGracePeriod] = useState(DEFAULT_GRACE_PERIOD);
  const [form] = Form.useForm();

  function validateDuration(val: string): boolean {
    const parsed = parseDuration(val);
    return !isNaN(parsed);
  }

  function handleClose() {
    props.onClose && props.onClose();
    onClose();
  }

  function handleClean(data: Record<string, any>): void {
    setIsPending(true);
    Promise.resolve(
      props.onCleanJobs(props.status, gracePeriod, limit),
    ).finally(() => {
      setIsPending(false);
      handleClose();
    });
  }

  const onCheckboxChange = (e: { target: { checked: boolean } }) => {
    setDeleteAll(e.target.checked);
  };

  useEffect(() => {
    if (props.isOpen) {
      onOpen();
    } else {
      handleClose();
    }
  }, [props.isOpen]);

  const onLimitChange = (value: string | number | null | undefined) => {
    const newNumber = parseInt(String(value ?? '0'), 10);
    if (Number.isNaN(newNumber)) {
      return;
    }
    setLimit(newNumber);
    // triggerChange({ number: newNumber });
  };

  function onGracePeriodChange(e: React.FormEvent<HTMLInputElement>) {
    const fieldValue = e.currentTarget.value;
    const newNumber = parseInt(fieldValue || '0', 10);
    if (Number.isNaN(newNumber)) {
      setCanClean(false);
      return;
    }
    setCanClean(true);
    setGracePeriod(newNumber);
  }

  const type = ucFirst(props.status);

  return (
    <Modal
      title={`Clean ${type} Jobs`}
      visible={isOpen}
      okText={isPending ? 'Cleaning...' : 'Clean'}
      okButtonProps={{
        disabled: !canClean,
      }}
      onOk={handleClean}
      onCancel={handleClose}
      confirmLoading={isPending}
    >
      <p>Clean {type} jobs? You can't undo this action afterwards.</p>
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Grace Period"
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('grace') === value) {
                  return Promise.resolve();
                }
                if (deleteAll) return Promise.resolve();
                const duration = parseDuration(value);
                if (isNaN(duration)) {
                  return Promise.reject(
                    'Duration must be a number or time expression',
                  );
                }
              },
            }),
          ]}
        >
          <Input
            addonBefore={<ClockCircleOutlined />}
            name="grace"
            disabled={deleteAll}
            onChange={onGracePeriodChange}
          />
        </Form.Item>
        <Form.Item label="Limit">
          <InputNumber
            defaultValue={1000}
            min={1}
            disabled={deleteAll}
            onChange={onLimitChange}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox checked={deleteAll} onChange={onCheckboxChange}>
            Clear all {type} jobs
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CleanJobsDialog;
