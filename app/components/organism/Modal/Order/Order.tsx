import { NSIcons } from "@/components/atoms/Icons/NSIcons"
import { InpuTypes } from "@/components/atoms/Input"
import { InputClients } from "@/components/molecules/InputSelect/InputClient"
import { InputProducts } from "@/components/molecules/InputSelect/InputProducts"
import { InputSelect } from "@/components/molecules/InputSelect/InputSelect"
import { ModalLayout } from "@/components/template/Modal/ModalLayout"
import { NumberVal } from "@/lib/utils/NumberVal"
import { VentSellDb } from "@/services/shared/VentSellDb"
import { useEffect } from "react"
import { Form } from "react-router"

export const ModalOrder = ({ OnClose }: { OnClose: () => void }) => {
    const getCategory = VentSellDb.Product.ProductGetMethods((state) => state.getCategory)
    const category = VentSellDb.Product.ProductGetMethods((state) => state.selects.category)
    const filter = VentSellDb.Product.ProductGetMethods((state) => state.filter);
    const getProducts = VentSellDb.Product.ProductGetMethods((state) => state.getProducts);
    const products = VentSellDb.Product.ProductGetMethods((state) => state.products);
    const addItems = VentSellDb.Order.OrderMethods((state) => state.orderItemsMethods.addItems);
    const deleteItem = VentSellDb.Order.OrderMethods((state) => state.orderItemsMethods.deleteItem);
    const orderItems = VentSellDb.Order.OrderMethods((state) => state.form.orderItems);
    const totalItems = VentSellDb.Order.OrderMethods((state) => state.form.total);
    const setform = VentSellDb.Order.OrderMethods((state) => state.orderItemsMethods.setForm);
    const postForm = VentSellDb.Order.OrderMethods((state) => state.postForm);
    const error = VentSellDb.Order.OrderMethods((state) => state.error)
    const updateForm = VentSellDb.Order.OrderMethods((state) => state.updateForm)
    const { data } = VentSellDb.Order.OrderMethods((state) => state.form)
    const addOrder = VentSellDb.Order.OrderGetMethods((state) => state.addOrder)
    

    useEffect(() => {
        getCategory()
        getProducts({ page: 1 })
    }, [])

    const submit = async () => {
        if (data?.id) {
            const result = await updateForm()
            await addOrder(result)

            return;
        }
        const result = await postForm()
        await addOrder(result)
        return;
    }

    return (
        <ModalLayout className="w-9/12 h-5/6">
            <Form method="get" className=" flex w-full" onSubmit={(e) => e.preventDefault()}>
                <div className="w-5/10 h-full bg-white-500 p-5 flex flex-col gap-5">
                    {/*Cliente Form*/}
                    <div id="Cliente" className="flex flex-col gap-2">
                        <h3 className="font-semibold text-blue-600 text-lg">Cliente</h3>
                        <div className="flex gap-3">
                            <InputClients idPost={data?.id} id={data?.idCl} error={!error.success && error.data.order?.idCl} className="flex-5/6 [&>label:first-of-type]:text-black" valueKey={(id) => setform({ idCl: Number(id) })}></InputClients>
                            <InpuTypes.text error={!error.success ? error.data.order?.payment : undefined} value={`${data?.payment || ""}`} type="text" label="Metodo de Pago" className="flex-2/6" placeholder="Plin" autoComplete="off" id="payment" onChange={setform} />
                            <InpuTypes.text error={!error.success ? error.data.order?.igv as any : undefined} onChange={(e) => NumberVal('%', e, setform)} value={`${data?.igv || 0}%`} type="text" label="IGV" className="flex-2/6" placeholder="DHL" autoComplete="off" id="igv" />
                        </div>
                    </div>
                    {/*Envio Form*/}
                    <div id="Envio" className="flex flex-col gap-2">
                        <h4 className="font-semibold text-blue-600 text-l">Envio Domicilio (Opcional)</h4>
                        <div className="flex gap-3 flex-col">
                            <div id="Region" className="flex gap-3">
                                <InputSelect.Country setVal={(val) => setform({ ubigeoCode: val })} code={data?.ubigeoCode} />
                            </div>
                            <div className="flex gap-3">
                                <InpuTypes.text error={!error.success ? error.data.order?.courier : undefined} onChange={setform} type="text" value={`${data?.courier || ''}`} label="Agencia" className="flex-2/6" placeholder="DHL" autoComplete="off" id="courier" />
                                <InpuTypes.text error={!error.success ? error.data.order?.shipPrice as any : undefined} onChange={(e) => NumberVal('S/', e, setform)} type="text" value={`S/${data?.shipPrice || 0}`} label="Precio de envio" className="flex-2/6" placeholder="S/0" autoComplete="off" id="shipPrice" />
                                <InpuTypes.text error={!error.success ? error.data.order?.address : undefined} onChange={setform} type="text" value={`${data?.address || ''}`} label="Direccion de Domicilio" placeholder="Jr ejemplo 1234" autoComplete="off" id="address" />
                            </div>

                        </div>
                    </div>
                    <div id="Nota" className="flex flex-col gap-2 h-full">
                        <h4 className="font-semibold text-blue-600 text-l">Nota (Opcional)</h4>
                        <div className="flex gap-3 flex-col h-full">
                            <InpuTypes.textTarea onChange={setform} id="note" value={data?.note ?? ""} placeholder="Informacion...." />
                        </div>
                    </div>
                    <InpuTypes.buttonModal disabled={!error.success} className={`w-40 mt-2`} value={data?.id ? "Editar Cliente" : "Crear Orden"} icon={data?.id ? <NSIcons.Edit className="" /> : <NSIcons.Add className="" />} click={() => submit()} />
                </div>
                <div className="w-5/10 h-full bg-blue-500 p-5 flex flex-col gap-3 relative">
                    <div className="absolute right-5 size-5 bg-white text-center flex items-center justify-center rounded-full p-3 text-sm cursor-pointer" onClick={OnClose}>X</div>
                    <div id="Header" className="flex flex-col gap-2 ">
                        <h3 className="font-semibold text-white text-lg">Productos</h3>
                        <div className="flex gap-3">
                            <InpuTypes.InputSelect
                                className="[&>label:first-of-type]:text-white flex-1/6"
                                data={category}
                                label="Categoria"
                                value={filter?.search?.category ?? ""}
                                placeholder="Categoria"
                                id="selectCategory"
                                readOnly
                                onClick={(val) => {
                                    const methods = { page: 1, filter: { search: { category: val } } }
                                    getProducts(methods)
                                }}
                            />
                            <InputProducts addItem={addItems} className="flex-4/6 [&>label:first-of-type]:text-white" products={products}></InputProducts>
                        </div>
                    </div>
                    <div id="DetailOrden" className="flex flex-col gap-2 overflow-y-auto h-full
                                    [&::-webkit-scrollbar]:w-0
                                    [&::-webkit-scrollbar-track]:bg-gray-100
                                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                                    [&::-webkit-scrollbar-thumb]:rounded-full">
                        {
                            orderItems && orderItems.length > 0 && orderItems.map((val) => {
                                return (
                                    <div key={val?.idProduct} className="px-4 py-4 bg-white rounded-lg shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow hover:z-30 hover:bg-gray-100">
                                        {/* Imagen del producto */}
                                        {val.imgThumb && <img
                                            src={val.imgThumb as string}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                                            alt="Zapatillas Fuego"
                                        />}

                                        {/* Detalles del producto */}
                                        <div className="flex flex-col min-w-[120px] flex-1">
                                            <span className="text-sm font-medium text-gray-900 truncate">{val.name}</span>
                                            {val.category && <span className="text-sm text-gray-500 truncate">Categoria: {val.category}</span>}
                                            <span className="text-sm text-gray-500 truncate">Stock: {val.quantityID}</span>
                                            <span className="text-base font-semibold text-gray-900 mt-1 truncate">{val.salePrice.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })}</span>
                                        </div>

                                        {/* Selector de cantidad */}
                                        <div className="flex items-center gap-2 mx-4">
                                            <button onClick={() => addItems({ idProduct: val.idProduct, quantity: val.quantity - 1, salePrice: val.salePrice })} className="cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center transition-colors">
                                                -
                                            </button>
                                            <span className="text-sm w-6 text-center">{val.quantity}</span>
                                            <button onClick={() => addItems({ idProduct: val.idProduct, quantity: val.quantity + 1, salePrice: val.salePrice })} className=" cursor-pointer bg-blue-500 text-white hover:bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center transition-colors">
                                                +
                                            </button>
                                        </div>

                                        {/* Precio total */}
                                        <div className="flex flex-col items-end min-w-[100px] ml-auto">
                                            <span className="text-xs text-gray-500">Subtotal</span>
                                            <span className="text-lg font-bold text-gray-900 truncate">{val.subtotal.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })}</span>
                                        </div>

                                        {/* Botón de eliminar */}
                                        <button className="ml-4 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors cursor-pointer" onClick={() => deleteItem(val.idProduct)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )
                            })

                        }

                    </div>
                    <div id="mountTotal" className="bg-white shadow-lg w-full h-auto rounded-xl border border-blue-300 px-4 py-3 flex justify-between items-center">
                        {/* Columna izquierda - Detalles */}
                        <div className="flex flex-col gap-2">
                            {/* Línea de envío */}
                            <div className="flex flex-col">
                                <span className="text-blue-400 text-sm font-medium">Envío</span>
                                <span className="text-blue-700 font-semibold text-sm">
                                    {(totalItems?.ship || 0).toLocaleString('es-PE', {
                                        style: 'currency',
                                        currency: 'PEN',
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </span>
                            </div>

                            {/* Línea de productos */}
                            <div className="flex flex-col">
                                <span className="text-blue-400 text-sm font-medium">Total Productos</span>
                                <span className="text-blue-700 font-semibold text-sm">
                                    {totalItems?.quantityProducts || 0}
                                </span>
                            </div>
                        </div>

                        {/* Separador vertical */}
                        <div className="h-12 w-px bg-blue-200 mx-2"></div>

                        {/* Columna derecha - Totales */}
                        <div className="flex flex-col items-end gap-2">
                            {/* Línea de IGV */}
                            <div className="flex flex-col items-end text-xs">
                                <span className="text-blue-500 font-extrabold">IGV ({data?.igv}%)</span>
                                <span className="text-blue-600 font-extrabold text-sm">
                                    {(totalItems?.totalCost || 0).toLocaleString('es-PE', {
                                        style: 'currency',
                                        currency: 'PEN',
                                        minimumFractionDigits: 2
                                    })}
                                </span>
                            </div>

                            {/* Línea de Total */}
                            <div className="flex flex-col items-end">
                                <span className="text-blue-500 text-sm font-extrabold">Monto Total</span>
                                <span className="text-blue-600 font-extrabold text-xl">
                                    {(totalItems?.totalSell || 0).toLocaleString('es-PE', {
                                        style: 'currency',
                                        currency: 'PEN',
                                        minimumFractionDigits: 2
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </ModalLayout>
    )
}