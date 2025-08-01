import type React from "react"
import { useRef, useState, useTransition } from "react"

interface TypesInput {
    text: (props: { disabled?: boolean, onChange?: (value: { [key: string]: string }) => void, error?: string | undefined, label: string, id: string, placeholder: string, type: 'text' | 'password' | 'email', autoComplete: React.HTMLInputAutoCompleteAttribute, className?: string, value?: string }) => React.JSX.Element
    file: (props: { name: string, ref: React.Ref<HTMLInputElement>, onChange: (value: FileList) => void }) => React.JSX.Element
    buttonModal: (props: { value: string, icon?: React.ReactNode, click?: () => void, className?: string, disabled?: boolean }) => React.JSX.Element
    InputSelect: (props: { className?: string, children?: React.ReactNode, readOnly?: boolean, onChange?: (value: any) => void, error?: string | undefined, label: string, id: string, placeholder: string, block?: boolean, unlock?: () => void, data?: Record<string, any>, onClick?: (value: string, realValue?: any) => void; value: string }) => React.JSX.Element
    textTarea: (props: { id: string, placeholder: string, value: string, error?: string | undefined, onChange?: (value: any) => void }) => React.JSX.Element
}

export const InpuTypes: TypesInput = {
    text: ({ label, id, placeholder, type, autoComplete, className, value, onChange, error, disabled }) => {
        return (
            <div className={`flex flex-col gap-2 w-full ${className} relative`}>
                <label htmlFor={id} className="text-sm font-medium w-full">{label}</label>
                <input
                    disabled={disabled}
                    onInput={(e) => onChange?.({ [id]: e.currentTarget.value })}
                    onBlur={(e) => onChange?.({ [id]: e.currentTarget.value })} // Captura cambios al perder el foco
                    onCompositionEnd={(e) => onChange?.({ [id]: e.currentTarget.value })} // Para capturar métodos de entrada IME
                    onChange={(e) => onChange?.({ [id]: e.currentTarget.value })}
                    value={value}
                    defaultValue={value}
                    type={type}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    className={"p-2.5 text-sm border border-gray-300 w-full rounded-lg   focus:outline-blue-500 text-gray-800 focus:text-gray-900 placeholder-gray-500" + (disabled ? ' cursor-not-allowed bg-gray-200' : ' focus:bg-white bg-white')}
                />
                {error && <span className="text-xs absolute top-full ml-2 mt-[1.5px] text-red-500 text-nowrap">{error}</span>}
            </div>
        )
    },
    textTarea: ({ placeholder, value, id, error, onChange }) => (
        <>
            <textarea onChange={(e) => onChange?.({ [id]: e.currentTarget.value })} placeholder={placeholder} id={id} value={value} className="resize-none h-full p-2.5 text-sm border border-gray-300 w-full rounded-lg bg-white focus:bg-white  focus:outline-blue-500 text-gray-800 focus:text-gray-900 placeholder-gray-500">
            </textarea>
            {error && <span className="text-xs absolute top-full ml-2 mt-[1.5px] text-red-500 text-nowrap">{error}</span>}
        </>

    ),
    file: ({ name, ref, onChange }) => {

        const files = (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.currentTarget.files

            if (files && files.length > 0) {
                onChange(files);
            }

            return
        }

        return (
            <input className="hidden" type="file" ref={ref} accept="image/png, image/jpeg" name={name} onChange={files} />
        )
    },
    buttonModal: ({ value, icon, click, className, disabled }) => (
        <button disabled={disabled} onClick={click} className={`${disabled ? "cursor-not-allowed bg-gray-400" : "cursor-pointer bg-blue-500  border border-blue-500"} ${className ? className : 'w-38 h-13'} p-2 text-sm rounded-xl text-white font-semibold shadow-xs flex items-center gap-2 justify-center`}>
            {icon && <span>{icon}</span>}
            {value}
        </button>
    ),
    InputSelect: ({ label, placeholder, id, block, data, onClick, value, readOnly, onChange, error, children, className }) => {

        const [active, setActive] = useState(false)
        const valueInput = useRef<HTMLInputElement>(null)

        const test = () => {
            setActive(true)
        }

        const tetFal = () => {
            setActive(false)
        }

        const valueClick = (e: React.MouseEvent, value: string, val: any) => {
            valueInput.current!.value = value
            setActive(false)
            onClick?.(value, val)
        }

        return (
            <div className={`flex flex-col gap-2 relative w-full ${className} `}>
                <label htmlFor={id} className="text-sm font-medium w-full">{label}</label>
                <input
                    disabled={block}
                    readOnly={readOnly}
                    value={value || ""}
                    type="text"
                    onFocus={test}
                    onBlur={tetFal}
                    onChange={(e) => {
                        if (readOnly) return;
                        onChange?.({ [id]: e.currentTarget.value })
                    }}
                    id={id}
                    name={id}
                    ref={valueInput}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={`${block && 'cursor-not-allowed'} w-full p-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:bg-white  focus:outline-blue-500 text-gray-800 focus:text-gray-900 placeholder-gray-500`}
                />
                {active &&
                    <div onMouseDown={(e) => e.preventDefault()}
                        className=' absolute top-full mt-1 w-full z-50 max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-1
                            [&::-webkit-scrollbar-track]:bg-gray-100
                            [&::-webkit-scrollbar-thumb]:bg-gray-300
                            bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden'
                        role="listbox"
                    >
                        {!children && data && Object.entries(data).map(([key, val], index) => (
                            <div key={index} onClick={(e) => valueClick(e, key, val)} className="flex flex-col cursor-pointer select-none hover:bg-gray-100 transition-colors">
                                <span className="text-sm p-2">{key}</span>
                            </div>
                        ))}
                        {children && children}
                        {data && Object.entries(data).length <= 0 && <div className="flex flex-col  select-none">
                            <span className="text-sm p-2">+ Agregar valor</span>
                        </div>}
                    </div>
                }
                {error && <span className="text-xs absolute top-full ml-2 mt-[1.5px] text-red-500 text-nowrap">{error}</span>}
            </div>
        )
    }

}

