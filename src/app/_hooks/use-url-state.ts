import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { useGlobalUrlState } from "./global-url-state";

export const useUrlStateReset = (...keys: string[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [, setIsGlobalPending] = useGlobalUrlState();

  const reset = () => {
    setIsGlobalPending?.(true);
    startTransition(() => {
      const newSearchParams = new URLSearchParams(searchParams);
      keys.forEach((key) => {
        newSearchParams.delete(key);
        newSearchParams.set(key, "");
      });
      router.push(`?${newSearchParams.toString()}`, {
        scroll: false,
      });
      setIsGlobalPending?.(false);
    });
  };

  return [reset, isPending] as const;
};

export const useUrlState = <T = string, R = string | string[] | undefined>({
  key,
  value,
  decode,
  encode = defaultEncoder,
}: {
  key: string;
  value: R;
  decode: (value: R) => T;
  encode?: (value: T, key: string, searchParams: URLSearchParams) => string;
}) => {
  const router = useRouter();
  const [optimisticValue, setOptimisticValue] = useOptimistic(decode(value));
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [, setIsGlobalPending] = useGlobalUrlState();

  const updateValue = (payload: T) => {
    setIsGlobalPending?.(true);

    startTransition(() => {
      setOptimisticValue(payload);
      router.push(
        `?${encode(payload, key, new URLSearchParams(searchParams))}`,
        {
          scroll: false,
        },
      );
      setIsGlobalPending?.(false);
    });
  };

  return [optimisticValue, updateValue, isPending] as const;
};

const getString = (val: unknown) => {
  if (typeof val === "string") {
    return val;
  } else {
    return JSON.stringify(val);
  }
};

const defaultEncoder = <T = string>(
  payload: T,
  key: string,
  searchParams: URLSearchParams,
) => {
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.delete(key);

  if (Array.isArray(payload)) {
    if (payload.length > 0) {
      payload.forEach((val) => newSearchParams.append(key, getString(val)));
    } else {
      newSearchParams.set(key, "");
    }
  } else {
    newSearchParams.set(key, getString(payload ?? ""));
  }

  return newSearchParams.toString();
};

export const stringDecoder = (val: string | string[] | undefined) =>
  (Array.isArray(val) ? val[0] : val) ?? "";

export const numberDecoder = (val: string | string[] | undefined) =>
  Number((Array.isArray(val) ? val[0] : val) ?? "");

export const booleanDecoder = (val: string | string[] | undefined) =>
  Boolean((Array.isArray(val) ? val[0] : val) ?? "");
