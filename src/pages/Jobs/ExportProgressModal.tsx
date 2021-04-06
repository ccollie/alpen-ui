import { JobExportOptions } from '@/@types';
import {
  DownloadProgressEvent,
  useJobDownloads,
  useUnmountEffect,
} from '@/hooks';
import { toPrecision } from '@/lib';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { Button, Modal, Progress, Result, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

interface ExportProgressProps {
  queueId: string;
  filter: string;
  visible: boolean;
  options: JobExportOptions;
  onClose?: () => void;
}

const ExportProgressModal: React.FC<ExportProgressProps> = (props) => {
  const { queueId, filter } = props;
  const [visible, setVisible] = useState(props.visible);
  const [isProcessing, setProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(0);
  const [options] = useState<JobExportOptions>(props.options);
  const updateStatus = useRef<DownloadProgressEvent>({
    current: 0,
    isCancelled: false,
    isDone: false,
    progress: 0,
    total: 0,
  });

  function progressHandler(evt: DownloadProgressEvent) {
    if (!updateStatus.current) {
      updateStatus.current = evt;
    } else {
      Object.assign(updateStatus.current, { ...evt });
    }
    const progress = parseFloat(toPrecision(evt.progress, 1));
    setProgress(progress);
    setIsDone(evt.isDone);
    setCurrent(evt.current);
    setTotal(evt.total);
    setIsCancelled(evt.isCancelled);
    setProcessing(!isDone && !isCancelled);
  }

  const { start: startDownload, stop: stopDownload } = useJobDownloads({
    queueId,
    filter,
    onProgress: progressHandler,
  });

  function handleCancel(): void {
    stopDownload();
    setProcessing(false);
    setIsCancelled(true);
  }

  function handleClose(): void {
    if (isProcessing) {
      handleCancel();
    } else {
      props.onClose?.();
    }
  }

  useUnmountEffect(() => {
    if (isProcessing) {
      stopDownload();
    }
  });

  function ProgressForm() {
    return (
      <Result
        icon={<CloudDownloadOutlined />}
        title={`Exporting ${status} Jobs!`}
        subTitle={`Processing ${current} of ${total} jobs.`}
        extra={[
          <Progress percent={progress} key="progress" />,
          <Button
            key="cancel"
            style={{ marginTop: '24px' }}
            onClick={handleCancel}
          >
            Cancel
          </Button>,
        ]}
      />
    );
  }

  function CancelledResult() {
    return (
      <Result
        status="warning"
        icon={<CloudDownloadOutlined />}
        title="Export Cancelled"
        extra={[
          <Button key="close-btn" onClick={handleClose}>
            Close
          </Button>,
        ]}
      />
    );
  }

  useEffect(() => {
    if (visible) {
      startDownload(options).catch(console.log);
    }
    return stopDownload;
  }, [visible]);

  useEffect(() => {
    if (isDone) {
      // hack
      setIsCancelled(false);
      handleClose();
      setVisible(false);
      message.success(`${current} jobs exported to "${options.filename}"`);
    }
  }, [isDone]);

  return (
    <Modal visible={visible} centered={true} footer={false}>
      {isProcessing && <ProgressForm key="progress-form" />}
      {isCancelled && <CancelledResult key="cancel-result" />}
    </Modal>
  );
};

export default ExportProgressModal;
