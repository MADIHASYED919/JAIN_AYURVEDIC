import { motion } from "framer-motion";

const mistVariants = {
  animate: {
    x: ["-10%", "10%", "-10%"],
    y: ["0%", "-5%", "0%"],
    scale: [1, 1.08, 1],
    transition: {
      duration: 30,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const MistOverlay = () => {
  return (
    <>
      {/* Mist Layer 1 */}
      <motion.div
        className="mist mist-1"
        variants={mistVariants}
        animate="animate"
      />

      {/* Mist Layer 2 */}
      <motion.div
        className="mist mist-2"
        variants={mistVariants}
        animate="animate"
      />

      {/* Mist Layer 3 */}
      <motion.div
        className="mist mist-3"
        variants={mistVariants}
        animate="animate"
      />
    </>
  );
};

export default MistOverlay;