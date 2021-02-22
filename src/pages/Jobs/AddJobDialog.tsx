import { UndoOutlined } from '@ant-design/icons';
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Space,
  AutoComplete,
  SelectProps,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { getJobSchema, JobSchema } from '../../api';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { JsonEditor } from '../../components';
import { useJobSchemaActions } from '../../hooks';
import { useWhyDidYouUpdate } from '../../hooks/use-why-update';
import { stringify } from '../../lib';

interface AddJobDialogOpts {
  queueId: string;
  isOpen?: boolean;
  onClose: () => void;
}

const AddJobDialog: React.FC<AddJobDialogOpts> = (props) => {
  const { queueId, onClose, isOpen = false } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [jobName, setJobName] = useState<string | null>(null);
  const [jobNames, setJobNames] = useState<string[]>([]);
  const [schemas, setSchemas] = useState<JobSchema[]>([]);
  const [jobSchema, setJobSchema] = useState<JobSchema>();
  const [jobDate, setJobData] = useState<Record<string, any>>({});
  const [jobOptions, setJobOptions] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setChanged] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [options, setOptions] = useState<SelectProps<object>['options']>([]);
  const [jobOptionsSchema, setJobOptionsSchema] = useState<
    Record<string, any>
  >();
  const [schemaString, setSchemaString] = useState<string>('{}');
  const [optionsString, setOptionsString] = useState<string>('{}');

  const schemaActions = useJobSchemaActions(queueId);

  useEffect(() => {
    setIsLoading(true);
    // todo: do a specific graphql query for this
    Promise.all([
      schemaActions.getJobNames(),
      schemaActions.getJobOptionsSchema(),
      schemaActions.getSchemas(),
    ])
      .then(([names, optionsSchema, schemas]) => {
        setJobNames(names);
        setOptions(
          jobNames.map((value) => ({
            value,
            key: value,
          })),
        );
        setJobOptionsSchema(optionsSchema);
        setSchemas(schemas ?? []);
      })
      .finally(() => setIsLoading(false));
  }, [queueId]);

  useEffect(() => {
    let schema, defaultOpts: Record<string, any> | null | undefined;
    if (jobSchema) {
      schema = jobSchema.schema;
      defaultOpts = jobSchema.defaultOpts;
    }
    setSchemaString(schema ? stringify(schema) : '{}');
    setOptionsString(defaultOpts ? stringify(defaultOpts) : '{}');
  }, [jobSchema]);

  const handleClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  useEffect(() => {
    const found = schemas.find((x) => x.jobName === jobName);
    if (found) {
      setJobSchema(found);
    } else {
      setJobSchema(undefined);
    }
  }, [jobName, schemas]);

  function handleJobNameChange(jobName: string): void {
    const found = !!jobNames.find((x) => x === jobName);
    setJobName(jobName);
    setIsNewItem(!found);
  }

  function saveJob(): void {
    if (!isEmpty(jobDate)) {
      setIsSaving(true);
      setIsSaving(false);
    }
  }

  function revertJob() {
    setJobData({});
  }

  const onJobUpdate = useCallback((value: Record<string, any> | null) => {
    setJobData(value || Object.create(null));
  }, []);

  const onOptionsUpdate = useCallback((value: Record<string, any> | null) => {
    setJobOptions(value || {});
  }, []);

  const handleAutoCompleteSearch = (value: string) => {
    const needle = value.toUpperCase();
    const filtered = jobNames.filter((name) => {
      return name.toUpperCase().indexOf(needle) !== -1;
    });
    setOptions(
      filtered.map((value) => ({
        value,
        key: value,
      })),
    );
  };

  return (
    <>
      <Drawer
        title="Add Job"
        width={720}
        onClose={handleClose}
        visible={isOpen}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={handleClose} style={{ marginRight: 8 }}>
              Close
            </Button>
          </div>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Job Name"
                rules={[{ required: true, message: 'Please enter job name' }]}
              >
                <AutoComplete
                  allowClear={true}
                  onSelect={handleJobNameChange}
                  placeholder="Please select or enter a job name"
                  options={options}
                  disabled={isLoading}
                  onSearch={handleAutoCompleteSearch}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <span>Job Data</span>
              <JsonEditor
                height="250px"
                width="100%"
                id="job-data"
                name="job-data"
                isDisabled={isLoading}
                value={schemaString}
                onChange={onJobUpdate}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <span>Job Options</span>
              <JsonEditor
                height="250px"
                width="100%"
                id="default-options-editor"
                name="default_options"
                isDisabled={isLoading}
                value={optionsString}
                onChange={onOptionsUpdate}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <div style={{ textAlign: 'right' }}>
                <Space size={5}>
                  <Button
                    onClick={saveJob}
                    loading={isSaving}
                    disabled={!isChanged || !isValid}
                  >
                    Save
                  </Button>
                  <Button
                    disabled={!isNewItem}
                    onClick={revertJob}
                    icon={<UndoOutlined />}
                  >
                    Revert
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default AddJobDialog;
