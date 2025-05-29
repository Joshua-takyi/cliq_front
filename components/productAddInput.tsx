"use client";

interface InputProps {
  label: string;
  name: string;
  value: string | number | null; // Allow null but handle it properly
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  error?: string;
  step?: string; // Add step property
  min?: string; // Add min property
}

export const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  error,
  step, // Add step property
  min, // Add min property
}: InputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""} // Handle null values gracefully by converting to empty string for controlled input
        onChange={onChange}
        className={`w-full p-3 border ${
          error ? "border-red-500" : "border-gray-200"
        } rounded-none outline-hidden transition-all text-sm`}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        step={step} // Support decimal inputs for prices
        min={min} // Support minimum value constraints
      />
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};
