"use client";

import React from "react";

/**
 * CheckoutFormInput component for consistent form field styling in checkout form
 * This component provides standardized input fields with proper labeling and validation visual cues
 */
interface CheckoutFormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  options?: { value: string; label: string }[];
  as?: "input" | "textarea" | "select";
  maxLength?: number;
  rows?: number;
}

const CheckoutFormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
  options = [],
  as = "input",
  maxLength,
  rows = 3,
}: CheckoutFormInputProps) => {
  // Determine the component to render based on the 'as' prop
  const renderInput = () => {
    const baseClasses = `w-full border  ${
      error ? "border-red-500" : "border-black/50"
    } rounded-none p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`;

    switch (as) {
      case "textarea":
        return (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            placeholder={placeholder}
            required={required}
            className={baseClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            maxLength={maxLength}
            rows={rows}
          />
        );
      case "select":
        return (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
            className={baseClasses}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <option value="">{placeholder || "Select an option..."}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            className={baseClasses}
            placeholder={placeholder}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            maxLength={maxLength}
          />
        );
    }
  };

  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default CheckoutFormInput;
