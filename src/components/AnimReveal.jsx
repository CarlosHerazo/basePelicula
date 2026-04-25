import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

export default function AnimReveal({ children, delay = 0, direction = 'up', sx = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.07 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const initial = {
    up:    'translateY(38px)',
    down:  'translateY(-38px)',
    left:  'translateX(-38px)',
    right: 'translateX(38px)',
    scale: 'scale(0.93)',
  }[direction] ?? 'translateY(38px)';

  return (
    <Box
      ref={ref}
      sx={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'none' : initial,
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'transform, opacity',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
