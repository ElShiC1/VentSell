import { InpuTypes } from "@/components/atoms/Input"
import { useEffect, useState } from "react"
import { Peru } from "@/services/data/Peru";
import { PeruGet } from "@/lib/helpers/PeruGet";



export const InputSelect = {
    Country: ({ setVal, code }: { setVal: (val: string) => void, code?: string }) => {

        const [selected, setSelected] = useState(() => {
            return PeruGet(code ?? "")
        });

        console.log(selected)


        useEffect(() => {
            if (selected.distrito !== "") {
                setVal?.(Peru[selected.departamento]?.[selected.provincia]?.[selected.distrito])
            }
        }, [selected])


        return (
            <>
                <InpuTypes.InputSelect data={Peru} label="Departamento" value={selected.departamento} placeholder="Lima" id="Deparment" block={false} onClick={(val) => setSelected((e) => ({ departamento: val, provincia: '', distrito: '' }))} />
                <InpuTypes.InputSelect data={Peru[selected.departamento]} block={selected.departamento.trim() === ''} value={selected.provincia} label="Provincia" placeholder="Lima" id="Province" onClick={(val) => setSelected((e) => ({ departamento: e.departamento, provincia: val, distrito: '' }))} />
                <InpuTypes.InputSelect data={Peru[selected.departamento]?.[selected.provincia]} block={selected.provincia.trim() === ''} value={selected.distrito} label="Distrito" placeholder="Miraflores" id="City" onClick={(val) => setSelected((e) => ({ departamento: e.departamento, provincia: e.provincia, distrito: val }))} />
            </>
        )
    },
    Category: ({ categorys }: { categorys: Record<string, number> }) => {

        const [selected, setSelected] = useState(null);


        const category = {}

        return (
            <InpuTypes.InputSelect data={category} label="Departamento" value={selected ?? ""} placeholder="Selecionar Categoria" id="idcategory" block={false} onClick={(val) => setSelected(val)} />
        )
    }
}


