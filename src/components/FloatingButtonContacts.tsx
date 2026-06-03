import React, { useState } from "react";
import styles from "./FloatingButtonContacts.module.css";
import Link from "next/link";
import { IconSvgLocal } from "./icon-svg-local";

function FloatingButtonContacts() {
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);

  return (
    <div className={styles.floatingButtonContainer}>
      <div
        className={`${styles.floatingButtonSubmenu} ${
          isFloatingMenuOpen ? styles.active : ""
        }`}
      >
        <Link
          href="https://zalo.me/2918045479899063226"
          className={styles.submenuButton}
          target="_blank"
        >
          <IconSvgLocal name="IC_ZALO" className={styles.zaloIcon} />
        </Link>
        <Link
          href="https://wa.me/84896868989"
          className={styles.submenuButton}
          target="_blank"
        >
          <IconSvgLocal name="IC_WHATSAPP" className={styles.whatsappIcon} />
        </Link>
        <Link
          href="https://m.me/173079829215093"
          className={styles.submenuButton}
          target="_blank"
        >
          <IconSvgLocal name="IC_MESSENGER" className={styles.messengerIcon} />
        </Link>
        <Link
          href="https://outlook.office.com/mail/"
          className={styles.submenuButton}
          target="_blank"
        >
          <IconSvgLocal name="IC_OUTLOOK" className={styles.outlookIcon} />
        </Link>
      </div>
      <button
        className={styles.floatingButton}
        onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
      >
        {isFloatingMenuOpen ? (
          <IconSvgLocal name="IC_ARROW_DOWN" className={styles.primaryIcon} />
        ) : (
          <IconSvgLocal name="IC_MORE" className={styles.primaryIcon} />
        )}
      </button>
    </div>
  );
}

export default FloatingButtonContacts;