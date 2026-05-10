import "./trackingTimeline.css";

import vanImage from "../assets/delivery-van.png";

const steps = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered"
];

const TrackingTimeline = ({
  currentStatus
}) => {

  const currentIndex =
    steps.indexOf(currentStatus);

  return (

    <div className="tracking-main">

      <div className="tracking-wrapper">

        {steps.map((step, index) => {

          const completed =
            index < currentIndex;

          const active =
            index === currentIndex;

          return (

            <div
              className="tracking-step"
              key={index}
            >

              {/* CONNECTED LINE */}

              {index !== 0 && (

                <div
                  className={
                    index <= currentIndex
                      ? "tracking-line active-line"
                      : "tracking-line"
                  }
                />
              )}

              {/* NODE */}

              <div
                className={
                  index <= currentIndex
                    ? "tracking-node active-node"
                    : "tracking-node"
                }
              >

                {/* CURRENT STEP VAN */}

                {active ? (

                  <img
                    src={vanImage}
                    alt="van"
                    className="van-image"
                  />

                ) : index < currentIndex ? (

                  "✓"

                ) : null}

              </div>

              {/* LABEL */}

              <p
                className={
                  index <= currentIndex
                    ? "active-label"
                    : ""
                }
              >
                {step}
              </p>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackingTimeline;