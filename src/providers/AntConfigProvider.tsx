import LocaleProvider from 'antd/es/locale-provider';
import zhCN from 'antd/lib/locale/zh_CN';
import * as enUS from 'antd/lib/locale-provider/en_US';

// cast 'enUS' to 'any' so that it can be passed to LocalProvider
// If you use es6, you probably don't need this
const enUSLocale: any = enUS;

import { ConfigProvider } from 'antd';
import React, { useState } from 'react';

const AntConfigProvider: React.FC = ({ children }) => {
  const [locale, setLocale] = useState(enUS);
  return (
    <LocaleProvider locale={enUSLocale}>
      <ConfigProvider>{children}</ConfigProvider>
    </LocaleProvider>
  );
};

export default AntConfigProvider;
