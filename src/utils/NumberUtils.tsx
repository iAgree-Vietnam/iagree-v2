import _, { toNumber } from 'lodash';

export default class NumberUtils {

    static makesureNumber(value: any, defaultValue = null) {
        const newNumber = parseInt(value);

        return NumberUtils.isNumber(newNumber) ? newNumber : defaultValue;
    }

    static isNumber(num: any) {
        num = parseInt(num);
        return !_.isNaN(num) && _.isNumber(num);
    }

    static unformatNumber(value: any) {
        let newNumber = (value || '').toString();
        newNumber = value.replace(/\$\s?|(,*)/g, '');
        newNumber = parseInt(newNumber);

        return NumberUtils.isNumber(newNumber) ? newNumber : null;
    }

    static formatNumber(num: any) {
        if (_.isNull(num)) return '';

        if (parseInt(num) === 0) return 0;

        num = (num || '').toString();

        num = num.replace(/\$\s?|(,*)/g, '');

        return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    static display(num: any) {
        return toNumber(parseFloat(num).toFixed(2)) as number;
    }

}
