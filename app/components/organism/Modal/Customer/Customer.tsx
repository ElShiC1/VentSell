import { NSIcons } from "@/components/atoms/Icons/NSIcons"
import { InpuTypes } from "@/components/atoms/Input"
import { ModalLayout } from "@/components/template/Modal/ModalLayout"
import { NumberLenght, NumberVal } from "@/lib/utils/NumberVal"
import { VentSellDb } from "@/services/shared/VentSellDb"
import type { FormEvent } from "react"
import { Form } from "react-router"

export const Customer = ({ onclick }: { onclick: () => void }) => {

    const { form, setForm, error } = VentSellDb.Client.ClientMethods()
    const postForm = VentSellDb.Client.ClientMethods((val) => val.postForm)
    const updateForm = VentSellDb.Client.ClientMethods((val) => val.updateForm)
    const addClient = VentSellDb.Client.ClienGetMethods((val) => val.addClient)


    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            console.log('paso o no')
            if (!error.success) return;
            if (form.id) {
                const data = await updateForm()
                addClient(data)
                return;
            }

            const data = await postForm()
            addClient(data)
            return;
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ModalLayout className="w-5/32 h-auto p-6 flex flex-col gap-3 relative justify-center items-center">
            <Form className="flex flex-col gap-4" onSubmit={submit}>
                <InpuTypes.InputSelect readOnly data={{ CE: undefined, DNI: undefined }} label="Tipo de Documento" value={form.tipoID ?? ""} error={!error.success ? error.data.tipoID : undefined} placeholder="Selecionar documento" id="tipoID" onClick={(val) => setForm({ tipoID: val as any })} onChange={setForm} />
                <InpuTypes.text id="dni" label="DNI o CE" placeholder="12345678" onChange={(e) => NumberLenght('', e, 15, setForm)} value={`${form?.dni || ''}`} error={!error.success ? error.data.dni : undefined} type="text" autoComplete="false" />
                <InpuTypes.text id="fullname" label="Cliente" placeholder="VentSell" onChange={setForm} value={`${form?.fullname || ''}`} error={!error.success ? error.data.fullname : undefined} type="text" autoComplete="false" />
                <InpuTypes.text id="phone" label="Celular" placeholder="+51 900000000" onChange={(e) => NumberLenght('', e, 15, setForm)} value={`${form?.phone || ''}`} error={!error.success ? error.data.phone : undefined} type="text" autoComplete="false" />
                <InpuTypes.buttonModal disabled={!error.success} className={`w-40 mt-2`} value={form.id ? "Editar Cliente" : "Crear Cliente"} icon={form.id ? <NSIcons.Edit className="" /> : <NSIcons.Add className="" />} />
            </Form>
            <div className="absolute right-2 size-5 bg-blue-500 text-white text-center flex items-center justify-center rounded-full p-3 text-sm cursor-pointer top-2" onClick={onclick} >X</div>
        </ModalLayout>
    )
}