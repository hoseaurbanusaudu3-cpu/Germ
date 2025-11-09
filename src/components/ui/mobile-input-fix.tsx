import * as React from "react";
import { Input } from "./input";

/**
 * Mobile-friendly Input wrapper that fixes typing issues on mobile devices
 * 
 * Issue: On some mobile devices, React's controlled inputs can cause
 * single-character typing where the input loses focus after each keystroke
 * 
 * Solution: Use uncontrolled input with ref and sync to controlled state
 */

interface MobileInputProps extends React.ComponentProps<typeof Input> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MobileInput({ value, onChange, ...props }: MobileInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = React.useState(value || '');

  // Sync external value changes to internal state
  React.useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.value = value;
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    // Call parent onChange
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <Input
      ref={inputRef as any}
      value={internalValue}
      onChange={handleChange}
      {...props}
    />
  );
}
