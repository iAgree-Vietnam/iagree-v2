import React from 'react';
import { ConfigProvider } from 'antd';

const withTheme = (node: any) => (
  <>
    <ConfigProvider
      locale={{
        locale: 'en-US',
      }}
      // @ts-ignore
      pageHeader={{
        ghost: false,
      }}
      theme={{
        token: {
          fontFamily: 'Cabin',
          colorPrimary: '#09993E',
          colorText: '#25272D',
          colorError: '#E14141',
          fontSizeLG: 14,
          paddingContentHorizontal: 24,
          controlHeight: 38,
          controlHeightLG: 48,
        },
        components: {
          Button: {
            colorPrimary: '#25272D',
            colorLink: '#09993E',
            colorLinkHover: '#066B42',
            colorLinkActive: '#066B42',
            borderRadiusLG: 25,
            borderRadiusSM: 25,
            borderRadius: 25,
            defaultBorderColor: '#09993E',
            defaultHoverBg: '#09993E',
            defaultHoverColor: '#FFFFFF',
            fontSizeSM: 12,
            paddingInlineSM: 10,
            paddingInlineLG: 50,
            colorBgContainerDisabled: 'rgba(116, 118, 126, 0.5)',
            borderColorDisabled: 'transparent',
            colorTextDisabled: '#FFFFFF'
          },
          Form: {
            itemMarginBottom: 20,
            labelFontSize: 16,
          },
          Menu: {
            colorPrimary: '#25272D',
            itemColor: '#25272D',
            itemHoverBg: '#FFFFFF',
            itemSelectedBg: '#FFFFFF',
            itemActiveBg: '#FFFFFF',
            fontWeightStrong: 500,
          },
        },
      }}
    >
      {node}
    </ConfigProvider>
  </>
);

export const withThemeRevert = (node: any) => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#25272D',
        },
        components: {
          Button: {
            colorPrimary: '#09993E',
            defaultHoverBorderColor: '#09993E'
          },
        },
      }}
    >
      {node}
    </ConfigProvider>
  </>
);

export default withTheme;
