import * as React from 'react';

interface SimpleNumberInputProps {
  value: number;
  onChange: (value: number) => void;
}

const NumberInputIntroduction: React.FC<SimpleNumberInputProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    onChange(newValue);
  };

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      style={{
        fontSize: '16px',
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        width: '100%',
      }}
    />
  );
};

export default NumberInputIntroduction;
