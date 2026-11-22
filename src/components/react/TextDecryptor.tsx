/**
 * =====================================================================
 * CALLISTO DEEP SPACE OBSERVATORY & ASTRODYNAMICS ENGINE
 * =====================================================================
 * Architect & Developer: vijayraj.s
 * GitHub Profile: https://github.com/Vijajraj
 * Repository: https://github.com/Vijajraj/Callisto_website
 * =====================================================================
 */

import React, { useState, useEffect, useRef } from 'react';

interface TextDecryptorProps {
  text: string;
  speed?: number;
  triggerOnHover?: boolean;
  className?: string;
  as?: 'span' | 'h2' | 'h3' | 'h4' | 'div';
}

const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_#*~+=^<>';

export default function TextDecryptor({
  text,
  speed = 28,
  triggerOnHover = true,
  className = '',
  as: Component = 'span',
}: TextDecryptorProps): React.ReactElement {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const elementRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const targetLength = text.length;

    if (frameRef.current) {
      clearInterval(frameRef.current);
    }

    const interval = window.setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      iteration += 1 / 2;

      if (iteration >= targetLength) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);

    frameRef.current = interval;
  };

  useEffect(() => {
    // Initial reveal animation on mount
    startScramble();

    return () => {
      if (frameRef.current) {
        clearInterval(frameRef.current);
      }
    };
  }, [text]);

  const handleMouseEnter = () => {
    if (triggerOnHover && !isScrambling) {
      startScramble();
    }
  };

  return (
    <Component
      ref={elementRef as unknown as React.Ref<any>}
      className={`text-decryptor ${className}`}
      onMouseEnter={handleMouseEnter}
      aria-label={text}
    >
      {displayText}
    </Component>
  );
}
