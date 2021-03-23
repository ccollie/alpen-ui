import { Modal, Input } from 'antd';
import React, { ChangeEvent, useEffect, useState } from 'react';

interface QuerySaveDialogProps {
  title?: string;
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
}

const QuerySaveDialog: React.FC<QuerySaveDialogProps> = (props) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const title = props.title ?? 'Save Query';

  const handleOk = () => {
    setConfirmLoading(true);
    props.onSave(name).finally(() => {
      props.onClose();
    });
  };

  const handleCancel = () => {
    props.onClose?.();
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  useEffect(() => {
    setIsValid(!!name && name.length >= 3);
  }, [name]);

  return (
    <>
      <Modal
        title={title}
        visible={true}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okButtonProps={{
          disabled: !isValid,
        }}
      >
        <Input placeholder="query name" onChange={handleChange} />
      </Modal>
    </>
  );
};

export default QuerySaveDialog;
