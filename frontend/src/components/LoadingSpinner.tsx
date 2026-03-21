import '../styles/LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner = ({ 
  size = 'medium', 
  fullScreen = false,
  message 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className={`spinner ${sizeClasses[size]}`}></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className={`spinner ${sizeClasses[size]}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
