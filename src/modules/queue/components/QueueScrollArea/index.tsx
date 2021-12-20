import {
  ScrollAreaViewport,
  ScrollArea,
  ScrollAreaThumb,
  ScrollAreaCorner,
  ScrollAreaScrollbar,
} from '@/components/ScrollArea';
import styled from 'styled-components';

import { Checkbox } from '@/components/Checkbox';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Queue } from '@/api';
import { QueueStateTag } from '@/components/QueueStateTag';

interface QueuesSelectableProps {
  queues: Queue[];
  selectedIds?: string[];
  onSelectionChanged?: (
    queue: Queue,
    selected: boolean,
    selections: Set<Queue>,
  ) => void;
}

// Your app...
const Box = styled.div``;

interface QueueComponentProps {
  queue: Queue;
  selected: boolean;
  onSelectChange: (queue: Queue, selected: boolean) => void;
}

const QueueComponent: React.FC<QueueComponentProps> = (props) => {
  const { queue, selected, onSelectChange } = props;

  function onChange(value: boolean | 'indeterminate') {
    if (typeof value === 'boolean') {
      onSelectChange(queue, value);
    }
  }

  return (
    <div className="flex pt-4 items-center justify-between">
      <div className="pl-4 flex items-center">
        <div className="bg-gray-100 dark:bg-gray-800 border rounded-sm border-gray-200 dark:border-gray-700 w-3 h-3 flex flex-shrink-0 justify-center items-center relative">
          <Checkbox
            checked={selected}
            onCheckedChange={onChange}
            className="absolute inset-0"
          />
        </div>
        <p className="text-sm leading-normal ml-2 text-gray-800">
          {queue.name}
        </p>
      </div>
      <p className="w-8 leading-3 text-right">
        <QueueStateTag queue={queue} />
      </p>
    </div>
  );
};

// TODO: change name to something more descriptive
export const QueueScrollArea: React.FC<QueuesSelectableProps> = (props) => {
  const [queues, setQueues] = useState<Queue[]>(props.queues);
  const selectedSet = useRef<Set<Queue>>(new Set());

  useEffect(() => {
    selectedSet.current.clear();
    if (props.selectedIds?.length) {
      const selectedSet = new Set();
      props.selectedIds.forEach((id) => {
        const queue = queues.find((q) => q.id === id);
        if (queue) {
          selectedSet.add(queue);
        }
      });
    }
  }, [props.selectedIds]);

  function isSelected(queue: Queue) {
    return selectedSet.current.has(queue);
  }

  function onSelectChange(queue: Queue, selected: boolean) {
    if (selected) {
      selectedSet.current.add(queue);
    } else {
      selectedSet.current.delete(queue);
    }
    if (props.onSelectionChanged) {
      props.onSelectionChanged(queue, selected, selectedSet.current);
    }
  }

  return (
    <ScrollArea>
      <ScrollAreaViewport style={{ backgroundColor: 'white' }}>
        <Box style={{ padding: '15px 20px' }}>
          {queues.map((queue) => (
            <QueueComponent
              key={queue.id}
              queue={queue}
              selected={isSelected(queue)}
              onSelectChange={onSelectChange}
            />
          ))}
        </Box>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaCorner />
    </ScrollArea>
  );
};
