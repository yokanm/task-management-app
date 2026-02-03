import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseFormValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
}

interface FormErrors {
  [key: string]: string;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  onSubmit,
  mode = 'onChange',
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: string, value: any) => {
      try {
        const fieldSchema = (schema as any).shape[name];
        if (fieldSchema) {
          fieldSchema.parse(value);
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
          return null;
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0]?.message || 'Validation failed';
          setErrors((prev) => ({ ...prev, [name]: errorMessage }));
          return errorMessage;
        }
      }
      return null;
    },
    [schema]
  );

  const validateForm = useCallback(() => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
        return false;
      }
      return false;
    }
  }, [schema, values]);

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (mode === 'onChange' && touched[name]) {
        validateField(name, value);
      }
    },
    [mode, touched, validateField]
  );

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (mode === 'onBlur' || mode === 'onChange') {
        validateField(name, values[name]);
      }
    },
    [mode, values, validateField]
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(schema.shape).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate form
    const isValid = validateForm();

    if (isValid) {
      try {
        await onSubmit(values as T);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setIsSubmitting(false);
  }, [schema, values, validateForm, onSubmit]);

  const resetForm = useCallback(() => {
    setValues({});
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: string, error: string) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    validateField,
    validateForm,
  };
}
