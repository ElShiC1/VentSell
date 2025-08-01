import { NSIcons } from "@/components/atoms/Icons/NSIcons"
import { InpuTypes } from "@/components/atoms/Input"
import { useEffect, useRef, useState } from "react"

export const InputImage = ({ className, file, imgVal }: { className: string, file: (e: File) => void, imgVal: string | File }) => {
    const input = useRef<HTMLInputElement>(null)
    const [img, setImg] = useState<string | null>(null)

    useEffect(() => {
        if (typeof imgVal === "string") {
            setImg(imgVal)
        }

        if (imgVal instanceof File) {
            setImg(URL.createObjectURL(imgVal))
        }


    }, [imgVal])

    const handleFileChange = (e: FileList) => {
        console.log(e, 'que hay aqui')
        if (e.length === 0) return;
        console.log(e, 'que hay pasa aqui')
        setImg(URL.createObjectURL(e[0]))
        file(e[0])
    }

    return (
        <div onClick={() => input.current?.click()} className={`${className} overflow-hidden border border-gray-300 flex flex-col align-center justify-center items-center gap-2 bg-gray-200 text-gray-500 cursor-pointer`}>
            {img && <img src={img} className="w-full h-full object-cover" />}
            {!img && <NSIcons.ImgDownload className="w-20 h-20" message="Upload Product" />}
            <InpuTypes.file name="logo" ref={input} onChange={handleFileChange} />
        </div>
    )
}