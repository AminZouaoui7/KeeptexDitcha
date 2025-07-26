import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './SectionDivider.css';

const SectionDivider = ({ variant = 'default', delay = 0 }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const dividerVariants = {
    hidden: { 
      scaleX: 0,
      opacity: 0
    },
    visible: { 
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        delay: delay,
        ease: "easeInOut"
      }
    }
  };

  const dotVariants = {
    hidden: { 
      scale: 0,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: delay + 0.5,
        ease: "easeOut"
      }
    }
  };

  const waveVariants = {
    hidden: { 
      pathLength: 0,
      opacity: 0
    },
    visible: { 
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        delay: delay,
        ease: "easeInOut"
      }
    }
  };

  if (variant === 'wave') {
    return (
      <div ref={ref} className="section-divider wave-divider">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <motion.path
            d="M0,30 Q300,10 600,30 T1200,30"
            stroke="#1e3a8a"
            strokeWidth="3"
            fill="none"
            variants={waveVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          />
          <motion.circle
            cx="600"
            cy="30"
            r="6"
            fill="#1e3a8a"
            variants={dotVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          />
        </svg>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div ref={ref} className="section-divider gradient-divider">
        <motion.div
          className="gradient-line"
          variants={dividerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div
            className="gradient-dot left"
            variants={dotVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          />
          <motion.div
            className="gradient-dot center"
            variants={{
              ...dotVariants,
              visible: {
                ...dotVariants.visible,
                transition: {
                  ...dotVariants.visible.transition,
                  delay: delay + 0.7
                }
              }
            }}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          />
          <motion.div
            className="gradient-dot right"
            variants={{
              ...dotVariants,
              visible: {
                ...dotVariants.visible,
                transition: {
                  ...dotVariants.visible.transition,
                  delay: delay + 0.9
                }
              }
            }}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          />
        </motion.div>
      </div>
    );
  }

  // Default variant
  return (
    <div ref={ref} className="section-divider default-divider">
      <motion.div
        className="divider-line"
        variants={dividerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      />
      <motion.div
        className="divider-dot"
        variants={dotVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      />
    </div>
  );
};

export default SectionDivider;