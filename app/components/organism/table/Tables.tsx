import { NSIcons } from "@/components/atoms/Icons/NSIcons"
import { ColTable } from "@/components/molecules/Table/Options";

// Define la interfaz de una fila
interface Prubea {
    webones: string;
}

// Define un tipo genérico para un array de datos
type TableDataType<T> = T[];

// Define el tipo completo del estado de la tabla
type TableData<T> = {
    tableData: TableDataType<T>;
    IsImage: boolean;
};

// Uso del tipo correctamente
const data2: TableData<Prubea> = {
    tableData: [
        {
            webones: '2222',
        },
    ],
    IsImage: false,
};





const UrlIs = (value: any) => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
}

export const Tabless= <T extends Record<string, any>>({ tableData, children }: { tableData: TableData<T>, children: React.ReactNode }) => {

    const IsImageTrue = (tableData: TableDataType<T>) => {
        return tableData.sort((a, b) => {
            return Number(!UrlIs(a)) - Number(!UrlIs(b));
        });
    }

    const stateMap = {
        1: { text: 'Confirmado', bg: 'bg-green-300', textColor: 'text-green-900' },
        2: { text: 'Cancelado', bg: 'bg-orange-300', textColor: 'text-orange-900' },
        3: { text: 'Pendiente', bg: 'bg-red-300', textColor: 'text-red-900' },
    };


    return (
        <div className="col-span-full row-span-9 bg-white rounded-xl p-5 flex flex-col shadow-sm">
            <div className="flex-15 overflow-hidden rounded-tl-lg rounded-tr-lg">
                <table className="table-fixed w-full">
                    <thead className="text-justify text-sm">
                        <tr className="bg-blue-500 text-white ">
                            {children}
                            <th className="w-7 p-2"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {tableData.tableData.map((val, index) => {
                            return (
                                <tr key={index} className="border-b-1 border-gray-300 h-9 hover:bg-gray-100 transition-all select-none">
                                    {Object.entries(val).map(([key, value], index) => {
                                        if (key === 'state') {
                                            return (
                                                <ColTable options={[{color: 'red', value: 'Cancelado'}, {color: 'orange', value: 'Pendiente'}, {color: 'green', value: 'Confirmado'}]} key={key} value={<span className={`${stateMap[value as keyof typeof stateMap].bg} p-2 text-sm rounded-2xl ${stateMap[val.state as keyof typeof stateMap].textColor} font-semibold`}>{stateMap[val.state as keyof typeof stateMap].text}</span>} />
                                            )
                                        }

                                        if (key === 'image') {
                                            return (
                                                <td key={index} className="p-2">
                                                    <img src={value} className="w-9 object-cover rounded-4xl" />
                                                </td>
                                            )
                                        }

                                        return (
                                            <td key={index} className="p-2 truncate">{value}</td>
                                        )
                                    })}
                                    <ColTable options={[{color: 'black', value: 'Editar'}, {color: 'red', value: 'Eliminar'}]} value={<NSIcons.MenuMore className="h-10 w-10 object-contain translate-x-[-20px] " />} />
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
            <div className="flex-1 flex justify-center items-center gap-2">
                <div className="page w-8 h-8 bg-blue-500 flex items-center justify-center text-white rounded-4xl font-semibold">1</div>
                <div className="page w-8 h-8 bg-blue-500 flex items-center justify-center text-white rounded-4xl font-semibold">2</div>
                <div className="page w-8 h-8 bg-blue-500 flex items-center justify-center text-white rounded-4xl font-semibold">3</div>
                <div className="page">...</div>
                <div className="page w-8 h-8 bg-blue-500 flex items-center justify-center text-white rounded-4xl font-semibold">20</div>
            </div>
        </div >
    )
}