import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Layout, Menu, Spin } from 'antd';
import {
  CloudServerOutlined,
  LoadingOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import {
  AppInfo,
  GetAppInfoDocument,
  GetHostsDocument,
  QueueHost,
} from '@/api';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface HostSubMenuProps {
  host: QueueHost;
}
const HostSubMenu: React.FC<HostSubMenuProps> = (props) => {
  const { host, ...rest } = props;
  const navigate = useNavigate();

  function gotoQueue(id: string) {
    navigate(`/queues/${id}/metrics`);
  }

  function gotoHost() {
    navigate(`/hosts/${host.id}`);
  }

  return (
    <SubMenu
      icon={<CloudServerOutlined />}
      title={host.name}
      onTitleClick={gotoHost}
      {...rest}
    >
      {host.queues.map((queue) => (
        <Menu.Item key={queue.id} onClick={() => gotoQueue(queue.id)}>
          {queue.name}
        </Menu.Item>
      ))}
    </SubMenu>
  );
};

const Main: React.FC = ({ children }) => {
  const [app, setApp] = useState<AppInfo | undefined>();
  const [hosts, setHosts] = useState<QueueHost[]>([]);
  const [isCollapsed, setCollapsed] = useState(false);

  const { data, error, loading } = useQuery(GetHostsDocument, {
    pollInterval: 10000,
  });

  const {
    data: appData,
    error: appError,
    loading: appLoading,
  } = useQuery(GetAppInfoDocument);

  const navigate = useNavigate();

  useEffect(() => {
    if (data && !loading) {
      const _hosts = (data.hosts ?? []) as QueueHost[];
      setHosts(_hosts);
    }
  }, [data, loading]);

  useEffect(() => {
    if (appData && !appLoading) {
      setApp(appData?.appInfo);
    }
  }, [appData, appLoading]);

  function onCollapsed(collapsed: boolean) {
    setCollapsed(collapsed);
  }

  function goHome() {
    navigate('/');
  }

  const iconStyle = {
    marginRight: '3px',
    marginLeft: isCollapsed ? '16px' : undefined,
    textAlign: isCollapsed ? 'center' : 'left',
  } as React.CSSProperties;

  const loadingIcon = <LoadingOutlined style={iconStyle} spin />;

  function Logo() {
    if (appLoading) return <Spin indicator={loadingIcon} />;
    return <span style={iconStyle}>🎯</span>;
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible={true}
        onCollapse={onCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          left: 0,
        }}
      >
        <div className="logo" id="logo" onClick={goHome}>
          <Logo />
          {!isCollapsed && <h1>{app?.title ?? 'Toro'}</h1>}
        </div>
        <Menu theme="dark" mode="inline">
          {hosts.map((host) => (
            <HostSubMenu host={host} key={`h-menu-${host.id}`} />
          ))}
          <Menu.Item key="3" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content
          style={{ margin: '16px 16px 0', minHeight: 280, overflow: 'initial' }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2020 Guanima Tech</Footer>
      </Layout>
    </Layout>
  );
};

export default Main;
