import { NSIcons } from "@/components/atoms/Icons/NSIcons";
import { InpuTypes } from "@/components/atoms/Input";
import { DataCell } from "@/components/molecules/Table/DataCell";
import { Customer } from "@/components/organism/Modal/Customer/Customer";
import { Table } from "@/components/organism/table/Table";
import { TableBody } from "@/components/organism/table/TableBody";
import { TableHeader } from "@/components/organism/table/TableHeader";
import { HeadFilter } from "@/components/template/Dashboard";
import { TPDashboard } from "@/components/template/Dashboard/Dashboard";
import { VentSellDb } from "@/services/shared/VentSellDb";
import type { Route } from "../+types/Layout";
import { useEffect } from "react";
import { AlerMessage } from "@/components/molecules/alertMessage/AlertMessage";
import { formatDate } from "@/lib/utils/DateFormat";
import { data } from "react-router";
import { THeadClick } from "@/components/molecules/Table/THeadClick";

export function meta() {
    return [
        { title: "VentSell - Clientes & Dashboard" }
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


export default function Customers({ loaderData }: { loaderData: LoaderData }) {
    const setOpen = VentSellDb.Client.ClientMethods((set) => set.setOpen)
    const open = VentSellDb.Client.ClientMethods((set) => set.open)
    const getClientId = VentSellDb.Client.ClientMethods((set) => set.getClientId)
    const changeStatus = VentSellDb.Client.ClientMethods((set) => set.changeStatus)
    const request = VentSellDb.Client.ClientMethods((val) => val.request)
    const clients = VentSellDb.Client.ClienGetMethods((val) => val.clients)
    const getClients = VentSellDb.Client.ClienGetMethods((val) => val.getClients)
    const getClientsInitial = VentSellDb.Client.ClienGetMethods((val) => val.getClientsInitial)
    const addOrder = VentSellDb.Order.OrderGetMethods((state) => state.addOrder)
    const deleteForm = VentSellDb.Client.ClientMethods((val) => val.deleteForm)
    const cursor = VentSellDb.Client.ClienGetMethods((val) => val.cursor)
    const filter = VentSellDb.Client.ClienGetMethods((val) => val.filter)

    useEffect(() => {
        const pagination = loaderData.page || 1;
        const id = loaderData.id;
        console.log(loaderData)
        if (id) {
            getClientId(id).then((data) => {
                if (data) {
                    console.log("entro")
                    setOpen(true);
                } else {
                    console.log("fallo")
                    setOpen(false);
                }
            })
        }
        setOpen(false)
        getClients({ page: pagination })
        getClientsInitial({ page: pagination })
    }, [loaderData])

    return (
        <TPDashboard title="Clientes">
            <HeadFilter
                filterMain={
                    <>
                        <InpuTypes.InputSelect
                            data={{ DNI: undefined, CE: undefined }}
                            label="Tipo documento"
                            value={filter?.search?.tipoID ?? ""}
                            placeholder="Selecionar documento"
                            id="tipoID"
                            readOnly
                            onClick={(val) => {
                                const methods = { page: loaderData.page as number || 1, filter: { search: { tipoID: val } } }
                                getClients(methods)
                                getClientsInitial(methods)
                            }}
                        />
                    </>
                }
                filterSecond={
                    <>
                        <InpuTypes.text type="text" label="Cliente" placeholder="VentSell" autoComplete="off" id="fullname" onChange={(e) => {
                            const methods = { page: loaderData.page as number || 1, filter: { search: e } }
                            getClients(methods)
                            getClientsInitial(methods)
                        }} />
                        <InpuTypes.text type="text" label="N° Documento" placeholder="0292838" autoComplete="off" id="dni" onChange={(e) => {
                            const methods = { page: loaderData.page as number || 1, filter: { search: e } }
                            getClients(methods)
                            getClientsInitial(methods)
                        }} />
                        <InpuTypes.text type="text" label="N° Celular" placeholder="0292838" autoComplete="off" id="phone" onChange={(e) => {
                            const methods = { page: loaderData.page as number || 1, filter: { search: e } }
                            getClients(methods)
                            getClientsInitial(methods)
                        }} />
                    </>
                }
                ButtonModal={
                    <InpuTypes.buttonModal value="Crear Cliente" icon={<NSIcons.Add className="" />} click={() => setOpen(true)} />
                }>

            </HeadFilter>
            <Table limit={cursor?.limit ?? 1} currentPage={loaderData.page as number || 1}>
                <TableHeader>
                    <THeadClick initialDirection={filter!.orderBy?.id ?? undefined} onClick={(val) => getClients({ page: loaderData.page as number || 1, filter: { orderBy: { id: val } } })} text="ID" className="w-1/30 p-2" />
                    <th className="w-1/20 p-2">DOC.</th>
                    <th className="w-2/20 p-2">DNI</th>
                    <th className="w-1/8 p-2">Nombre</th>
                    <th className="w-1/8 p-2">Celular</th>
                    <th className="w-1/8 p-2">Ultima Orden</th>
                    <th className="w-3/30 p-2">Vendidos</th>
                    <th className="w-3/30 p-2">Monto Gastado</th>
                    <THeadClick initialDirection={filter!.orderBy?.orderUlt ?? undefined} onClick={(val) => getClients({ page: loaderData.page as number || 1, filter: { orderBy: { orderUlt: val } } })} text="Orden Fecha" className="w-3/30 p-2" />
                    <THeadClick initialDirection={filter!.orderBy?.createAt ?? undefined} onClick={(val) => getClients({ page: loaderData.page as number || 1, filter: { orderBy: { updateAt: val } } })} text="Creado" className="w-3/30 p-2" />
                    <THeadClick initialDirection={filter!.orderBy?.updateAt ?? undefined} onClick={(val) => getClients({ page: loaderData.page as number || 1, filter: { orderBy: { updateAt: val } } })} text="Editado" className="w-3/30 p-2" />
                    <th className="w-2/30 p-2">Estado</th>
                    <th className="w-1/30 p-2"></th>
                </TableHeader>
                <TableBody>
                    {clients.map((val) => (
                        <tr key={val.id} className="border-b-1 border-gray-300 h-12 hover:bg-gray-100 transition-all select-none">
                            <DataCell.Value value={val.id} />
                            <DataCell.Value value={val.tipoID ?? ""} />
                            <DataCell.Value value={val.dni ?? ""} />
                            <DataCell.Value value={val.fullname} />
                            <DataCell.Value value={val.phone ?? ""} />
                            <DataCell.Value value={val.idorder ?? ""} />
                            <DataCell.Value value={val.quantitySold} />
                            <DataCell.Value value={(val.totalCost ?? 0).toLocaleString('es-PE', { style: 'currency', currency: 'PEN' })} />
                            <DataCell.Value value={formatDate(val.orderUlt === val.createAt ? undefined : val.orderUlt, "Actualizado", "Ninguna orden")} />
                            <DataCell.Value value={formatDate(val.createAt)} />
                            <DataCell.Value value={formatDate(val.updateAt === val.createAt ? undefined : val.updateAt, "Actualizado")} />
                            <DataCell.Options status={val.status} options={[{
                                color: 'red', value: "Inactivo", onclick: async () => {
                                    await changeStatus(val.id, "Inactivo")
                                    getClients({ page: loaderData.page as number || 1 })
                                    getClientsInitial({ page: loaderData.page as number || 1 })
                                }
                            }, {
                                color: 'green', value: 'Activo', onclick: async () => {
                                    await changeStatus(val.id, "Activo")
                                    getClients({ page: loaderData.page as number || 1 })
                                    getClientsInitial({ page: loaderData.page as number || 1 })
                                }
                            },
                            {
                                color: 'orange', value: 'Frecuente', onclick: async () => {
                                    await changeStatus(val.id, "Frecuente")
                                    getClients({ page: loaderData.page as number || 1 })
                                    getClientsInitial({ page: loaderData.page as number || 1 })
                                }
                            },
                            {
                                color: 'blue', value: 'Prioritario', onclick: async () => {
                                    await changeStatus(val.id, "Prioritario")
                                    getClients({ page: loaderData.page as number || 1 })
                                    getClientsInitial({ page: loaderData.page as number || 1 })
                                }
                            },
                            ]} />
                            <DataCell.Options options={[{
                                color: 'blue', value: "Editar", onclick: async () => {
                                    await getClientId(val.id)
                                    window.history.replaceState(null, '', `/Clientes?id=${val.id}&page=${loaderData.page || 1}`);
                                    setOpen(true);
                                }
                            }, {
                                color: 'red', value: 'Eliminar', onclick: async () => {
                                    await deleteForm(val.id)
                                    getClients({ page: loaderData.page as number || 1 })
                                    getClientsInitial({ page: loaderData.page as number || 1 })
                                }
                            }]} />
                        </tr>
                    ))

                    }
                </TableBody>
            </Table>
            {open && <Customer onclick={() => {
                setOpen(false)
                window.history.replaceState(null, '', `/Clientes`);
            }} />}
            {request.message !== undefined && <AlerMessage type={request.message.type} message={request.message.text} animation={request.message.animation} />}
        </TPDashboard>
    )
}