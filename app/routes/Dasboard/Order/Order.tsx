import { NSIcons } from "@/components/atoms/Icons/NSIcons";
import { InpuTypes } from "@/components/atoms/Input";
import { InputSelect } from "@/components/molecules/InputSelect/InputSelect";
import { THeadClick } from "@/components/molecules/Table/THeadClick";
import { ModalOrder } from "@/components/organism/Modal/Order/Order";
import { Table } from "@/components/organism/table/Table";
import { TableBody } from "@/components/organism/table/TableBody";
import { TableHeader } from "@/components/organism/table/TableHeader";
import { HeadFilter, TPDashboard } from "@/components/template/Dashboard"
import { useEffect, useState } from "react";
import type { Route } from "../+types/Layout";
import { VentSellDb } from "@/services/shared/VentSellDb";
import { AlerMessage } from "@/components/molecules/alertMessage/AlertMessage";
import { DataCell } from "@/components/molecules/Table/DataCell";
import { PeruGet } from "@/lib/helpers/PeruGet";
import { formatDate } from "@/lib/utils/DateFormat";
export function meta() {
    return [
        { title: "VentSell - Ordenes & Dashboard" }
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

export default function Order({ loaderData }: { loaderData: LoaderData }) {
    const getOrder = VentSellDb.Order.OrderMethods((state) => state.getOrder)
    const changeState = VentSellDb.Order.OrderMethods((state) => state.changeState)
    const open = VentSellDb.Order.OrderMethods((state) => state.open)
    const openModal = VentSellDb.Order.OrderMethods((state) => state.openModal)
    const request = VentSellDb.Order.OrderMethods((state) => state.request)
    const orders = VentSellDb.Order.OrderGetMethods((state) => state.orders)
    const cursor = VentSellDb.Order.OrderGetMethods((state) => state.cursor)
    const filter = VentSellDb.Order.OrderGetMethods((state) => state.filter)
    const getOrderAll = VentSellDb.Order.OrderGetMethods((state) => state.getOrders)
    const addOrder = VentSellDb.Order.OrderGetMethods((state) => state.addOrder)
    const getOrderInitial = VentSellDb.Order.OrderGetMethods((state) => state.getOrderInitial)

    useEffect(() => {
        const pagination = loaderData.page || 1

        if (loaderData.id) {
            getOrder(loaderData.id).then((data) => {
                if (data) {
                    openModal(true)
                }
            })
        }
        getOrderAll({ page: pagination })
        getOrderInitial({ page: pagination })
    }, [loaderData])

    return (
        <TPDashboard title="Ordenes" >
            <HeadFilter filterMain={<>
                <InpuTypes.text type="text" label="Orden" placeholder="ID N° 0001" autoComplete="off" id="id" onChange={(e) => {
                    const methods = { page: loaderData.page as number || 1, filter: { search: { id: Number(e["id"]) } } }
                    getOrderAll(methods)
                    getOrderInitial(methods)
                }} />
                <InpuTypes.text type="text" label="Cliente" placeholder="Buscar por Nombre, DNI y Telefono" autoComplete="off" id="client" onChange={(e) => {
                    const methods = { page: loaderData.page as number || 1, filter: { search: { fullname: e["client"], dni: e["client"], phone: e["client"] } } }
                    getOrderAll(methods)
                    getOrderInitial(methods)
                }} />

            </>} filterSecond={<InputSelect.Country setVal={(val) => {
                const methods = { page: loaderData.page as number || 1, filter: { search: { ubigeoCode: val } } }
                getOrderAll(methods)
                getOrderInitial(methods)
            }} />} ButtonModal={<InpuTypes.buttonModal value="Agregar Orden" icon={<NSIcons.Add className="" />} click={() => openModal(true)} />} />
            <Table limit={cursor?.limit ?? 1} currentPage={loaderData.page || 1}>
                <TableHeader>
                    <THeadClick initialDirection={filter?.orderBy?.id ?? undefined} onClick={(val) => getOrderAll({ page: loaderData.page as number || 1, filter: { orderBy: { id: val } } })} text="ID" className="w-2/30 p-2" />
                    <th className="w-3/30 p-2">Cliente</th>
                    <th className="w-2/20 p-2">Telefono</th>
                    <th className="w-2/20 p-2">Metodo P.</th>
                    <th className="w-3/30 p-2">Courier</th>
                    <th className="w-3/30 p-2">Departamento</th>
                    <th className="w-3/30 p-2">Provincia</th>
                    <th className="w-3/30 p-2">Distrito</th>
                    <th className="w-3/30 p-2">Pedidos</th>
                    <THeadClick initialDirection={filter?.orderBy?.costTotal ?? undefined} onClick={(val) => getOrderAll({ page: loaderData.page as number || 1, filter: { orderBy: { costTotal: val } } })} text="Costo Real" className="w-3/30 p-2" />
                    <THeadClick initialDirection={filter?.orderBy?.totalSold ?? undefined} onClick={(val) => getOrderAll({ page: loaderData.page as number || 1, filter: { orderBy: { totalSold: val } } })} text="Importe Total" className="w-3/30 p-2" />
                    <THeadClick initialDirection={filter?.orderBy?.createAt ?? undefined} onClick={(val) => getOrderAll({ page: loaderData.page as number || 1, filter: { orderBy: { createAt: val } } })} text="Creado" className="w-3/30 p-2" />
                    <THeadClick initialDirection={filter?.orderBy?.updateAt ?? undefined} onClick={(val) => getOrderAll({ page: loaderData.page as number || 1, filter: { orderBy: { updateAt: val } } })} text="Editado" className="w-3/30 p-2" />
                    <th className="w-3/30 p-2">Estado</th>
                    <th className="w-1/30 p-2"></th>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b-1 border-gray-300 h-12 hover:bg-gray-100 transition-all select-none">
                            <DataCell.Value value={order.id} />
                            <DataCell.Value value={order.name} />
                            <DataCell.Value value={order.phone} />
                            <DataCell.Value className="bg-blue-400 p-2 rounded-xl text-white font-semibold" value={order.payment} />
                            <DataCell.Value className={`${order.courier ? "bg-blue-400" : "bg-gray-400"} p-2 rounded-xl text-white font-semibold`} value={order.courier ?? "No courier"} />
                            <DataCell.Value value={PeruGet(order.ubigeoCode).departamento} />
                            <DataCell.Value value={PeruGet(order.ubigeoCode).provincia} />
                            <DataCell.Value value={PeruGet(order.ubigeoCode).distrito} />
                            <DataCell.Value value={order.quantityTotal} />
                            <DataCell.Value value={(order.costTotal || 0).toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })} />
                            <DataCell.Value className="bg-blue-500 p-2 rounded-xl text-white font-semibold" value={(order.totalSold || 0).toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })} />
                            <DataCell.Value value={formatDate(order.createAt, 'Creado')} />
                            <DataCell.Value value={formatDate(order.updateAt ?? undefined, 'Actualizado')} />
                            <DataCell.Options status={order.status} options={[
                                {
                                    color: "orange", value: "Pendiente", onclick: async () => {
                                        if (order.status === 5) {
                                            alert("No puedes cambiar el estado de una orden cancelada.")
                                            return;
                                        }
                                        const result = await changeState(order.id, 'Pendiente')
                                        if (loaderData.page && loaderData.page !== 1) {
                                            await getOrderAll({ page: loaderData.page })
                                            await getOrderInitial({ page: loaderData.page })
                                            return
                                        }
                                        await addOrder(result)
                                    }
                                },
                                {
                                    color: "green", value: "Confirmado", onclick: async () => {
                                        if (order.status === 5) {
                                            alert("No puedes cambiar el estado de una orden cancelada.")
                                            return;
                                        }
                                        const result = await changeState(order.id, 'Confirmado')
                                        if (loaderData.page && loaderData.page !== 1) {
                                            await getOrderAll({ page: loaderData.page })
                                            await getOrderInitial({ page: loaderData.page })
                                            return
                                        }
                                        await addOrder(result)
                                    }
                                },
                                {
                                    color: "purple", value: "Preparando", onclick: async () => {
                                        if (order.status === 5) {
                                            alert("No puedes cambiar el estado de una orden cancelada.")
                                            return;
                                        }
                                        const result = await changeState(order.id, 'Preparando')
                                        if (loaderData.page && loaderData.page !== 1) {
                                            await getOrderAll({ page: loaderData.page })
                                            await getOrderInitial({ page: loaderData.page })
                                            return
                                        }
                                        await addOrder(result)
                                    }
                                },
                                {
                                    color: "black", value: "Enviado", onclick: async () => {
                                        if (order.status === 5) {
                                            alert("No puedes cambiar el estado de una orden cancelada.")
                                            return;
                                        }

                                        const result = await changeState(order.id, 'Enviado')
                                        if (loaderData.page && loaderData.page !== 1) {
                                            await getOrderAll({ page: loaderData.page })
                                            await getOrderInitial({ page: loaderData.page })
                                            return
                                        }
                                        await addOrder(result)
                                    }
                                },
                                {
                                    color: "blue", value: "Entregado", onclick: async () => {
                                        if (order.status === 5) {
                                            alert("No puedes cambiar el estado de una orden cancelada.")
                                            return;
                                        }
                                        const result = await changeState(order.id, 'Entregado')
                                        if (loaderData.page && loaderData.page !== 1) {
                                            await getOrderAll({ page: loaderData.page })
                                            await getOrderInitial({ page: loaderData.page })
                                            return
                                        }

                                        await addOrder(result)
                                    }
                                },
                                {
                                    color: "red", value: "Cancelado", onclick: async () => {
                                        if (order.status === 5) {
                                            alert("No puedes cambiar el estado.")
                                            return;
                                        }
                                        const response = window.confirm("¿Estás seguro de que deseas cancelar esta orden?, si lo haces no podras revertir esta accion");
                                        if (response) {
                                            const result = await changeState(order.id, 'Cancelado')
                                            if (loaderData.page && loaderData.page !== 1) {
                                                await getOrderAll({ page: loaderData.page })
                                                await getOrderInitial({ page: loaderData.page })
                                                return
                                            }
                                            await addOrder(result)
                                        }
                                    }
                                }
                            ]} />
                            <DataCell.Options options={[{
                                color: 'blue', value: "Editar", onclick: async () => {
                                    if (order.status === 5) {
                                        alert("No puedes editar una orden cancelada.")
                                        return;
                                    }
                                    await getOrder(order.id)
                                    window.history.replaceState(null, '', `/Ordenes?id=${order.id}&page=${loaderData.page || 1}`);
                                    openModal(true)
                                }
                            }]} />
                        </tr>
                    ))}
                </TableBody>
            </Table>
            {open && <ModalOrder OnClose={() => {
                openModal(false)
                window.history.replaceState({}, '', '/Ordenes')
            }} />}
            {request.message !== undefined && <AlerMessage type={request.message.type} message={request.message.text} animation={request.message.animation} />}
        </TPDashboard>
    )
}