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
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import { JsonEditor } from '../../components';
import { useJobSchemaActions } from '../../hooks';
import { validate, validateSchema } from '../../lib/ajv';

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

  const actions = useJobSchemaActions(queueId);

  useEffect(() => {
    setIsLoadingNames(true);
    actions
      .getJobNames()
      .then((names) => {
        setJobNames(names);
        setOptions(
          jobNames.map((value) => ({
            value,
            key: value,
          })),
        );
      })
      .finally(() => setIsLoadingNames(false));
  }, [queueId]);

  useEffect(() => {
    actions.getJobOptionsSchema().then((schema) => {
      /* ---- */
      setJobOptionsSchema(schema);
    });
  }, []);

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

  function onSchemaUpdate(value: Record<string, any> | null) {
    value = value || Object.create(null);
    updateEditable({ schema: value });
  }

  function onOptionsUpdate(value: Record<string, any> | null) {
    value = value || Object.create(null);
    updateEditable({ defaultOpts: value });
  }

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
                  placeholder="Please or enter a job name"
                  options={options}
                  disabled={isLoadingNames}
                  onSearch={handleAutoCompleteSearch}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="schema"
                label="Job Schema"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <JsonEditor
                  height={250}
                  width="100%"
                  id="schema-editor"
                  name="schema"
                  isDisabled={isLoadingSchema}
                  value={editSchema?.schema ?? {}}
                  onChange={onSchemaUpdate}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="default_options" label="Default Options">
                <JsonEditor
                  height={250}
                  width="100%"
                  id="default-options-editor"
                  name="default_options"
                  isDisabled={isLoadingSchema}
                  value={editSchema?.defaultOpts ?? {}}
                  schema={jobOptionsSchema}
                  onChange={onOptionsUpdate}
                />
              </Form.Item>
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
