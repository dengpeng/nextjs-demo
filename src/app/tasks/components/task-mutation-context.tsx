"use client";

import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { taskMutation, type FormState } from "../actions";
import { useFormState } from "react-dom";
import {
  type SelectedTask,
  type TaskCategory,
  type TaskField,
  type TaskPriority,
  type TaskStatus,
} from "../schema";
import { toast } from "sonner";

type FormPayload = {
  id?: number;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: TaskPriority;
};

const initialFormData: FormPayload = {
  title: "",
  category: "feature",
  status: "todo",
  priority: "P1",
};

const TaskMutationContext = createContext<
  | {
      formState: FormState;
      formAction: (formData: FormData) => void;
      formErrors: Partial<Record<TaskField, string[] | undefined>> | undefined;
      payload: FormPayload;
      setPayload: Dispatch<SetStateAction<FormPayload>>;
      reset: () => void;
    }
  | undefined
>(undefined);

export default function TaskMutationProvider({
  children,
  task,
}: {
  children: React.ReactNode;
  task?: SelectedTask;
}) {
  const [formState, formAction] = useFormState<FormState, FormData>(
    taskMutation,
    {
      status: "pending",
      message: null,
    },
  );

  const [formPayload, setFormPayload] = useState<FormPayload>(
    task ?? initialFormData,
  );
  const [formErrors, setFormErrors] = useState(formState.errors);

  const reset = useCallback(() => {
    setFormPayload(task ?? initialFormData);
    setFormErrors(undefined);
  }, [task]);

  useEffect(() => {
    if (formState.status === "success") {
      toast.success(formState.message);
      reset();
    } else {
      setFormErrors(formState.errors);
    }

    return () => {
      setFormErrors(undefined);
    };
  }, [formState, reset]);

  return (
    <TaskMutationContext.Provider
      value={{
        formAction,
        formState,
        formErrors,
        payload: formPayload,
        setPayload: setFormPayload,
        reset,
      }}
    >
      {children}
    </TaskMutationContext.Provider>
  );
}

export function useTaskMutation() {
  const context = useContext(TaskMutationContext);
  if (!context) {
    throw new Error("useTaskDialog must be used within a TaskDialogProvider");
  }
  return context;
}
