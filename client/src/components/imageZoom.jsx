import { useState, useRef } from "react";
import "./imageZoom.css";

const ImageZoom = ({ src }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef();

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // LIMIT inside container
    const lensSize = 150;
    x = Math.max(lensSize / 2, Math.min(x, rect.width - lensSize / 2));
    y = Math.max(lensSize / 2, Math.min(y, rect.height - lensSize / 2));

    setLensPos({ x, y });
  };

  return (
    <div className="zoom-wrapper">
      
      {/* LEFT IMAGE */}
      <div
        className="image-container"
        ref={containerRef}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <img src={src} alt="product" />

        {/* LENS */}
        {showZoom && (
          <div
            className="lens"
            style={{
              left: lensPos.x - 75,
              top: lensPos.y - 75,
            }}
          />
        )}
      </div>

      {/* RIGHT ZOOM PANEL */}
      <div
        className={`zoom-view ${showZoom ? "active" : ""}`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundPosition: `${-lensPos.x * 3.0 + 200}px ${-lensPos.y * 3.0 + 200}px`
        }}
      />
    

  





    </div>
  );
};

export default ImageZoom;