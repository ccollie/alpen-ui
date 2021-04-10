import enUS from 'antd/es/locale/en_US';
import { ConfigProvider } from 'antd';
import React, { useState } from 'react';

const AntConfigProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useState(enUS);
  return <ConfigProvider locale={locale}>{children}</ConfigProvider>;
};

export default AntConfigProvider;
