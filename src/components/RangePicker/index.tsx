import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';
import generateRangePicker, {
  RangePickerProps,
} from 'antd/es/date-picker/generatePicker';
import 'antd/es/date-picker/style/index';

const RangePicker = generateRangePicker<Date>(dateFnsGenerateConfig);

export default RangePicker;
export type RangePickerValue = RangePickerProps<Date>['value'];
