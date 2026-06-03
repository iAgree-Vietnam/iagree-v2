import { Grid } from 'antd';

export function useBreakpoint() {
    const screens = Grid.useBreakpoint();

    const isMobile = !!screens.xs && !screens.sm;
    const isTablet = !!screens.sm && !screens.lg;
    const isDesktop = !!screens.lg;
    const isBigDesktop = !!screens.xxl;

    return {
        isMobile,
        isTablet,
        isDesktop,
        isBigDesktop
    };
}
