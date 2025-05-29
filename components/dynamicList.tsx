"use client";

import { useState } from "react";
import { Plus, X, ChevronDown } from "lucide-react";

// Define an interface for option items in the dropdown
export interface OptionItem {
  id: string;
  name: string;
}

interface DynamicListProps {
  title: string;
  items: string[];
  onAddItem: (item: string) => void;
  onDeleteItem: (index: number) => void;
  placeholder?: string;
  error?: string;
  options?: OptionItem[];
  allowCustom?: boolean;
}

export const DynamicList = ({
  title,
  items,
  onAddItem,
  onDeleteItem,
  placeholder = "Add new item...",
  error,
  options = [],
  allowCustom = true,
}: DynamicListProps) => {
  const [newItem, setNewItem] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [inputMode, setInputMode] = useState<"select" | "text">(
    options.length > 0 ? "select" : "text"
  );

  // Handle adding a new item from text input
  const handleAddTextItem = () => {
    if (newItem.trim()) {
      onAddItem(newItem.trim());
      setNewItem("");
    }
  };

  // Handle adding a selected item from dropdown - stores ID but shows name
  const handleAddSelectedItem = () => {
    if (selectedOption) {
      onAddItem(selectedOption); // Pass the ID value to maintain data consistency
      setSelectedOption("");
    }
  };

  // Handle adding the appropriate item based on input mode
  const handleAddItem = () => {
    if (inputMode === "text") {
      handleAddTextItem();
    } else {
      handleAddSelectedItem();
    }
  };

  // Handle keypress (enter) to add an item
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTextItem();
    }
  };

  // Toggle between select and text input modes if both are available
  const toggleInputMode = () => {
    if (allowCustom && options.length > 0) {
      setInputMode(inputMode === "select" ? "text" : "select");
    }
  };

  // Helper function to get display name from ID when options are available
  const getDisplayName = (id: string): string => {
    if (options.length > 0) {
      const option = options.find((opt) => opt.id === id);
      return option ? option.name : id; // Fall back to ID if no matching option found
    }
    return id; // If no options provided, just use the ID
  };

  return (
    <div className="space-y-5 p-4 bg-white border border-gray-100 rounded-none shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        {allowCustom && options.length > 0 && (
          <button
            type="button"
            onClick={toggleInputMode}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {inputMode === "select" ? "Add custom item" : "Choose from list"}
          </button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="flex items-center gap-2">
        {inputMode === "text" || !options.length ? (
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-grow p-3 border border-gray-200 rounded-none text-sm"
            aria-label={`Add ${title}`}
          />
        ) : (
          <div className="relative flex-grow">
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-none appearance-none text-sm"
              aria-label={`Select ${title}`}
            >
              <option value="">Select {title.toLowerCase()}...</option>
              {options.map((option) => (
                // Display name but pass ID as value for consistent data handling
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleAddItem}
          className="p-3 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition-colors flex items-center"
          disabled={
            (inputMode === "text" && !newItem.trim()) ||
            (inputMode === "select" && !selectedOption)
          }
        >
          <Plus size={20} />
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4 max-h-[180px] overflow-y-auto p-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-none border border-blue-100"
            >
              {/* Display the friendly name if options are available, otherwise show the stored value */}
              <span className="text-sm font-medium">
                {getDisplayName(item)}
              </span>
              <button
                type="button"
                onClick={() => onDeleteItem(index)}
                className="hover:bg-blue-100 rounded-none p-1"
                aria-label={`Remove ${getDisplayName(item)}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
