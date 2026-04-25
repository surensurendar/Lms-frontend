import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/CommonSelect.css';

export default function CommonSelect({ id, name, value, onChange, options, placeholder = "Select an option" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    // Mimic the standardized event object structure
    const event = {
      target: {
        name: name,
        value: optionValue
      }
    };
    onChange(event);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="common-select-container" ref={containerRef}>
      {/* Hidden native input for form submissions if needed */}
      <input type="hidden" id={id} name={name} value={value} />
      
      <div 
        className={`common-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex="0"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? "selected-text" : "placeholder-text"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className="dropdown-chevron" 
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      {isOpen && (
        <div className="common-select-menu" role="listbox">
          {options.map((opt) => (
            <div 
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={`common-select-option ${value === opt.value ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              <span className="option-label">{opt.label}</span>
              {value === opt.value && (
                <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
