import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterBarProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export const FilterBar = ({ label = 'Filter', value, onChange, options }: FilterBarProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-[180px] bg-background">
      <SelectValue placeholder={label} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All</SelectItem>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);
