import { useEffect, useState } from "react";
import "./productDetails.css";
const PageTransition = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className={show ? "page-enter" : ""}>
      {children}
    </div>
  );
};

export default PageTransition;