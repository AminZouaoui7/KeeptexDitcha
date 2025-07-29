import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxBackground = ({
  children,
  backgroundImage,
  speed = 0.5,
  className = '',
  overlay = true,
  overlayOpacity = 0.4
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Transform for parallax effect
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 + speed * 0.2]);

  return (
    <div ref={ref} className={`parallax-container ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Parallax Background */}
      <motion.div
        className="parallax-background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transition: 'background-image 0.8s ease, transform 0.5s ease',
          y,
          scale,
          zIndex: -2
        }}
      />
      
      {/* Overlay */}
      {overlay && (
        <div
          className="parallax-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
            zIndex: -1
          }}
        />
      )}
      
      {/* Content */}
      <div className="parallax-content" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default ParallaxBackground;