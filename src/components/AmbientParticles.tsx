import React, { useMemo } from 'react';

interface AmbientParticlesProps {
  theme?: 'emerald' | 'wood';
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({ theme = 'emerald' }) => {
  const isWood = theme === 'wood';

  // Generate 20 randomized pixel particles
  const particles = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${(i * 4.7 + (i % 3) * 7) % 96}%`,
      delay: `${(i * 0.7) % 8}s`,
      duration: `${6 + (i % 5) * 2}s`,
      size: i % 4 === 0 ? 6 : i % 3 === 0 ? 5 : 4,
      opacity: 0.25 + (i % 5) * 0.12,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-particle-rise"
          style={{
            left: p.left,
            bottom: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
            backgroundColor: isWood
              ? p.id % 2 === 0
                ? '#d49b6a'
                : '#f59e0b'
              : p.id % 3 === 0
              ? '#10b981'
              : p.id % 3 === 1
              ? '#34d399'
              : '#6ee7b7',
            boxShadow: isWood
              ? '0 0 8px rgba(212,155,106,0.6)'
              : '0 0 10px rgba(52,211,153,0.7)',
          }}
        />
      ))}
    </div>
  );
};
