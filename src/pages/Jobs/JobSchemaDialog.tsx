import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
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
import {
  deleteJobSchema,
  getJobSchema,
  setJobSchema,
  JobSchema,
} from '../../api';
import isEqual from 'lodash-es/isEqual';
import isEmpty from 'lodash-es/isEmpty';
import { JsonEditor } from '../../components';
import { useJobSchemaActions } from '../../hooks';
import { useWhyDidYouUpdate } from '../../hooks/use-why-update';
import { stringify } from '../../lib';

interface JobSchemaDialogOpts {
  queueId: string;
  isOpen?: boolean;
  onClose: () => void;
}

const JobSchemaDialog: React.FC<JobSchemaDialogOpts> = (props) => {
  const { queueId, onClose, isOpen = false } = props;
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [jobName, setJobName] = useState<string | null>(null);
  const [jobNames, setJobNames] = useState<string[]>([]);
  const [schema, setSchema] = useState<JobSchema>();
  const [editSchema, setEditSchema] = useState<JobSchema>();
  const [isLoadingSchema, setIsLoadingSchema] = useState(false);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const [isChanged, setChanged] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [options, setOptions] = useState<SelectProps<object>['options']>([]);
  const [jobOptionsSchema, setJobOptionsSchema] = useState<
    Record<string, any>
  >();
  const [schemaString, setSchemaString] = useState<string>('{}');
  const [optionsString, setOptionsString] = useState<string>('{}');

  const actions = useJobSchemaActions(queueId);

  useEffect(() => {
    setIsLoadingNames(true);
    // todo: do a specific graphql query for this
    Promise.all([actions.getJobNames(), actions.getJobOptionsSchema()])
      .then(([names, schema]) => {
        setJobNames(names);
        setOptions(
          jobNames.map((value) => ({
            value,
            key: value,
          })),
        );
        setJobOptionsSchema(schema);
      })
      .finally(() => setIsLoadingNames(false));
  }, [queueId]);

  useEffect(() => {
    let schema, defaultOpts: Record<string, any> | null | undefined;
    if (editSchema) {
      schema = editSchema.schema;
      defaultOpts = editSchema.defaultOpts;
    }
    setSchemaString(schema ? stringify(schema) : '{}');
    setOptionsString(defaultOpts ? stringify(defaultOpts) : '{}');
  }, [editSchema]);

  const handleClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  function loadSchema(jobName: string) {
    setIsLoadingSchema(true);
    getJobSchema(queueId, jobName)
      .then((schema) => {
        if (schema) {
          setEditSchema({ ...schema });
        } else {
          setEditSchema(undefined);
        }
        setSchema(schema);
      })
      .finally(() => {
        setIsLoadingSchema(false);
      });
    // todo: handle error
  }

  function handleJobNameChange(jobName: string): void {
    const found = !!jobNames.find((x) => x === jobName);
    setJobName(jobName);
    setIsNewItem(!found);
    if (found) loadSchema(jobName);
  }

  function saveSchema(): void {
    if (editSchema) {
      setIsSaving(true);
      setJobSchema(
        queueId,
        jobName!,
        editSchema.schema!,
        editSchema.defaultOpts!,
      )
        .then((schema) => {
          setSchema(schema);
          setEditSchema(schema);
        })
        .finally(() => setIsSaving(false));
    }
  }

  function handleDeleteSchema() {
    if (schema && jobName) {
      setIsDeleting(true);
      deleteJobSchema(queueId, jobName)
        .then(() => {
          setSchema(undefined);
        })
        .finally(() => {
          setIsDeleting(false);
        });
    }
  }

  function revertSchema() {
    jobName && loadSchema(jobName);
  }

  function updateEditable(value: Partial<JobSchema>) {
    setEditSchema({
      ...(editSchema || {}),
      ...value,
      jobName: value?.jobName ?? jobName ?? '',
    });
    setChanged(isEqual(editSchema, schema));
    if (isEmpty(editSchema?.schema) && isEmpty(editSchema?.defaultOpts)) {
      // todo: error message if not new
      setIsValid(false);
    }
  }

  const onSchemaUpdate = useCallback((value: Record<string, any> | null) => {
    value = value || Object.create(null);
    updateEditable({ schema: value });
  }, []);

  const onOptionsUpdate = useCallback((value: Record<string, any> | null) => {
    value = value || Object.create(null);
    updateEditable({ defaultOpts: value });
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
        title="Job Schemas"
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
                  disabled={isLoadingNames}
                  onSearch={handleAutoCompleteSearch}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <span>Schema</span>
              <JsonEditor
                height="250px"
                width="100%"
                id="schema-editor"
                name="schema"
                isDisabled={isLoadingSchema}
                value={schemaString}
                onChange={onSchemaUpdate}
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
                isDisabled={isLoadingSchema}
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
                    onClick={saveSchema}
                    loading={isSaving}
                    disabled={!isChanged || !isValid}
                  >
                    Save
                  </Button>
                  <Button
                    disabled={!isNewItem}
                    onClick={revertSchema}
                    icon={<UndoOutlined />}
                  >
                    Revert
                  </Button>
                  <Button
                    loading={isDeleting}
                    onClick={handleDeleteSchema}
                    icon={<DeleteOutlined />}
                    disabled={!isNewItem}
                  >
                    Delete
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

export default JobSchemaDialog;
