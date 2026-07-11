import React from 'react';

export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  rows = 4, // textarea only
  options = [], // select only
  ...props
}) {
  const baseInputStyles = 'w-full px-4 py-2.5 rounded-xl border bg-white text-charcoal-text font-sans text-sm transition-all outline-none focus:ring-2';
  
  const borderStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : 'border-walnut-brown/20 focus:border-walnut-brown focus:ring-walnut-brown/15';

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-walnut-brown tracking-wide flex items-center">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseInputStyles} ${borderStyles} resize-none`}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseInputStyles} ${borderStyles} appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%235C4033%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${baseInputStyles} ${borderStyles}`}
          {...props}
        />
      )}

      {error && (
        <span className="text-xs font-medium text-red-600 pl-1 mt-0.5 animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
}
