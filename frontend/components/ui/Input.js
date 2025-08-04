// components/ui/Input.js
import React from 'react';

const Input = ({ label, type, value, onChange, className }) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className}`}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;