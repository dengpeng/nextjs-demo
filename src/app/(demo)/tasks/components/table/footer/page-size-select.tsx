"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_components/ui/select";
import { useUrlState } from "@/_hooks/use-url-state";

export default function PageSizeSelect({ pageSize }: { pageSize: number }) {
  const [optimisticValue, updateValue] = useUrlState<number, number>({
    key: "pageSize",
    value: pageSize,
    decode: (value) => value,
  });

  return (
    <Select
      value={`${optimisticValue}`}
      onValueChange={(value) => {
        updateValue(Number(value));
      }}
    >
      <SelectTrigger className="h-8 w-16">
        <SelectValue placeholder={optimisticValue} />
      </SelectTrigger>
      <SelectContent side="top">
        {[5, 10, 20, 30, 40, 50].map((p) => (
          <SelectItem key={p} value={`${p}`}>
            {p}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
