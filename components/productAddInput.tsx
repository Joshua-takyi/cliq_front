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
        value={value ?? ""} // If value is null, use an empty string instead
        onChange={onChange}
        className={`w-full p-3 border ${
          error ? "border-red-500" : "border-gray-200"
        } rounded-lg outline-hidden transition-all`}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        step={step} // Add step attribute
        min={min} // Add min attribute
      />
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};
