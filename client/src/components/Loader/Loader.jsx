import "./Loader.css";

import { motion, AnimatePresence } from "framer-motion";

import bgImage from "./loader-bg.png";
import logo from "./logo.png"
import GlowParticles from "./GlowParticles";
import MistOverlay from "./MistOverlay";
import DustParticles from "./DustParticles";


const Loader = () => {
  return (
      <AnimatePresence>
    <motion.div
      className="loader-container"
      initial={{
  opacity: 1,
  scale: 1,
  filter: "blur(0px)"
}}

animate={{
  opacity: 1,
  scale: 1,
  filter: "blur(0px)"
}}

exit={{
  opacity: 0,
  scale: 1.08,
  filter: "blur(12px)"
}}

transition={{
  duration: 1.2,
  ease: "easeInOut"
}}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay */}
      <div className="loader-overlay"></div>
      <div className="cinematic-vignette"></div>

      <MistOverlay />
<GlowParticles />
<DustParticles />


      {/* Main Content */}
      <div className="loader-content">

        {/* Welcome Text */}
        <motion.p
          className="welcome-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          Welcome to
        </motion.p>

        {/* Brand Name */}
        <motion.h1
          className="brand-title"
          initial={{
            opacity: 0,
            scale: 0.8,
            filter: "blur(10px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{
            delay: 0.3,
            duration: 1.2,
          }}
        >
          JAIN AYURVEDIC
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          className="brand-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.8,
            duration: 1,
          }}
        >
          MEDICAL STORE
        </motion.h2>


        {/* Logo */}
        <motion.div
          className="logo-wrapper"
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 1,
            duration: 1,
          }}
        >
          <img
            src={logo}
            alt="logo"
            className="loader-logo"
          />

          <div className="logo-glow"></div>
        </motion.div>

        {/* Healing Text */}
        <motion.p
          className="healing-text"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.3,
            duration: 1,
          }}
        >
          Healing Naturally • Powered by Ayurveda
        </motion.p>

        {/* Loading Line */}
        <motion.div
          className="loading-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.5,
          }}
        >
          <p className="loading-text">
            Loading...
          </p>

          <div className="loading-line">
            <div className="loading-dot"></div>
          </div>
        </motion.div>

      </div>
   </motion.div>
  </AnimatePresence>
  );
};

export default Loader;