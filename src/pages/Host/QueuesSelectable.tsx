import { useCallbackRef, useWhyDidYouUpdate } from '@/hooks';
import { QueueScrollArea } from '@/modules/queue/components';
import { useHostsStore } from '@/stores/hosts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ToggleGroup';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Queue, QueueFilterStatus } from '@/api';
import {
  QueueFilter,
  filterQueues,
  AllStatuses,
  stringsEqual,
  stringEqual,
} from '@/modules/host';

interface QueuesSelectableProps {
  hostId: string;
  prefix?: string;
  selectedIds?: string[];
  excludedIds?: string[];
  statuses?: QueueFilterStatus[];
  onSelectionChanged?: (
    queues: Queue[],
    status?: QueueFilterStatus[],
    prefix?: string,
  ) => void;
}

const QueuesSelectable: React.FC<QueuesSelectableProps> = (props) => {
  const { hostId } = props;
  const [statuses, setStatuses] = useState<QueueFilterStatus[]>(AllStatuses);
  const [prefix, setPrefix] = useState(props.prefix);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [filtered, setFiltered] = useState<Queue[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    props.selectedIds || [],
  );
  const [selectedStatuses, setSelectedStatuses] = useState<QueueFilterStatus[]>(
    props.statuses ?? AllStatuses,
  );

  const host = useHostsStore(
    useCallback((state) => state.findHost(hostId), [hostId]),
  );

  useWhyDidYouUpdate('QueuesSelectable', props);

  useEffect(() => {
    if (host) {
      const queues = host.queues;
      setQueues(queues);
      const selected = calculateSelected(queues);
      setSelectedIds(selected);
    }
  }, [host, props.selectedIds]);

  useEffect(() => {
    calculateSelected(queues);
  }, [props.excludedIds, props.excludedIds, queues]);

  useWhyDidYouUpdate('QueuesSelectable', props);

  function calculateSelected(queues: Queue[]) {
    if (props.selectedIds?.length) {
      return props.selectedIds;
    }
    if (props.excludedIds?.length) {
      const allIds = new Set(queues.map((x) => x.id));
      props.excludedIds.forEach((id) => allIds.delete(id));
      return Array.from(allIds);
    }
    return [];
  }

  function filterOptions() {
    const statuses = selectedStatuses;
    let filtered: Queue[];
    if (statuses.length === 0 && !prefix) {
      filtered = Array.from(queues.values());
    } else {
      const filter: QueueFilter = {
        statuses,
        prefix,
      };
      filtered = filterQueues(Array.from(queues.values()), filter);
    }
    setFiltered(filtered);
  }

  useEffect(() => {
    filterOptions();
  }, [selectedStatuses, prefix]);

  useWhyDidYouUpdate('QueuesSelectable', props);

  const onPrefixChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPrefix(e.currentTarget.value);
  }, []);

  const onSelectionChange = useCallbackRef(
    (queue: Queue, isSelected: boolean, selection: Set<Queue>) => {
      const queues = Array.from(selection);
      const ids = queues.map((x) => x.id);
      setSelectedIds(ids);
      props.onSelectionChanged?.(queues, statuses, prefix);
    },
  );

  const toggleButtonsMulti = [
    {
      id: 'active',
      value: QueueFilterStatus.Active,
      label: 'Active',
    },
    {
      id: 'inactive',
      value: QueueFilterStatus.Inactive,
      label: 'Inactive',
    },
    {
      id: 'running',
      value: QueueFilterStatus.Running,
      label: 'Running',
    },
    {
      id: 'paused',
      value: QueueFilterStatus.Paused,
      label: 'Paused',
    },
  ];

  const onStatusToggle = useCallbackRef((values: string[]) => {
    setStatuses(values as QueueFilterStatus[]);
  });

  const stringStatuses = statuses?.map((x) => x.toString());

  return (
    <div style={{ width: '345px', minHeight: '425px' }}>
      <form>
        {/*<EuiFormRow label="Prefix">*/}
        {/*  <EuiFieldText*/}
        {/*    placeholder="Queue Prefix"*/}
        {/*    defaultValue={prefix}*/}
        {/*    onChange={onPrefixChange}*/}
        {/*  />*/}
        {/*</EuiFormRow>*/}
        <div>
          <ToggleGroup
            type="multiple"
            onValueChange={onStatusToggle}
            value={stringStatuses}
          >
            {toggleButtonsMulti.map((button) => (
              <ToggleGroupItem key={button.id} value={button.value}>
                {button.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <QueueScrollArea
          queues={filtered}
          selectedIds={selectedIds}
          onSelectionChanged={onSelectionChange}
        />
      </form>
    </div>
  );
};

function arePropsEqual(
  a: QueuesSelectableProps,
  b: QueuesSelectableProps,
): boolean {
  return (
    a.hostId === b.hostId &&
    stringEqual(a.prefix, b.prefix) &&
    stringsEqual(a.selectedIds, b.selectedIds) &&
    stringsEqual(a.excludedIds, b.excludedIds) &&
    a.onSelectionChanged === b.onSelectionChanged
  );
}

export default React.memo(QueuesSelectable, arePropsEqual);
