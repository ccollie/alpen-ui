import { line } from 'd3-shape';
import React, { useState, useEffect } from 'react';
import { GaugeScaleFn } from './Gauge';

interface GaugeAxisProps {
  angleSpan?: number;
  startAngle?: number;
  tickFormatter?: (data: any) => string;
  bigSegments?: number;
  smallSegments?: number;
  radius?: number;
  valueScale: GaugeScaleFn;
}

interface TickInfo {
  line?: string;
  textAnchor?: string;
  text?: string;
  textTransform?: string;
}

const GaugeAxis: React.FC<GaugeAxisProps> = (props) => {
  const {
    bigSegments = 10,
    smallSegments = 5,
    angleSpan = 0,
    startAngle = 0,
    radius = 0,
    valueScale,
    tickFormatter = (val) => val,
  } = props;
  const [ticks, setTicks] = useState<{ big: TickInfo[]; small: TickInfo[] }>({
    big: [],
    small: [],
  });
  const [rotationAngle, setRotationAngle] = useState(-90 + startAngle);
  const [rotate, setRotate] = useState('');

  useEffect(() => {
    setRotationAngle(-90 + startAngle);
    setRotate(`rotate(${rotationAngle})`);
  }, [startAngle]);

  useEffect(() => {
    setTicks(getTicks());
  }, []);

  function getTicks(): any {
    const bigTickSegment = angleSpan / bigSegments;
    const smallTickSegment = bigTickSegment / smallSegments;
    const tickLength = 20;
    const ticks = {
      big: [] as TickInfo[],
      small: [] as TickInfo[],
    };

    const startDistance = radius + 10;
    const textDist = startDistance + tickLength + 10;

    for (let i = 0; i <= bigSegments; i++) {
      const angleDeg = i * bigTickSegment;
      const angle = (angleDeg * Math.PI) / 180;

      const textAnchor = getTextAnchor(angleDeg);

      let skip = false;
      if (i === 0 && angleSpan === 360) {
        skip = true;
      }

      if (!skip) {
        let text = Number.parseFloat(
          valueScale.invert(angleDeg).toString(),
        ).toLocaleString();
        if (tickFormatter) {
          text = tickFormatter(text);
        }
        ticks.big.push({
          line: getTickPath(startDistance, tickLength, angle),
          textAnchor,
          text,
          textTransform: `
            translate(${textDist * Math.cos(angle)}, ${
            textDist * Math.sin(angle)
          }) rotate(${-rotationAngle})
          `,
        });
      }

      if (i === bigSegments) {
        continue;
      }

      for (let j = 1; j <= smallSegments; j++) {
        const smallAngleDeg = angleDeg + j * smallTickSegment;
        const smallAngle = (smallAngleDeg * Math.PI) / 180;

        ticks.small.push({
          line: getTickPath(startDistance, tickLength / 2, smallAngle),
        });
      }
    }

    return ticks;
  }

  function getTextAnchor(angle: number) {
    // [0, 45] = 'middle';
    // [46, 135] = 'start';
    // [136, 225] = 'middle';
    // [226, 315] = 'end';

    angle = (startAngle + angle) % 360;
    let textAnchor = 'middle';
    if (angle > 45 && angle <= 135) {
      textAnchor = 'start';
    } else if (angle > 225 && angle <= 315) {
      textAnchor = 'end';
    }
    return textAnchor;
  }

  function getTickPath(
    startDistance: number,
    tickLength: number,
    angle: number,
  ): string {
    const y1 = startDistance * Math.sin(angle);
    const y2 = (startDistance + tickLength) * Math.sin(angle);
    const x1 = startDistance * Math.cos(angle);
    const x2 = (startDistance + tickLength) * Math.cos(angle);

    const points = [
      { x: x1, y: y1 },
      { x: x2, y: y2 },
    ];
    const lineGenerator = line<any>()
      .x((d) => d.x)
      .y((d) => d.y);
    return lineGenerator(points) ?? '';
  }

  return (
    <g transform={rotate}>
      {ticks.big.map((tick) => (
        <g className="gauge-tick gauge-tick-large">
          <path d={tick.line} />
        </g>
      ))}
      {ticks.big.map((tick) => (
        <g className="gauge-tick gauge-tick-large">
          <text
            textAnchor={tick.textAnchor}
            transform={tick.textTransform}
            alignmentBaseline="central"
          >
            {tick.text}
          </text>
        </g>
      ))}
      {ticks.small.map((tick) => (
        <g className="gauge-tick gauge-tick-small">
          <path d={tick.line} />
        </g>
      ))}
    </g>
  );
};

export default GaugeAxis;
