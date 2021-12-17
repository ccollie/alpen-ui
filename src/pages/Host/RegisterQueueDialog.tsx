import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Checkbox } from 'antd';
import { DiscoverQueuesPayload, Queue } from '@/api';
import { useAsync } from '@/hooks';
const { Option } = Select;

interface RegisterQueueDialogProps {
  visible: boolean;
  loadQueues: () => Promise<DiscoverQueuesPayload[]>;
  onAddQueue: (prefix: string, name: string) => Promise<Queue>;
  onClose?: () => void;
}

const RegisterQueueDialog: React.FC<RegisterQueueDialogProps> = (props) => {
  const { visible, onAddQueue } = props;
  const [prefixes, setPrefixes] = useState<string[]>([]);
  const [queues, setQueues] = useState<DiscoverQueuesPayload[]>([]);
  const [filtered, setFiltered] = useState<DiscoverQueuesPayload[]>([]);
  const [prefix, setPrefix] = useState<string>('');
  const [queue, setQueue] = useState<DiscoverQueuesPayload | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const { execute, loading } = useAsync(props.loadQueues);
  const [form] = Form.useForm();

  function fetch() {
    execute().then((items) => {
      const dedupe = new Set<string>(
        items.map((x: DiscoverQueuesPayload) => x.prefix),
      );
      setQueues(items);
      setPrefixes(Array.from(dedupe));
      setFiltered([...items]);
    });
  }

  useEffect(() => {
    if (!prefix || prefix.length === 0) {
      setFiltered(queues);
    } else {
      setFiltered(queues.filter((x) => x.prefix === prefix));
    }
  }, [prefix, queues]);

  function onChange(value: any) {
    const [prefix, name] = (value + '').split(':');
    if (prefix && name) {
      const value: DiscoverQueuesPayload = {
        prefix,
        name,
      };
      setQueue(value);
    }
  }

  function handleClose(): void {
    props.onClose && props.onClose();
  }

  useEffect(() => {
    visible && fetch();
  }, [visible]);

  useEffect(() => {
    if (!prefix || prefix.length === 0) {
      setFiltered(queues);
    } else {
      setFiltered(queues.filter((x) => x.prefix === prefix));
    }
  }, [prefix, queues]);

  function remove(
    queues: DiscoverQueuesPayload[],
    item: DiscoverQueuesPayload,
  ): DiscoverQueuesPayload[] {
    return queues.filter((x) => {
      return !(item.prefix === x.prefix && item.name === x.name);
    });
  }

  function registerQueue() {
    // onSelect && onSelect(value)
    if (!queue) return;
    form
      .validateFields()
      .then(async (values) => {
        setIsAdding(true);
        try {
          await onAddQueue(queue.prefix, queue.name);
          let newItems = remove(queues, queue);
          setQueues(newItems);
          newItems = remove(filtered, queue);
          setFiltered(newItems);
          setQueue(null);
          form.resetFields();
        } finally {
          setIsAdding(false);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  }

  return (
    <Modal
      visible={visible}
      centered
      title="Register a queue"
      okText="Add Queue"
      cancelText="Close"
      onCancel={handleClose}
      onOk={registerQueue}
      okButtonProps={{
        type: 'primary',
        disabled: !queue,
        loading: isAdding,
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="register-queue-modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="prefix"
          label="Prefix"
          rules={[{ required: true, message: 'Missing prefix' }]}
        >
          <Select
            placeholder="Prefix"
            onChange={(e) => setPrefix(String(e))}
            disabled={loading}
          >
            {prefixes.map((prefix) => (
              <Option value={prefix}>{prefix}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please select a queue!',
            },
          ]}
        >
          <Select
            placeholder="Select A Queue"
            onChange={onChange}
            disabled={loading}
          >
            {filtered.map((queue) => (
              <Option
                key={`${queue.prefix}:${queue.name}`}
                value={`${queue.prefix}:${queue.name}`}
              >
                {queue.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="monitor-stats" valuePropName="checked">
          <Checkbox>Track Statistics</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterQueueDialog;
