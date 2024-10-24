import React, { HTMLInputTypeAttribute } from 'react';

type StrictExtract<T, U extends T> = Extract<T, U>;

interface InputFieldProps {
    id: string;
    label: string;
    type: StrictExtract<HTMLInputTypeAttribute, 'text' | 'email' | 'password'>;
    name: string;
    placeholder?: string;
    error?: string;
}

export function InputField({ id, label, type, name, placeholder, error }: InputFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-lg">
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={name}
                className="peer rounded-md border border-gray-300 p-2"
                placeholder={placeholder}
                aria-invalid={!!error}
                aria-errormessage={`${id}-error`}
            />
            <span id={`${id}-error`} className="hidden text-red-600 peer-aria-[invalid='true']:inline">
                {!!error ? error : 'no error'}
            </span>
        </div>
    );
}
