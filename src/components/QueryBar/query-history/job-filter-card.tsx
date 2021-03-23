import { ActionIcon, Highlight } from '@/components';
import QuerySaveDialog from './query-save-dialog';
import { useDisclosure } from '@/hooks';
import { parseDate } from '@/lib/dates';
import { Card, Col, Row, Space } from 'antd';
import { DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import React, { Fragment } from 'react';
import { JobFilter } from '@/api';
import { getThemeName } from '@/lib/ace';

interface JobFilterCardProps {
  filter: JobFilter;
  onFilterClick?: (filter: JobFilter) => void;
  onDeleteClick?: (filter: JobFilter) => Promise<void>;
  onSaveFilter?: (filter: JobFilter) => Promise<void>;
}

const JobFilterCard: React.FC<JobFilterCardProps> = (props) => {
  const { expression, name, id, createdAt } = props.filter || {};
  const canSave = !name || name.length === 0;
  const { onFilterClick } = props;
  const theme = getThemeName();
  const header = name ? name : parseDate(createdAt).toString();

  const {
    isOpen: isSaveDialogOpen,
    onClose: closeSaveDialog,
    onToggle: toggleSaveDialog,
    onOpen: openSaveDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  function onClick() {
    onFilterClick?.(props.filter);
  }

  async function handleDelete(): Promise<void> {
    return props.onDeleteClick?.(props.filter);
  }

  async function handleSave(name: string): Promise<void> {
    const filter = { ...props.filter, name };
    return props.onSaveFilter?.(filter);
  }

  function openDialog() {
    openSaveDialog();
  }

  function Actions() {
    return (
      <Space style={{ float: 'right' }}>
        {canSave && <SaveOutlined onClick={openDialog} />}
        <ActionIcon baseIcon={<DeleteOutlined />} handler={handleDelete} />
      </Space>
    );
  }

  return (
    <Fragment>
      <Card hoverable={true} style={{ marginTop: '8px' }}>
        <Row onClick={onClick}>
          <Col>
            <Title level={5}>{header}</Title>
          </Col>
        </Row>
        <div onClick={onClick}>
          <span>Filter</span>
          <Highlight language="js">{expression}</Highlight>
        </div>
        <Row wrap={false}>
          <Col flex="none" />
          <Col flex="auto">
            <Actions />
          </Col>
        </Row>
      </Card>
      {isSaveDialogOpen && (
        <QuerySaveDialog onSave={handleSave} onClose={closeSaveDialog} />
      )}
    </Fragment>
  );
};

export default JobFilterCard;
