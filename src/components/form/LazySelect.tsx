import React, { useState, useCallback } from "react";
import Select from "./Select";

interface Option {
  value: string;
  label: string;
}

interface LazySelectProps {
  loadOptions: () => Promise<Option[]>;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string;
  error?: boolean;
  hint?: string;
}

const LazySelect: React.FC<LazySelectProps> = ({ 
  loadOptions, 
  placeholder = "Select an option", 
  ...props 
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFetch = useCallback(async () => {
    if (isLoaded || isLoading) return;
    
    try {
      setIsLoading(true);
      const data = await loadOptions();
      setOptions(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("LazySelect Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, isLoading, loadOptions]);

  return (
    <div 
      onFocus={handleFetch} 
      onMouseDown={handleFetch}
      className="w-full"
    >
      <Select
        {...props}
        options={options}
        placeholder={isLoading ? "Loading data..." : placeholder}
      />
    </div>
  );
};

export default LazySelect;
