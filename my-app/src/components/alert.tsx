import { useState, useEffect } from "react";

interface AutoAlertProps {
  duration: number; // Duration in milliseconds
  onClose: () => void; // Callback to close the alert
}

const AutoAlert: React.FC<AutoAlertProps> = ({ duration, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Fade out after the specified duration
    }, duration);

    // Cleanup the timer if the component is unmounted before the timer ends
    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        onClose(); // Actually call the onClose after the transition ends
      }, 300); // 300ms corresponds to the transition duration

      return () => clearTimeout(timeout);
    }
  }, [isVisible, onClose]);

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg transition-all duration-500 ease-in-out ${
        isVisible
          ? "opacity-100 translate-x-0" // Show the alert
          : "opacity-0 translate-x-10" // Hide the alert with a slight slide to the right
      }`}
    >
      <span>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      Email have been send
      </span>
    </div>
  );
};

export default AutoAlert;
