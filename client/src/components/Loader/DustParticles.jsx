import { motion } from "framer-motion";

const particles = [...Array(35)].map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: Math.random() * 8 + 6,
  duration: Math.random() * 6 + 8,
  delay: Math.random() * 5,
  moveX: Math.random() * 200 - 100
}));

const DustParticles = () => {
  return (
    <div className="dust-container">

      {particles.map((particle) => (

        <motion.div
          key={particle.id}
          className="dust-particle"

          initial={{
            opacity: 0,
            y: 0,
            x: 0,
            scale: 0.4
          }}

          animate={{
            opacity: [0, 0.7, 0],

            y: [-100, -700],

            x: [0, particle.moveX],

            scale: [0.5, 1.2, 0.8]
          }}

          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear"
          }}

          style={{
            left: `${particle.left}%`,
            bottom: "-10%",
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
        />
      ))}

    </div>
  );
};

export default DustParticles;