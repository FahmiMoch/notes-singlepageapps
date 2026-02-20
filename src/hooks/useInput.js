import { useState, useCallback } from "react";

export default function useInput(defaultValue = "", validator) {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(
    (e) => {
      const val = e.target.value;
      if (!validator || validator(val)) {
        setValue(val);
      }
    },
    [validator],
  );

  const reset = useCallback(() => setValue(defaultValue), [defaultValue]);

  return { value, onChange, reset, setValue };
}
