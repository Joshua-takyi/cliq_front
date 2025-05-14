"use client";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  name: string;
}

/**
 * Custom checkbox component with proper styling and accessibility
 */
export const FormCheckbox = ({
  label,
  checked,
  onChange,
  name,
}: CheckboxProps) => {
  return (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <label htmlFor={name} className="text-gray-700">
        {label}
      </label>
    </div>
  );
};

/**
 * Grouped checkbox component for product form
 * Groups multiple checkboxes with a heading
 */
export const CheckboxGroup = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Product Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Checkboxes will be rendered here */}
      </div>
    </div>
  );
};
