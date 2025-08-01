import { InpuTypes } from "@/components/atoms/Input";
import { formatDate } from "@/lib/utils/DateFormat";
import { VentSellDb } from "@/services/shared/VentSellDb";
import { useEffect, useRef, useState } from "react";

type InputProductsProps = {
    className?: string,
    id?: number,
    idPost?: number,
    valueKey?: (id: number) => void,
    error?: any
};

export const InputClients = ({
    className = '', valueKey, error = undefined, id, idPost
}: InputProductsProps) => {
    const [string, setString] = useState<null | string>(null)
    const getClients = VentSellDb.Client.ClienGetMethods((state) => state.getClients);
    const getIdClient = VentSellDb.Client.ClientMethods((state) => state.getClientId);
    const filter = VentSellDb.Client.ClienGetMethods((state) => state.filter);
    const clients = VentSellDb.Client.ClienGetMethods((state) => state.clients)

    useEffect(() => {
        getClients({ page: 1 })

        if (id) {
            getIdClient(id).then((data) => {
                if (data)
                    setString(
                        `${data.fullname}${data.dni ? ` (${data.tipoID ? `${data.tipoID}:` : ''}${data.dni})` : ''}${data.phone ? ` · 📱 ${data.phone}` : ''}`
                    );
            })
        }
    }, [])

    return (
        <InpuTypes.InputSelect
            readOnly={id ? true : false}
            error={error}
            label="Cliente"
            placeholder="Selecionar Cliente"
            id="inputclient"
            value={filter?.search?.fullname ?? string ?? ""}
            onChange={(e) => {
                console.log(e, 'prueba de escribir')
                setString(e.inputclient)
                getClients({ page: 1, filter: { search: { fullname: e.inputclient, dni: e.inputclient, tipoID: e.inputclient, phone: e.inputclient } } })
            }}
            className={className}>
            {!idPost && clients.length > 0 ? clients.map((client) => (
                <div
                    key={client.id}
                    onClick={async () => {
                        valueKey?.(client.id);
                        setString(
                            `${client.fullname}${client.dni ? ` (${client.tipoID ? `${client.tipoID}:` : ''}${client.dni})` : ''}${client.phone ? ` · 📱 ${client.phone}` : ''}`
                        );

                        getClients({ page: 1 })
                    }}
                    className="flex flex-col gap-2 p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0 group"
                    role="button"
                    aria-label={`Nombre del cliente ${client.fullname}`}
                >
                    <div className="flex gap-2 text-sm">
                        <span className="font-sm text-xs">ID {client.id}</span>
                        <span className="font-semibold">{client.fullname} {client.tipoID}</span>
                    </div>
                    <div className="flex gap-3 text-[11px] text-gray-600 h-5">
                        {client.phone && <div className="h-full p-1 bg-gray-100 rounded-full inline-flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-5 " viewBox="0 0 24 24" ><g fill="none"><path fill="currentColor" d="M20 16v4c-2.758 0-5.07-.495-7-1.325c-3.841-1.652-6.176-4.63-7.5-7.675C4.4 8.472 4 5.898 4 4h4l1 4l-3.5 3c1.324 3.045 3.659 6.023 7.5 7.675L16 15z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 18.675c1.93.83 4.242 1.325 7 1.325v-4l-4-1zm0 0C9.159 17.023 6.824 14.045 5.5 11m0 0C4.4 8.472 4 5.898 4 4h4l1 4z"></path></g></svg>
                            <span className="text-[11px]">{client.phone}</span>
                        </div>}
                        {client.dni && <div className="h-full p-1 bg-gray-100 rounded-full inline-flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="h-full w-5 "><path fill="currentColor" d="M14 13h5v-2h-5zm0-3h5V8h-5zm-9 6h8v-.55q0-1.125-1.1-1.787T9 13t-2.9.663T5 15.45zm4-4q.825 0 1.413-.587T11 10t-.587-1.412T9 8t-1.412.588T7 10t.588 1.413T9 12m-5 8q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm0-2h16V6H4zm0 0V6z"></path></svg>                            <span className="text-[11px]">{client.dni}</span>
                        </div>}

                        <div className="h-full p-1 bg-gray-100 rounded-full inline-flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="h-full w-5 "><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><circle cx={12} cy={12} r={9}></circle><path d="M12 7v3.764a2 2 0 0 0 1.106 1.789L16 14"></path></g></svg>
                            <span className="text-[11px]">{formatDate(client.createAt)}</span>
                        </div>
                    </div>
                </div>
            )): <div className="flex flex-col gap-2 p-3 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 group">No hay resultados</div>}
        </InpuTypes.InputSelect>
    );
};