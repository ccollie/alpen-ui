import { CloudDownloadOutlined } from '@ant-design/icons';
import { InputNumber } from 'antd/es';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Key } from 'antd/es/table/interface';
import React, {
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Modal,
  Form,
  Checkbox,
  message,
  Input,
  Radio,
  RadioChangeEvent,
  Table,
  Space,
  Button,
  Result,
  Progress,
} from 'antd';
import { JobStatus } from '../../api';
import { JobExportOptions, JobExportFormat } from '@/@types';

interface FieldType {
  key: string;
  title: string;
  description: string;
}

const JobFields: FieldType[] = [
  {
    key: 'id',
    title: 'Id',
    description: 'Job Id',
  },
  {
    key: 'name',
    title: 'Job Name',
    description: 'The name of the Job',
  },
  {
    key: 'timestamp',
    title: 'Timestamp',
    description: 'Job creation timestamp',
  },
  {
    key: 'data',
    title: 'Data',
    description: 'The job data',
  },
  {
    key: 'opts',
    title: 'Options',
    description: 'The job options',
  },
  {
    key: 'attemptsMade',
    title: 'Attempts Made',
    description: 'Job attempts',
  },
  {
    key: 'processedOn',
    title: 'Processed On',
    description: 'A timestamp of when the job started executing',
  },
  {
    key: 'finishedOn',
    title: 'Finished On',
    description:
      'For completed job, a timestamp of when the job finished executing',
  },
  {
    key: 'failedReason',
    title: 'Failed Reason',
    description: 'The reason the job failed',
  },
  {
    key: 'stackTrace',
    title: 'Stacktrace',
    description: 'Error stack',
  },
  {
    key: 'returnvalue',
    title: 'Return Value',
    description: 'The value returned from the job',
  },
];

const JOB_KEYS = JobFields.map((x) => x.key);

const columns = [
  {
    title: 'Name',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
];

interface RegisterQueueDialogProps {
  queueId: string;
  status: JobStatus;
  filter?: string;
  visible: boolean;
  onOk: (evt: JobExportOptions) => void;
  onClose?: () => void;
}

const ExportOptionsDialog: React.FC<RegisterQueueDialogProps> = (props) => {
  const { visible: _visible, queueId, status, filter, onOk } = props;
  const [visible, setVisible] = useState(_visible);
  const [format, setFormat] = useState<JobExportFormat>('json');
  const [filename, setFilename] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState<string[]>(JOB_KEYS);
  const [exportAll, setExportAll] = useState(true);
  const [canExport, setCanExport] = useState(false);
  const [includeHeaders, setIncludeHeaders] = useState(false);
  const [maxJobs, setMaxJobs] = useState(100);

  useEffect(() => {
    const exportable = !!(
      !!selectedFields.length &&
      filename &&
      !!filename.length &&
      (exportAll || maxJobs > 0) &&
      !!format
    );
    setCanExport(exportable);
  }, [selectedFields, exportAll, maxJobs, filename]);

  const [form] = Form.useForm();

  function onFilenameChange(evt: ChangeEvent<HTMLInputElement>) {
    setFilename(evt.target.value);
  }

  function onChangeFormat(e: RadioChangeEvent) {
    setFormat(e.target.value);
  }

  function onMaxChange(value: string) {
    const max = parseInt(value, 10);
    if (!isNaN(max)) setMaxJobs(max);
  }

  function onExportAllChange(evt: CheckboxChangeEvent) {
    setExportAll(evt.target.checked);
  }

  function onIncludeHeadersChange(evt: CheckboxChangeEvent) {
    setIncludeHeaders(evt.target.checked);
  }

  function handleClose(): void {
    props.onClose?.();
  }

  function handleOk(): void {
    const options: JobExportOptions = {
      fields: selectedFields,
      filename,
      status,
      format,
      filter,
      maxJobs: exportAll ? undefined : maxJobs,
    };
    props.onOk?.(options);
  }

  const rowSelection = useMemo(
    () => ({
      onChange: (selectedRowKeys: Key[], selectedRows: FieldType[]) => {
        setSelectedFields(selectedRows.map((x) => x.key));
      },
      onSelect: (
        record: Record<string, any>,
        selected: boolean,
        selectedRows: FieldType[],
      ) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (
        selected: boolean,
        selectedRows: FieldType[],
        changeRows: FieldType[],
      ) => {
        setSelectedFields(selectedRows.map((x) => x.key));
      },
    }),
    [],
  );

  function Footer() {
    return (
      <>
        <Button key="cancel-btn" type="default" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          key="export-btn"
          type="primary"
          disabled={!canExport}
          onClick={handleOk}
        >
          Export
        </Button>
      </>
    );
  }

  return (
    <Modal
      visible={visible}
      centered
      title="Export Jobs"
      okText="Export"
      cancelText={'Cancel'}
      onCancel={handleClose}
      onOk={handleOk}
      footer={<Footer />}
    >
      <Form
        form={form}
        layout="vertical"
        name="export-jobs-modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="filename"
          label="Filename"
          rules={[{ required: true, message: 'Missing filename' }]}
        >
          <Input placeholder="Enter file name" onChange={onFilenameChange} />
        </Form.Item>
        <Form.Item name="format" label="Format">
          <Radio.Group
            onChange={onChangeFormat}
            size="large"
            defaultValue="json"
            style={{ width: '100% ' }}
          >
            <Radio.Button
              value="json"
              style={{ width: '48%', textAlign: 'center' }}
            >
              JSON
            </Radio.Button>
            <Radio.Button
              value="csv"
              style={{
                textAlign: 'center',
                width: '48%',
                float: 'right',
              }}
            >
              CSV
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        {format === 'csv' && (
          <Form.Item name="use-headers">
            <Checkbox
              onChange={onIncludeHeadersChange}
              disabled={format !== 'csv'}
              defaultChecked={includeHeaders}
            >
              Include Headers (CSV)
            </Checkbox>
          </Form.Item>
        )}
        <Form.Item
          name="fields"
          label="Select Fields to Export"
          rules={[
            {
              required: true,
              message: 'Select Fields',
            },
          ]}
        >
          <Table
            columns={columns}
            dataSource={JobFields}
            rowSelection={rowSelection}
            size="small"
            scroll={{ y: 240 }}
            pagination={false}
          />
        </Form.Item>
        <Space>
          <Form.Item name="export-all">
            <Checkbox onChange={onExportAllChange} defaultChecked={exportAll}>
              Export all {status} jobs
            </Checkbox>
          </Form.Item>
          <Form.Item name={'maxJobs'} label="Max Jobs">
            <InputNumber
              min="10"
              max="1000"
              defaultValue="100"
              onChange={onMaxChange}
              disabled={exportAll}
            />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default ExportOptionsDialog;
