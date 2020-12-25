import { Col, Row, Space } from 'antd';
import React from 'react';
import { QueueJobActions } from '../../@types/actions';
import { JobStatus } from '../../api';
import { JobBulkActions } from '../../components/JobBulkActions';

interface BulkActionToolbarOpts {
  status: JobStatus;
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
  } = props;
  const count = selectedItems.length;

  return (
    <Row>
      <Col flex="none">
        {count > 0 && (
          <span
            style={{
              textAlign: 'left',
            }}
          >
            Selected {count} Item{count ? 's' : ''}
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              Clear
            </a>
          </span>
        )}
      </Col>
      <Col flex="auto">
        <JobBulkActions
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
