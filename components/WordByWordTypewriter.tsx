// src/components/WordByWordTypewriter.tsx
import React from 'react';
import { motion, Variants } from 'framer-motion';

interface WordByWordProps {
  htmlContent: string;
  className?: string;
  staggerDelay?: number;
}

export const WordByWordTypewriter: React.FC<WordByWordProps> = ({
  htmlContent,
  className = '',
  staggerDelay = 0.02,
}) => {
  const tokens = React.useMemo(() => {
    const parts = htmlContent.split(/(<span.*?>.*?<\/span>|\s+|·)/g).filter(Boolean);
    return parts;
  }, [htmlContent]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 4, 
      filter: 'blur(2px)' 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { 
        duration: 0.2, 
        ease: 'easeOut' 
      } 
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-50px' }}
    >
      {tokens.map((token, index) => {
        if (token.startsWith('<span')) {
          return (
            <motion.span
              key={index}
              variants={wordVariants}
              className="inline-block mx-[2px]"
              dangerouslySetInnerHTML={{ __html: token }}
            />
          );
        }

        if (token.trim() === '·') {
          return (
            <motion.span
              key={index}
              variants={wordVariants}
              className="inline-block text-[#f74a35] font-bold mx-1"
            >
              ·
            </motion.span>
          );
        }

        if (/^\s+$/.test(token)) {
          return <span key={index}> </span>;
        }

        return (
          <motion.span
            key={index}
            variants={wordVariants}
            className="inline-block"
          >
            {token}
          </motion.span>
        );
      })}
    </motion.div>
  );
};