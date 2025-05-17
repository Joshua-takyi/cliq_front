"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Interface for the accordion's individual item
interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

// The individual accordion item component
export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  isOpen,
  onClick,
  className = "",
}) => {
  return (
    <div className={`border-b border-gray-200 text-sm ${className}`}>
      {/* Accordion header/title bar */}
      <button
        className={`w-full py-4 px-1 flex justify-between items-center text-left font-medium text-sm focus:outline-none transition-colors ${
          isOpen ? "text-black" : "text-gray-600 hover:text-gray-900"
        }`}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="font-medium">{title}</span>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2 flex-shrink-0"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </motion.svg>
      </button>

      {/* Accordion content with animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Interface for the main Accordion component
interface AccordionProps {
  items: {
    id: string;
    title: string;
    content: React.ReactNode;
  }[];
  defaultOpen?: string;
  className?: string;
  allowMultiple?: boolean;
}

// The main Accordion component that manages the items
export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpen = "",
  className = "",
  allowMultiple = false,
}) => {
  // Track open items - either as a single string or an array based on allowMultiple
  const [openItems, setOpenItems] = useState<string[] | string>(
    defaultOpen
      ? allowMultiple
        ? [defaultOpen]
        : defaultOpen
      : allowMultiple
      ? []
      : ""
  );

  // Handle toggle for accordion items
  const handleToggle = (id: string) => {
    if (allowMultiple) {
      // If multiple items can be open simultaneously
      setOpenItems((prev) => {
        const prevItems = prev as string[];
        return prevItems.includes(id)
          ? prevItems.filter((item) => item !== id)
          : [...prevItems, id];
      });
    } else {
      // If only one item can be open at a time
      setOpenItems((prev) => (prev === id ? "" : id));
    }
  };

  // Check if an item is open
  const isOpen = (id: string) => {
    if (allowMultiple) {
      return (openItems as string[]).includes(id);
    }
    return openItems === id;
  };

  return (
    <div className={`divide-y divide-gray-200 ${className}`}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          className="text-sm"
          title={item.title}
          isOpen={isOpen(item.id)}
          onClick={() => handleToggle(item.id)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
