import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn, FieldError } from "react-hook-form";
import Label from "./Label";
import Input from "./input/InputField";
import FieldErrorMsg from "./input/FieldError";

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'value'> {
    label: string;
    register: UseFormRegisterReturn;
    error?: FieldError | any;
    required?: boolean;
    value?: string | number;
}

export function FormInput({
    label,
    register,
    error,
    required,
    className = "",
    ...inputProps
}: FormInputProps) {
    return (
        <div className={`w-full ${className}`}>
            <Label>
                {label} {required && <span className="text-error-500">*</span>}
            </Label>
            <Input
                {...register}
                {...inputProps}
                error={!!error}
            />
            <FieldErrorMsg msg={error?.message} />
        </div>
    );
}

export default FormInput;
