import { NSIcons } from "@/components/atoms/Icons/NSIcons";
import { InpuTypes } from "@/components/atoms/Input";
import { AlerMessage } from "@/components/molecules/alertMessage/AlertMessage";
import { DataCell } from "@/components/molecules/Table/DataCell";
import { THeadClick } from "@/components/molecules/Table/THeadClick";
import { ModalProduct } from "@/components/organism/Modal/Product/Product";
import { Table } from "@/components/organism/table/Table";
import { TableBody } from "@/components/organism/table/TableBody";
import { TableHeader } from "@/components/organism/table/TableHeader";
import { HeadFilter, TPDashboard } from "@/components/template/Dashboard";
import { formatDate } from "@/lib/utils/DateFormat";
import { VentSellDb } from "@/services/shared/VentSellDb";
import { useEffect } from "react";
import type { Route } from "../+types/Layout";
import { useNavigate } from "react-router";
import { InputSelect } from "@/components/molecules/InputSelect/InputSelect";


export function meta() {
    return [
        { title: "VentSell - Productos & Dashboard" }
    ];
}


export async function loader({ request }: Route.LoaderArgs) {
    const data = new URL(request.url).searchParams
    const page = Number(data.get('page'))
    const id = Number(data.get('id'))

    console.log(id, page, ' que hay aqui')
    return { page, id };
}

type LoaderData = {
    page?: number;
    id?: number;
};

export default function Products({ loaderData }: { loaderData: LoaderData }) {
    const request = VentSellDb.Product.ProductMethods((state) => state.request)
    const open = VentSellDb.Product.ProductMethods((state) => state.open);
    const setOpen = VentSellDb.Product.ProductMethods((state) => state.openModal);
    const products = VentSellDb.Product.ProductGetMethods((state) => state.products);
    const filter = VentSellDb.Product.ProductGetMethods((state) => state.filter);
    const getProducts = VentSellDb.Product.ProductGetMethods((state) => state.getProducts);
    const getProductsInitial = VentSellDb.Product.ProductGetMethods((state) => state.getProductsInitial);
    const cursor = VentSellDb.Product.ProductGetMethods((state) => state.cursor);
    const getProducto = VentSellDb.Product.ProductMethods((state) => state.getProducto)
    const deleteProducto = VentSellDb.Product.ProductMethods((state) => state.deleteProducto)
    const changeState = VentSellDb.Product.ProductMethods((state) => state.changeState)
    const addProduct = VentSellDb.Product.ProductGetMethods((state) => state.addProduct)
    const getCategory = VentSellDb.Product.ProductGetMethods((state) => state.getCategory)
    const category = VentSellDb.Product.ProductGetMethods((state) => state.selects.category)
    const nav = useNavigate()

    useEffect(() => {
        const pagination = loaderData.page || 1;
        const id = loaderData.id;
        if (id) {
            getProducto(id).then((data) => {
                if (data) {
                    setOpen(true);
                } else {
                    setOpen(false);
                }
            })
        }
        setOpen(false);
        getProducts({ page: pagination as number || 1 });
        getProductsInitial({ page: pagination as number || 1 })
        getCategory();
    }, [loaderData])

    return (
        <TPDashboard title="Productos">
            <HeadFilter filterMain={
                <>
                    <InpuTypes.InputSelect
                        data={category}
                        label="Categoria"
                        value={filter?.search?.category ?? ""}
                        placeholder="Categoria"
                        id="selectCategory"
                        readOnly
                        onClick={(val) => {
                            const methods = { page: loaderData.page as number || 1, filter: { search: { category: val } } }
                            getProducts(methods)
                            getProductsInitial(methods)
                        }}
                    />
                    <InpuTypes.text type="text" label="Producto" placeholder="Zapatillas" autoComplete="off" id="name" onChange={(e) => {
                        const methods = { page: loaderData.page as number || 1, filter: { search: e } }
                        getProducts(methods)
                        getProductsInitial(methods)
                    }} />
                </>
            } ButtonModal={
                <InpuTypes.buttonModal value="Crear Producto" icon={<NSIcons.Add className="" />} click={() => setOpen(true)} />
            } />
            <Table limit={cursor?.limit ?? 1} currentPage={loaderData.page as number || 1}>
                <TableHeader>
                    <th className="w-3/30 p-2"></th>
                    <THeadClick initialDirection={filter!.orderBy!.id ?? undefined} onClick={(val) => getProducts({ page: loaderData.page as number || 1, filter: { orderBy: { id: val } } })} text="ID" className="w-3/30 p-2" />
                    <th className="w-8/30 p-2">Producto</th>
                    <th className="w-5/30 p-2">Categoría</th>
                    <THeadClick initialDirection={filter!.orderBy!.cost ?? undefined} text="Compra" className="w-5/30 p-2" onClick={(val) => getProducts({ page: loaderData.page as number || 1, filter: { orderBy: { cost: val } } })} />
                    <THeadClick initialDirection={filter!.orderBy!.salePrice ?? undefined} text="Venta" className="w-5/30 p-2" onClick={(val) => getProducts({ page: loaderData.page as number || 1, filter: { orderBy: { salePrice: val } } })} />
                    <THeadClick initialDirection={filter!.orderBy!.quantity ?? undefined} text="Stock" className="w-5/30 p-2" onClick={(val) => getProducts({ page: loaderData.page as number || 1, filter: { orderBy: { quantity: val } } })} />
                    <THeadClick initialDirection={filter!.orderBy!.quantitySold ?? undefined} onClick={(val) => getProducts({ page: loaderData.page as number || 1, filter: { orderBy: { quantitySold: val } } })} text="Vendidos" className="w-5/30 p-2" />
                    <THeadClick initialDirection={filter!.orderBy!.totalCost ?? undefined} onClick={(val) => getProducts({ page: loaderData.page as number || 1, filter: { orderBy: { totalCost: val } } })} text="Total Stock" className="w-5/30 p-2" />
                    <THeadClick initialDirection={filter!.orderBy!.totalSold ?? undefined} onClick={(val) => getProducts({ page: loaderData.page as number || 1, filter: { orderBy: { totalSold: val } } })} text="Total Vendido" className="w-5/30 p-2" />
                    <THeadClick initialDirection={filter!.orderBy!.createAt ?? undefined} onClick={(val) => getProducts({ page: loaderData.page as number || 1, filter: { orderBy: { createAt: val } } })} text="Creado" className="w-5/30 p-2" />
                    <THeadClick initialDirection={filter!.orderBy!.updateAt ?? undefined} onClick={(val) => getProducts({ page: loaderData.page as number || 1, filter: { orderBy: { updateAt: val } } })} text="Editado" className="w-5/30 p-2" />
                    <th className="w-5/30 p-2">Estado</th>
                    <th className="w-1/30 p-2"></th>
                </TableHeader>
                <TableBody>
                    {products.map((product, i) => (
                        <tr key={i} className="border-b-1 border-gray-300 h-7 hover:bg-gray-100 transition-all select-none">
                            <td className="p-2">
                                {product.imgThumb && <img src={product.imgThumb as string} alt={product.name} className="w-9 h-9 object-cover rounded" />}
                            </td>
                            <DataCell.Value value={product.id} />
                            <DataCell.Value value={product.name} />
                            <DataCell.Value value={product.category} />
                            <DataCell.Value value={product.cost!.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })} />
                            <DataCell.Value value={product.salePrice ? product.salePrice.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' }) : 0} />
                            <DataCell.Value value={product.quantity} />
                            <DataCell.Value value={product.quantitySold} />
                            <DataCell.Value value={product.totalCost.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })} />
                            <DataCell.Value value={product.totalSold.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })} />
                            <DataCell.Value value={formatDate(product.createAt, 'Creado')} />
                            <DataCell.Value value={formatDate(product.updateAt === product.createAt ? undefined : product.updateAt, 'Actualizado')} />
                            <DataCell.Options status={product.status} options={[{
                                color: 'red', value: "Inactivo", onclick: async () => {
                                    const result = await changeState(product.id, 'Inactivo')
                                    addProduct(result!)
                                }
                            }, {
                                color: 'green', value: 'Activo', onclick: async () => {
                                    const result = await changeState(product.id, 'Activo')
                                    addProduct(result!)
                                }
                            }]} />
                            <DataCell.Options options={[{
                                color: 'blue', value: "Editar", onclick: () => {
                                    getProducto(product.id)
                                    window.history.replaceState(null, '', `/Productos?id=${product.id}&page=${loaderData.page || 1}`);
                                    setOpen(true);
                                }
                            }, {
                                color: 'red', value: 'Eliminar', onclick: async () => {
                                    await deleteProducto(product.id)
                                    getProducts({ page: loaderData.page as number || 1 });
                                    getProductsInitial({ page: loaderData.page as number || 1 });
                                }
                            }]} />
                        </tr>
                    ))}
                </TableBody>
            </Table>
            {open && <ModalProduct OnClick={() => {
                setOpen(false)
                window.history.replaceState(null, '', `/Productos`);
            }} id={loaderData.id} />}
            {request.message !== undefined && <AlerMessage type={request.message.type} message={request.message.text} animation={request.message.animation} />}
        </TPDashboard>
    )
}



