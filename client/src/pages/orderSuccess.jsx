import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "./orderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🎉 Confetti burst
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // ⏳ Redirect after animation
    setTimeout(() => {
      navigate("/orders");
    }, 5000);
  }, []);

  return (
    <div className="success-container">
      <div className="success-card">
        
        <div className="checkmark-circle">
          <div className="checkmark">✓</div>
        </div>

        <h2>Order Placed Successfully 🎉</h2>
        <p>Your Ayurvedic products are on the way 🌿</p>


        <button onClick={() => navigate("/orders")}>
  View My Orders
</button>

      </div>
    </div>
  );
};

export default OrderSuccess;