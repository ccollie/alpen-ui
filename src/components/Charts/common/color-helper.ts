import { range } from 'd3-array';
import { scaleLinear, scaleOrdinal, scaleQuantile } from 'd3-scale';

import { ColorSet, getColorSet } from './color-sets';

export interface CustomColor {
  name: string;
  value: string;
}

export type ColorMapper = (name: string | number) => string;

export type ScaleType = 'linear' | 'quantile' | 'ordinal';

export class ColorHelper {
  scale: any;
  scaleType: ScaleType;
  colorDomain: string[];
  domain: string[];
  customColors: ColorMapper | CustomColor[];

  constructor(
    scheme: ColorSet | string,
    type: ScaleType,
    domain: string[],
    customColors?: ColorMapper | CustomColor[],
  ) {
    if (typeof scheme === 'string') {
      scheme = getColorSet(scheme) as ColorSet;
    }
    this.colorDomain = scheme.domain;
    this.scaleType = type;
    this.domain = domain;
    this.customColors = customColors || [];

    this.scale = this.generateColorScheme(scheme, type, this.domain);
  }

  generateColorScheme(
    scheme: string | ColorSet,
    type: ScaleType,
    domain: string[],
  ) {
    let _scheme: ColorSet | undefined = undefined;
    if (typeof scheme === 'string') {
      const find = getColorSet(scheme);
      if (find) _scheme = find;
    } else {
      _scheme = scheme;
    }
    if (!_scheme) {
      throw Error('Invalid value for "scheme"');
    }
    let colorScale;
    if (type === 'quantile') {
      colorScale = scaleQuantile<string, string>()
        //.domain(domain)
        .range(_scheme.domain);
    } else if (type === 'ordinal') {
      colorScale = scaleOrdinal(domain, _scheme.domain);
    } else if (type === 'linear') {
      // linear schemes must have at least 2 colors
      const colorDomain = [..._scheme.domain];
      if (colorDomain.length === 1) {
        colorDomain.push(colorDomain[0]);
        this.colorDomain = colorDomain;
      }

      const points = range(0, 1, 1.0 / colorDomain.length);
      colorScale = scaleLinear(points, colorDomain);
    }

    return colorScale;
  }

  getColor(value: number | string) {
    if (value === undefined || value === null) {
      throw new Error('Value can not be null');
    }
    if (this.scaleType === 'linear') {
      const vals = this.domain;
      const scaled = vals.findIndex((v) => v === `${value}`) / vals.length;
      return this.scale(scaled);
    } else {
      if (typeof this.customColors === 'function') {
        return this.customColors(value);
      }

      const formattedValue = value.toString();
      const found = this?.customColors?.find((mapping) => {
        return mapping.name.toLowerCase() === formattedValue.toLowerCase();
      });

      if (found) {
        return found.value;
      } else {
        return this.scale(value);
      }
    }
  }
}
