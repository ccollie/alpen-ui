import React, { useCallback, useEffect, useState } from 'react';
import CountUp from '../../CountUp';
import { ColorHelper, formatLabel, trimLabel } from '../common';
import './advanced-legend.scss';

interface AdvancedLegendProps {
  width: number;
  label?: string;
  animations?: boolean;
  data?: { name: string; value: number }[];
  colors?: ColorHelper;
  valueFormatter?: (value: number) => any;
  labelFormatter: (value: string) => string;
  percentageFormatter: (value: number) => any;
  onSelect?: (data: any) => void;
  onActivate?: (data: any) => void;
  onDeactivate?: (data: any) => void;
}

const noop = () => {};

const AdvancedPieLegend: React.FC<AdvancedLegendProps> = (props) => {
  const {
    width,
    data = [],
    colors,
    label = 'Total',
    animations = true,
  } = props;

  const [total, setTotal] = useState(0);
  const [roundedTotal, setRoundedTotal] = useState(0);
  const [legendItems, setLegendItems] = useState<any[]>([]);

  const {
    valueFormatter = (value) => value.toLocaleString(),
    labelFormatter = (label) => label,
    percentageFormatter = (percentage) => percentage.toLocaleString(),
    onActivate = noop,
    onDeactivate = noop,
    onSelect = noop,
  } = props;

  const _labelFormatting = useCallback(labelFormatter, [labelFormatter]);
  const _valueFormatting = useCallback(valueFormatter, [valueFormatter]);
  const _percentageFormatting = useCallback(percentageFormatter, [
    percentageFormatter,
  ]);

  const handleActivate = useCallback((data) => onActivate(data), [onActivate]);
  const handleDeactivate = useCallback((data) => onDeactivate(data), [
    onDeactivate,
  ]);
  const handleSelect = useCallback((data) => onSelect(data), [onSelect]);

  useEffect(() => {
    const t = data.map((d) => d.value).reduce((sum, d) => sum + d, 0);
    setTotal(t);
    setRoundedTotal(total);
    setLegendItems(getLegendItems());
  }, [data]);

  function getLegendItems(): any[] {
    return data.map((d) => {
      const label = formatLabel(d.name);
      const value = d.value;
      const color = colors?.getColor(label);
      const percentage = total > 0 ? (value / total) * 100 : 0;
      const formattedLabel = _labelFormatting(label);

      return {
        _value: value,
        data: d,
        value,
        color,
        label: formattedLabel,
        displayLabel: trimLabel(formattedLabel, 20),
        originalLabel: d.name,
        percentage: _percentageFormatting(percentage),
      };
    });
  }

  return (
    <div className="advanced-pie-legend" style={{ width }}>
      {animations ? (
        <CountUp
          className="total-value"
          countTo={roundedTotal}
          valueFormatter={_valueFormatting}
        />
      ) : (
        <div className="total-value">{_valueFormatting(roundedTotal)}</div>
      )}
      <div className="total-label">{{ label }}</div>
      <div className="legend-items-container">
        <div className="legend-items">
          {legendItems.map((legendItem) => (
            <div
              tabIndex={-1}
              className="legend-item"
              key={legendItem.label}
              onMouseEnter={() => handleActivate(legendItem.data)}
              onMouseLeave={() => handleDeactivate(legendItem.data)}
              onClick={() => handleSelect(legendItem.data)}
            >
              <div
                className="item-color"
                style={{ borderLeftColor: legendItem.color }}
              />
              {animations ? (
                <CountUp
                  className="item-value"
                  countTo={legendItem._value}
                  valueFormatting={_valueFormatting}
                />
              ) : (
                <div className="item-value">
                  {_valueFormatting(legendItem.value)}
                </div>
              )}
              <div className="item-label">{legendItem.displayLabel}</div>
              {animations ? (
                <CountUp
                  className="item-percent"
                  countTo={legendItem.percentage}
                  countSuffix="'%'"
                />
              ) : (
                <div className="item-percent">
                  {legendItem.percentage.toLocaleString()}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedPieLegend;
