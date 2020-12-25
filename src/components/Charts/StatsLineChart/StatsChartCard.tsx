import { Card, Col, Row, Tabs } from 'antd';

import React from 'react';
import DatePicker from '../../DatePicker';
import { RangePickerValue } from '../../RangePicker';
import Bar from '../Bar';
import styles from '../style.less';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

type KeyType = 'hour' | 'today' | 'week' | 'month' | 'year';

const ChartCard = ({
  range,
  data,
  isActive,
  handleRangeChange,
  loading,
  selectDate,
}: {
  range: RangePickerValue;
  isActive: (key: KeyType) => string;
  data: { x: string; y: number }[];
  loading: boolean;
  handleRangeChange: (
    dates: RangePickerValue,
    dateStrings: [string, string],
  ) => void;
  selectDate: (key: KeyType) => void;
}) => (
  <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
    <div className={styles.salesCard}>
      <Tabs
        tabBarExtraContent={
          <div className={styles.salesExtraWrap}>
            <div className={styles.salesExtra}>
              <a
                className={isActive('hour')}
                onClick={() => selectDate('hour')}
              >
                Hour
              </a>
              <a
                className={isActive('today')}
                onClick={() => selectDate('today')}
              >
                Today
              </a>
              <a
                className={isActive('week')}
                onClick={() => selectDate('week')}
              >
                Week
              </a>
              <a
                className={isActive('month')}
                onClick={() => selectDate('month')}
              >
                Month
              </a>
            </div>
            <RangePicker
              value={range}
              onChange={handleRangeChange}
              style={{ width: 256 }}
            />
          </div>
        }
        size="large"
        tabBarStyle={{ marginBottom: 24 }}
      >
        <TabPane tab="Sales" key="sales">
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar height={295} title="Sales" data={data} />
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Visits" key="views">
          <Row>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
              <div className={styles.salesBar}>
                <Bar height={292} title="Trends" data={data} />
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  </Card>
);

export default ChartCard;
