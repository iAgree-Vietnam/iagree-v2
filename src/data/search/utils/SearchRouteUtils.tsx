export default class SearchRouteUtils {
    static toScreen(queryParams: any) {
        return ['/search', new URLSearchParams(queryParams)].join('?');
    }
}
