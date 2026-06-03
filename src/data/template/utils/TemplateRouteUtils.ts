export default class TemplateRouteUtils {
  static toScreen(params?: any) { return '/templates' + (params?.id ? '/' + params.id : '') }
  static toDetail(slug?: string) { return '/templates/' + (slug || '') }
  static toList() { return '/templates' }
}
