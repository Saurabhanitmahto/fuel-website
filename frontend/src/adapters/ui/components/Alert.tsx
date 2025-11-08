import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose }) => {
  const styles = {
    success: {
      container: 'bg-green-50 border-green-400',
      icon: <CheckCircle className="text-green-500" size={20} />,
      text: 'text-green-800',
    },
    error: {
      container: 'bg-red-50 border-red-400',
      icon: <XCircle className="text-red-500" size={20} />,
      text: 'text-red-800',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-400',
      icon: <AlertCircle className="text-yellow-500" size={20} />,
      text: 'text-yellow-800',
    },
    info: {
      container: 'bg-blue-50 border-blue-400',
      icon: <Info className="text-blue-500" size={20} />,
      text: 'text-blue-800',
    },
  };

  const style = styles[type];

  return (
    <div className={`border-l-4 p-4 ${style.container} rounded-r-md`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">{style.icon}</div>
        <div className={`ml-3 flex-1 ${style.text}`}>
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 inline-flex text-gray-400 hover:text-gray-600"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>
    </div>
  );
};