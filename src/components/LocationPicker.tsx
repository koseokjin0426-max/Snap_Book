"use client";

import { LOCATION_CHIPS, LOCATION_CUSTOM } from "@/lib/constants";
import SelectField from "./SelectField";

interface LocationPickerProps {
  id?: string;
  location: string;
  isCustom: boolean;
  onChange: (location: string, isCustom: boolean) => void;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
}

const OPTIONS = [
  ...LOCATION_CHIPS.map((chip) => ({ value: chip, label: chip })),
  { value: LOCATION_CUSTOM, label: LOCATION_CUSTOM },
];

export default function LocationPicker({
  id,
  location,
  isCustom,
  onChange,
  ariaInvalid,
  ariaDescribedby,
}: LocationPickerProps) {
  const selectValue = isCustom ? LOCATION_CUSTOM : location;

  function handleSelect(next: string) {
    if (next === LOCATION_CUSTOM) {
      onChange("", true);
    } else {
      onChange(next, false);
    }
  }

  return (
    <div>
      <SelectField
        id={id}
        value={selectValue}
        onChange={handleSelect}
        options={OPTIONS}
        placeholder="장소를 선택해 주세요"
        ariaLabel="촬영 장소"
        ariaInvalid={ariaInvalid}
        ariaDescribedby={ariaDescribedby}
      />

      {isCustom && (
        <input
          type="text"
          autoFocus
          value={location}
          onChange={(e) => onChange(e.target.value, true)}
          placeholder="예: 을지로, 망원, 자택 등"
          className="text-input mt-3"
          aria-label="촬영 장소 직접 입력"
        />
      )}
    </div>
  );
}
