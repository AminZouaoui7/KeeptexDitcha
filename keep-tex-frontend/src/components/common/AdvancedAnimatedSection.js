import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AdvancedAnimatedSection = ({
  children,
  animationType = 'fadeIn', // 'fadeIn', 'slideFromTop', 'slideFromLeft', 'slideFromRight', 'slideFromBottom'
  duration = 1.0,
  delay = 0,
  staggerChildren = 0.1,
  enableParallax = false,
  parallaxSpeed = 0.5,
  className = '',
  threshold = 0.1,
  triggerOnce = true
}) => {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold,
  });

  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: enableParallax ? parallaxRef : undefined,
    offset: ['start end', 'end start']
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * parallaxSpeed]);
  const x = useTransform(scrollYProgress, [0, 1], [0, 50 * parallaxSpeed]);

  // Animation variants based on type
  const getVariants = () => {
    const baseTransition = {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuart for natural feel
      delay
    };

    switch (animationType) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: baseTransition
          }
        };

      case 'slideFromTop':
        return {
          hidden: { opacity: 0, y: -60 },
          visible: {
            opacity: 1,
            y: 0,
            transition: baseTransition
          }
        };

      case 'slideFromLeft':
        return {
          hidden: { opacity: 0, x: -60 },
          visible: {
            opacity: 1,
            x: 0,
            transition: baseTransition
          }
        };

      case 'slideFromRight':
        return {
          hidden: { opacity: 0, x: 60 },
          visible: {
            opacity: 1,
            x: 0,
            transition: baseTransition
          }
        };

      case 'slideFromBottom':
        return {
          hidden: { opacity: 0, y: 60 },
          visible: {
            opacity: 1,
            y: 0,
            transition: baseTransition
          }
        };

      case 'fadeInScale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: baseTransition
          }
        };

      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: baseTransition
          }
        };
    }
  };

  // Container variants for staggered children
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay
      }
    }
  };

  const motionProps = {
    ref: enableParallax ? parallaxRef : ref,
    initial: "hidden",
    animate: inView ? "visible" : "hidden",
    variants: staggerChildren > 0 ? containerVariants : getVariants(),
    className: `advanced-animated-section ${className}`,
    ...(enableParallax && {
      style: {
        y: animationType.includes('slide') ? y : undefined,
        x: animationType === 'slideFromRight' || animationType === 'slideFromLeft' ? x : undefined
      }
    })
  };

  // Add a second ref for inView when using parallax
  if (enableParallax) {
    return (
      <motion.div {...motionProps}>
        <div ref={ref}>
          {staggerChildren > 0 ? (
            React.Children.map(children, (child, index) => (
              <motion.div
                key={index}
                variants={getVariants()}
                className="staggered-child"
              >
                {child}
              </motion.div>
            ))
          ) : (
            children
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...motionProps}>
      {staggerChildren > 0 ? (
        React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={getVariants()}
            className="staggered-child"
          >
            {child}
          </motion.div>
        ))
      ) : (
        children
      )}
    </motion.div>
  );
};

export default AdvancedAnimatedSection;