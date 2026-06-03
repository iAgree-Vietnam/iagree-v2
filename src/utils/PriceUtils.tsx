import _ from 'lodash';

export default class PriceUtils {

    static format(num: any) {
        if (_.isNull(num)) return '';

        if (parseInt(num) === 0) return 0;

        num = (num || '').toString();

        num = num.replace(/\$\s?|(,*)/g, '');

        return `${num}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    static display(price: any) {
        const priceNumber = PriceUtils.format(price);

        return _.isEmpty(priceNumber) ? '0 đ' : `${priceNumber} đ`;
    }

    static displayVND(price: any) {
        const priceNumber = PriceUtils.format(price);

        return _.isEmpty(priceNumber) ? '0 VNĐ' : `${priceNumber} VNĐ`;
    }

    static displayByKUnit(price: any) {
        if (_.isNull(price)) return '';

        const priceNumber = PriceUtils.format(parseInt(price)/1000);

        return `${priceNumber}K`;
    }

    static displayByMUnit(price: any) {
        if (_.isNull(price)) return '';

        const priceNumber = PriceUtils.format(parseInt(price)/1000000);

        return `${priceNumber}M`;
    }

}
