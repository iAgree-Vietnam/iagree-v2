import { DatePicker } from "antd";
import type { Moment } from "moment";
import momentGenerateConfig from "@rc-component/picker/lib/generate/moment";
// import momentGenerateConfig from 'rc-picker/lib/generate/moment';

const AppDatePicker = DatePicker.generatePicker<Moment>(momentGenerateConfig);

export default AppDatePicker;
