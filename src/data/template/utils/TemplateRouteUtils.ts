export default class TemplateRouteUtils {
  static toDetail(slug?: string) { return '/templates/' + (slug || '') }
  static toList() { return '/templates' }
}