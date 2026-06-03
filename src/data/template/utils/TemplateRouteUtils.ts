/**
 * TemplateRouteUtils — stub (template module was removed from data directory)
 */
export default class TemplateRouteUtils {
  static toScreen(queryParams?: any): string {
    if (queryParams && Object.keys(queryParams).length > 0) {
      return ["/templates", new URLSearchParams(queryParams).toString()].join("?");
    }
    return "/templates";
  }

  static toListScreen(queryParams?: any): string {
    if (queryParams && Object.keys(queryParams).length > 0) {
      return ["/templates/list", new URLSearchParams(queryParams).toString()].join("?");
    }
    return "/templates/list";
  }

  static toTemplateManageUrl(params?: any): string {
    if (params && Object.keys(params).length > 0) {
      return ["/profile/templates", new URLSearchParams(params).toString()].join("?");
    }
    return "/profile/templates";
  }

  static toPaymentUrl(params?: any): string {
    if (params && Object.keys(params).length > 0) {
      return ["/payment/template", new URLSearchParams(params).toString()].join("?");
    }
    return "/payment/template";
  }
}
