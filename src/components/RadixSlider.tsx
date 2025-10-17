import * as Slider from '@radix-ui/react-slider';
import * as React from 'react';
import './RadixSlider.css';

interface RadixSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
}

const RadixSlider: React.FC<RadixSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
}) => {
  return (
    <div className="radix-slider-wrapper">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xl font-bold text-violet-600">{value}</span>
      </div>
      <Slider.Root
        className="RadixSliderRoot"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([val]) => onChange(val)}
        aria-label={label}
      >
        <Slider.Track className="RadixSliderTrack">
          <Slider.Range className="RadixSliderRange" />
        </Slider.Track>
        <Slider.Thumb className="RadixSliderThumb" />
      </Slider.Root>
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default RadixSlider;
