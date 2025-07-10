// pages/components/Animation/BurgerButton.tsx
import React from 'react';
import styles from './BurgerButton.module.css'; // ✅ versi module

interface Props {
  isOpen: boolean;
  toggle: () => void;
}

const BurgerButton: React.FC<Props> = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className={`${styles.burger} ${isOpen ? styles.open : ''}`}
      aria-label="Toggle Sidebar"
    >
      <span />
      <span />
      <span />
    </button>
  );
};

export default BurgerButton;
