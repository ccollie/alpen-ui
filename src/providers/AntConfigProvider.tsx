import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';

import { ConfigProvider } from 'antd';
import React, { useState } from 'react';

const AntConfigProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useState(enUS);
  return <ConfigProvider locale={locale}>{children}</ConfigProvider>;
};

export default AntConfigProvider;
