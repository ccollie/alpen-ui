import { JobFilter } from '@/api';
import FilterList from './filter-list';
import { useUpdateEffect, useWhyDidYouUpdate } from '@/hooks';
import { useQueueJobFilters } from '@/hooks/use-queue-job-filters';
import {
  Drawer,
  Form,
  Button,
  Input,
  Col,
  Row,
  Space,
  Radio,
  RadioChangeEvent,
} from 'antd';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
const { Search } = Input;

interface QueryHistoryDialogOpts {
  queueId: string;
  isOpen?: boolean;
  onClose: () => void;
  onFilterClick?: (filter: JobFilter) => void;
}

type ViewType = 'recent' | 'favorites';

const QueryHistoryDialog: React.FC<QueryHistoryDialogOpts> = (props) => {
  const { queueId, onClose, isOpen = false } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<JobFilter[]>([]);
  const [view, setView] = useState<ViewType>('recent');
  const [filtersLoaded, setFiltersLoaded] = useState(false);
  const [searchText, setSearchText] = useState('');

  const {
    removeQueryFromHistory,
    createJobFilter,
    deleteFilterById,
    getJobFilters,
    history,
  } = useQueueJobFilters(queueId);

  const [data, setData] = useState<JobFilter[]>(history);

  useWhyDidYouUpdate('QueryHistoryDialog', props);

  function updateData() {
    let items = view === 'recent' ? history : filters;
    if (items.length && searchText && !!searchText.length) {
      const lowerText = searchText.toLowerCase();
      items = items.filter((f) => {
        let found = (f.name || '').toLowerCase().includes(lowerText);
        return found || f.expression.includes(searchText);
      });
    }
    setData(items);
  }

  const handleClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  const onFilterClick = useCallback(
    (filter: JobFilter) => {
      props.onFilterClick?.(filter);
    },
    [props.onFilterClick],
  );

  function tabChange(e: RadioChangeEvent) {
    setView(e.target.value);
    if (view === 'recent') {
      setData(history);
    } else {
      setData(filters);
    }
  }

  const onSearch = (value: string) => {
    updateData();
  };

  useUpdateEffect(() => {
    if (view !== 'recent' && !filtersLoaded) {
      setIsLoading(true);
      getJobFilters()
        .then((val) => {
          setFilters(val);
          setData(val);
          setFiltersLoaded(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [view]);

  useEffect(updateData, [view, searchText, filtersLoaded]);

  function handleSaveFilter(filter: JobFilter): Promise<void> {
    return createJobFilter(filter.name, filter.expression)
      .then((created) => {
        setFilters([created, ...filters]);
      })
      .catch((e) => {
        // todo: notify
      });
  }

  function handleDeleteFilter(filter: JobFilter): Promise<void> {
    return deleteFilterById(filter.id).then((isDeleted) => {
      if (isDeleted) {
        setFilters(filters.filter((x) => x.id !== filter.id));
      }
    });
  }

  function handleDeleteRecent(jobFilter: JobFilter): Promise<void> {
    removeQueryFromHistory(jobFilter.id);
    return Promise.resolve();
  }

  function handleDelete(filter: JobFilter): Promise<void> {
    return view === 'recent'
      ? handleDeleteRecent(filter)
      : handleDeleteFilter(filter);
  }

  function onSearchTextChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  }

  return (
    <>
      <Drawer
        title="Query History"
        width={520}
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
          <Row wrap={false}>
            <Col flex="none">
              <div>
                <Radio.Group onChange={tabChange} defaultValue="recent">
                  <Radio.Button value="recent">Recent</Radio.Button>
                  <Radio.Button value="favorite">Favorites</Radio.Button>
                </Radio.Group>
              </div>
            </Col>
            <Col flex="auto">
              <Search
                placeholder="search text"
                onSearch={onSearch}
                onChange={onSearchTextChange}
                allowClear={true}
                style={{ width: '280px', float: 'right' }}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <FilterList
                data={data}
                view={view}
                isLoading={isLoading}
                onSelect={onFilterClick}
                onSave={handleSaveFilter}
                onDelete={handleDelete}
              />
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default QueryHistoryDialog;
