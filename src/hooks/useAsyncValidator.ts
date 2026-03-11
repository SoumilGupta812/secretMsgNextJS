import { useState, useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";

type ValidatorResult = {
  message: string;
};

type ValidatorFn = (value: string) => Promise<ValidatorResult>;

export function useAsyncValidator(
  validatorFn: ValidatorFn,
  debounceTime: number = 500,
) {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const debounced = useDebounceCallback(setValue, debounceTime);

  useEffect(() => {
    if (!value) return;

    let cancelled = false;

    async function validate() {
      setIsChecking(true);
      setMessage("");

      try {
        const result = await validatorFn(value);

        if (!cancelled) {
          setMessage(result.message);
        }
      } catch {
        if (!cancelled) {
          setMessage("Validation failed");
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    }

    validate();

    return () => {
      cancelled = true;
    };
  }, [value, validatorFn]);

  return {
    value,
    setValue,
    debounced,
    message,
    isChecking,
    setMessage,
  };
}
