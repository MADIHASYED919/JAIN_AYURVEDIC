import { motion } from "framer-motion";

const particles = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  size: Math.random() * 10 + 4,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 8 + 8,
  moveX: Math.random() * 40 - 20,
  moveY: Math.random() * 50 - 25,
}));

const GlowParticles = () => {
  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            x: [0, particle.moveX, 0],
            y: [0, particle.moveY, 0],
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default GlowParticles;