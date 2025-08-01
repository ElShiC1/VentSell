import { NSIcons } from "@/components/atoms/Icons/NSIcons"
import { InpuTypes } from "@/components/atoms/Input"
import { MountPrice } from "@/components/molecules/changeValues/Mount"
import { InputImage } from "@/components/molecules/InputFile/InputImage"
import { InputSelect } from "@/components/molecules/InputSelect/InputSelect"
import { ModalLayout } from "@/components/template/Modal/ModalLayout"
import { NumberVal } from "@/lib/utils/NumberVal"
import { VentSellDb } from "@/services/shared/VentSellDb"
import { useEffect, useState } from "react"
import { Form } from "react-router"

export const ModalProduct = ({ OnClick, id }: { OnClick: () => void, id?: number }) => {

    const { setForm, form, postForm, error, updateForm } = VentSellDb.Product.ProductMethods()
    const addProduct = VentSellDb.Product.ProductGetMethods((state) => state.addProduct)
    const Category = VentSellDb.Product.ProductGetMethods((state) => state.selects.category)
    const getCategory = VentSellDb.Product.ProductGetMethods((state) => state.getCategory)

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (form.id) {
            const data = await updateForm()
            if (!data) return;
            addProduct(data);
            return;
        }
        const data = await postForm();
        if (!data) return;
        getCategory()
        addProduct(data);
    }

    return (
        <ModalLayout className="w-5/12 h-auto p-7 flex flex-col gap-3 relative">
            <Form className="gap-3 flex flex-col w-full h-full" onSubmit={submitForm}>
                <h3 className="font-semibold text-blue-600 text-lg">Detalles Producto</h3>
                <div id="productImg" className="h-50 w-full flex gap-5">
                    <InputImage className="w-80 h-full rounded-2xl" imgVal={form.img as string} file={(e) => setForm({ img: e })} />
                    <div className="flex flex-col gap-3 w-full h-full">
                        <div className="flex gap-5">
                            <InpuTypes.text onChange={setForm} label="Nombre" id="name" value={`${form.name ?? ""}`} placeholder="El Zapato" type="text" autoComplete="false" error={!error.success ? error.data.name : undefined} />
                            <InpuTypes.InputSelect data={Category} label="Categoria" value={form.category ?? ""} error={!error.success ? error.data.category : undefined} placeholder="Categoria" id="category" block={false} onClick={(val) => setForm({ category: val })} onChange={setForm} />
                        </div>
                        <div className="flex flex-col gap-2 h-full">
                            <label className="text-sm font-medium w-full">Descripcion</label>
                            <InpuTypes.textTarea value={form.description ?? ""} onChange={setForm} id="description" placeholder="Zapatos marrones iluminados." error={!error.success ? error.data.description : undefined} />
                        </div>
                    </div>
                </div>
                <div className="w-full h-full flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-blue-600 text-lg">Precio de Venta</h3>
                        <div className="flex gap-5">
                            <InpuTypes.text error={!error.success ? error.data.cost : undefined} onChange={(e) => NumberVal('S/', e, setForm)} value={`S/${form.cost || 0}`} id="cost" label="Costo" placeholder="El Zapato" type="text" autoComplete="false" />
                            <InpuTypes.text onChange={(e) => NumberVal('%', e, setForm)} value={`${form.margin || 0}%`} id="margin" label="Markup" placeholder="El Zapato" type="text" autoComplete="false" />
                            <InpuTypes.text error={!error.success ? error.data.salePrice : undefined} onChange={(e) => NumberVal('S/', e, setForm)} value={`S/${form.salePrice || 0}`} id="salePrice" label="Precio Venta" placeholder="El Zapato" type="text" autoComplete="false" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-blue-600 text-lg">Inventario</h3>
                        <div className="flex gap-5">
                            <InpuTypes.text error={!error.success ? error.data.quantity : undefined} label="Unidades" value={`${form.quantity || 0}`} onChange={(e) => NumberVal('', e, setForm)} id="quantity" placeholder="0" type="text" autoComplete="false" />
                            <InpuTypes.text disabled label="Costo Total" id="costotal" value={`S/${form.costotal || 0}`} placeholder="El Zapato" type="text" autoComplete="false" />
                            <InpuTypes.text disabled label="Ganancia Real" id="profitreal" value={`S/${form.profitreal || 0}`} placeholder="El Zapato" type="text" autoComplete="false" />
                            <InpuTypes.text disabled label="Ganancia Total" id="profittotal" value={`S/${form.profittotal || 0}`} placeholder="El Zapato" type="text" autoComplete="false" />
                        </div>
                    </div>
                </div>
                <InpuTypes.buttonModal disabled={!error.success} className={`w-40 mt-2`} value={form.id ? "Editar Producto" : "Crear Producto"} icon={!form.id ? <NSIcons.Add className="" /> : <NSIcons.Edit className="" />} />
                <div className="absolute right-2 size-5 bg-blue-500 text-white text-center flex items-center justify-center rounded-full p-3 text-sm cursor-pointer top-2" onClick={OnClick} >X</div>
            </Form>
        </ModalLayout>
    )
}