import { JobExportOptions } from '@/@types';
import { JobStatus } from '@/api';
import { useCallbackRef, useDisclosure } from '@/hooks';
import ExportProgressModal from '@/pages/Jobs/ExportProgressModal';
import ExportOptionsDialog from './ExportOptionsDialog';
import React, { useState } from 'react';

interface ExporterProps {
  queueId: string;
  filter: string;
  status: JobStatus;
  visible: boolean;
  onClose?: () => void;
}

const ExportJobsDialog: React.FC<ExporterProps> = (props) => {
  const { queueId, filter, status } = props;
  const [isProcessing, setProcessing] = useState(false);
  const [options, setOptions] = useState<JobExportOptions | undefined>();

  const {
    isOpen: isProcessingDialogOpen,
    onClose: closeProcessingDialog,
    onOpen: openProcessingDialog,
  } = useDisclosure({
    defaultIsOpen: false,
  });

  function handleClose(): void {
    closeProcessingDialog();
    props.onClose?.();
  }

  const {
    isOpen: isExportOptionsDialogOpen,
    onClose: closeExportOptionsDialog,
  } = useDisclosure({
    defaultIsOpen: true,
  });

  const handleExport = useCallbackRef((options: JobExportOptions) => {
    closeExportOptionsDialog();
    setOptions(options);
    setProcessing(true);
    openProcessingDialog();
  });

  if (isExportOptionsDialogOpen && !isProcessing) {
    return (
      <ExportOptionsDialog
        queueId={queueId}
        onClose={handleClose}
        onOk={handleExport}
        status={status}
        visible={isExportOptionsDialogOpen}
      />
    );
  }
  if (isProcessingDialogOpen && options)
    return (
      <ExportProgressModal
        queueId={queueId}
        filter={filter}
        options={options}
        onClose={closeProcessingDialog}
        visible={isProcessingDialogOpen}
      />
    );
  return <></>;
};

export default ExportJobsDialog;
