import { HTMLInputTypeAttribute, useRef, useState } from 'react';

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
                required
                aria-invalid={!!error}
                aria-errormessage={`${id}-error`}
            />
            <span id={`${id}-error`} className="hidden text-red-600 peer-aria-[invalid='true']:inline">
                {!!error ? error : 'no error'}
            </span>
        </div>
    );
}

interface DynamicBinaryInputFieldProps {
    id: [string, string];
    label: [string, string];
    type: [
        StrictExtract<HTMLInputTypeAttribute, 'text' | 'email' | 'password'>,
        StrictExtract<HTMLInputTypeAttribute, 'text' | 'email' | 'password'>,
    ];
    name: [string, string];
    placeholder: [string | undefined, string | undefined];
    error: [string | undefined, string | undefined];
}
export function DynamicBinaryInputField({ id, label, type, name, placeholder, error }: DynamicBinaryInputFieldProps) {
    const [active, setActive] = useState<0 | 1>(0);
    const inputRef = useRef<HTMLInputElement>(null!);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
                <label
                    htmlFor={id[0]}
                    className={`cursor-pointer text-lg ${active === 0 ? '' : 'text-zinc-400 hover:text-zinc-700'}`}
                    onClick={e => {
                        setActive(0);
                        inputRef.current.value = '';
                    }}
                >
                    {label[0]}
                </label>
                <span role="separator">•</span>
                <label
                    htmlFor={id[1]}
                    className={`cursor-pointer text-lg ${active === 1 ? '' : 'text-zinc-400 hover:text-zinc-700'}`}
                    onClick={e => {
                        setActive(1);
                        inputRef.current.value = '';
                    }}
                >
                    {label[1]}
                </label>
            </div>
            <input
                ref={inputRef}
                type={type[active]}
                id={id[active]}
                name={name[active]}
                className="peer rounded-md border border-gray-300 p-2"
                placeholder={placeholder?.[active]}
                required
                aria-invalid={!!error?.[active]}
                aria-errormessage={`${id[active]}-error`}
            />
            <span id={`${id[active]}-error`} className="hidden text-red-600 peer-aria-[invalid='true']:inline">
                {!!error?.[active] ? error[active] : 'no error'}
            </span>
        </div>
    );
}
