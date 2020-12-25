// Create color scale
import { scaleLinear, scaleQuantile } from 'd3-scale';

const colorCodes = [
  '#66C2A5',
  '#ABDDA4',
  '#E6F598',
  '#FFFFBF',
  '#FEE08B',
  '#FFCC00',
  '#FDAE61',
  '#FF9900',
  '#F46D43',
  '#CF4F46',
  '#D53E4F',
  '#9E0142',
];

export function getColorRange(min: number, max: number): (x: number) => string {
  return (
    scaleQuantile<string>()
      // quantile scale divides domain in bands according to ordinal scale range
      .domain([min, max])
      .range(colorCodes)
  );
}
