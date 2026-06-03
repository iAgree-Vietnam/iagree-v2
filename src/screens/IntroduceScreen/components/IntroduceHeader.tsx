"use client";

import { forwardRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import styles from "./IntroduceHeader.module.css";

const IntroduceHeader = forwardRef<HTMLDivElement, {}>(({}, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { title: "Câu chuyện sáng lập", href: "founding-story-section" },
    { title: "Các tính năng nổi bật", href: "features-section" },
    { title: "Lĩnh vực tại iAgree", href: "services-section" },
    { title: "Quy trình làm việc", href: "process-section" },
    { title: 'Hiểu về "Cơ Hội"', href: "connects-section" },
    {
      title: "Quyền lợi của Đối tác sáng lập",
      href: "benefits-section",
    },
    { title: "Đối tác sáng lập tại iAgree", href: "partners-section" },
  ];

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const headerHeight = 50;
      const offsetPosition = window.pageYOffset + rect.top - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  return (
    // Gán ref vào phần tử header
    <header className={styles.IntroduceHeader} ref={ref as any}>
      <div className={styles["header-container"]}>
        <div className={styles["header-content"]}>
          {/* Logo */}
          <div className={styles["logo-wrapper"]}>
            <a
              href="#banner-section"
              onClick={(e) => handleScrollToSection(e, "banner-section")}
            >
              <Image
                alt={"iagree"}
                src={"/assets/img/logo.svg"}
                width={120}
                height={40}
                style={{ marginRight: 20 }}
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles["header-menu"]}>
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={`#${item.href}`}
                className={styles["header-menu-item"]}
                onClick={(e) => handleScrollToSection(e, item.href)}
              >
                {item.title}
              </a>
            ))}
          </nav>

          {/* Nút menu di động */}
          <div className={styles["mobile-only"]}>
            <button
              className={styles["mobile-menu-button"]}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Menu di động */}
        {isMenuOpen && (
          <div className={styles["mobile-only"]}>
            <div className={styles["header-mobile-menu"]}>
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.href}`}
                  className={styles["header-mobile-menu-item"]}
                  onClick={(e) => handleScrollToSection(e, item.href)}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
});

// Thêm display name cho component
IntroduceHeader.displayName = "IntroduceHeader";

export default IntroduceHeader;
