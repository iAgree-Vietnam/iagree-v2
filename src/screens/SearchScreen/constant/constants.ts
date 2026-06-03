const initData = {
  total: 0,
  items: [],
};

const per_page = 6;
const CUSTOM_BREAKPOINT = 1200;

const STORAGE_KEYS = {
  JOB_FILTERS: "search_job_filters",
  PARTNER_FILTERS: "search_partner_filters",
  ACTIVE_TAB: "search_active_tab",
  SEARCH_TERM: "search_term",
  JOB_PAGE: "search_job_page",
  PARTNER_PAGE: "search_partner_page",
  NAVIGATION_ID: "search_navigation_id",
};

export { STORAGE_KEYS, per_page, CUSTOM_BREAKPOINT, initData };
