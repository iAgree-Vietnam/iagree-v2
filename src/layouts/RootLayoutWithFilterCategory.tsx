import React, { CSSProperties } from "react";
import { Layout } from "antd";
import Footer from "../components/Footer";
import Script from "next/script";
import HeaderWithFilterCategory from "../components/HeaderWithFilterCategory";
import FloatingButtonContacts from "../components/FloatingButtonContacts";
import FooterV2 from "../components/footer-v2/FooterV2";

export interface RootLayoutWithFilterCategoryProps {
  hideFooter?: boolean;
  styleLayoutContent?: CSSProperties;
  children: React.ReactNode;
}

const RootLayoutWithFilterCategory = (props: RootLayoutWithFilterCategoryProps) => {
  const { hideFooter, styleLayoutContent } = props;

  const initializeZaloChat = () => {
    if (typeof window !== "undefined" && (window as any).zalo_chat_plugin) {
      (window as any).zalo_chat_plugin.run({
        oaid: "2918045479899063226", // Replace with your actual OA ID
        welcome_message: "Xin chào! Chúng tôi có thể giúp gì cho bạn?",
        autopopup: false,
        width: 280, // Reduced width
        height: 350, // Reduced height
      });
    }
  };

  return (
    <Layout>
      <HeaderWithFilterCategory />
      {/* Đặt SearchFilterHeader ngay dưới Header */}
      <Layout.Content style={styleLayoutContent}>
        {props.children}
      </Layout.Content>
      {!hideFooter && <FooterV2 />}

      {/* Start of Tawk.to Script */}
      {/* <Script type="text/javascript" id="tawk" async>
        {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/65a73ea18d261e1b5f542dd9/1hkalr7pi';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
          })();
        `}
      </Script> */}
      {/* End of Tawk.to Script */}

      {/* Start of Zalo Chat Script */}
      {/* <Script
        src="https://sp.zalo.me/plugins/sdk.js"
        async
        onLoad={initializeZaloChat}
      /> */}

      {/* Zalo Chat Widget - Move this OUTSIDE of Script component */}
      {/* <div
        className="zalo-chat-widget"
        data-oaid="2918045479899063226"
        data-welcome-message="Xin chào! Chúng tôi có thể giúp gì cho bạn?"
        data-autopopup="0"
        data-width="280"
        data-height="350"
        data-position="fixed"
        style={{
          background: 'transparent',
          border: 'none',
          visibility: 'visible',
          // position: 'fixed !important',
          // bottom: '170px !important',
          // right: '26px !important',
          width: '60px',
          height: '60px',
        }}
        ref={(el) => {
          if (el) {
            // Force position after component mounts and periodically
            const forcePosition = () => {
              el.style.setProperty('bottom', '10px', 'important');
              el.style.setProperty('right', '20px', 'important');
              el.style.setProperty('z-index', '2147483644', 'important');
              el.style.setProperty('background', 'transparent', 'important');
            };

            forcePosition();
            setTimeout(forcePosition, 500);
            setTimeout(forcePosition, 1000);
            setTimeout(forcePosition, 2000);

            // Watch for style changes
            const observer = new MutationObserver(() => forcePosition());
            observer.observe(el, { attributes: true, attributeFilter: ['style'] });

            return () => observer.disconnect();
          }
        }}
      >
      </div> */}
      {/* End of Zalo Chat Script */}

      {/* Google tag (gtag.js) */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-797L3DG4G9"
      />
      <Script async id="ggTag">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-797L3DG4G9');
        `}
      </Script>

      <FloatingButtonContacts />
    </Layout>
  );
};

export default RootLayoutWithFilterCategory;
