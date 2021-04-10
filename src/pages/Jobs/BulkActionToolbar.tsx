import { Col, Row } from 'antd';
import React from 'react';
import { QueueJobActions } from '@/@types';
import { JobStatus } from '../../api';
import { JobBulkActions } from '@/components';

interface BulkActionToolbarOpts {
  status: JobStatus;
  count: number;
  actions: QueueJobActions;
  selectedItems: string[];
  onCleanSelected: () => void;
  onBulkAction: (action: string, ids: string[]) => void;
}

const BulkActionToolbar: React.FC<BulkActionToolbarOpts> = (props) => {
  const {
    selectedItems,
    onBulkAction,
    onCleanSelected,
    status,
    actions,
    count,
  } = props;
  const selectedCount = selectedItems.length;

  return (
    <Row>
      <Col flex="none">
        {selectedCount > 0 && (
          <span
            style={{
              textAlign: 'left',
            }}
          >
            Selected {selectedCount} Item{selectedCount ? 's' : ''}
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              Clear
            </a>
          </span>
        )}
      </Col>
      <Col flex="auto">
        <JobBulkActions
          count={count}
          status={status}
          selectedIds={selectedItems}
          actions={actions}
          onBulkAction={onBulkAction}
        />
      </Col>
    </Row>
  );
};

export default BulkActionToolbar;
