import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
                <p className="text-sm font-semibold text-gray-700">{`${label}`}</p>
                <p className="text-sm text-green-500 font-semibold">{`Ingreso: S/${payload[0].value.toLocaleString('en-US')}`}</p>
                <p className="text-sm text-red-500 font-semibold">{`Gasto: S/${payload[1].value.toLocaleString('en-US')}`}</p>
                <p className="text-sm text-orange-500 font-semibold">{`Balance: S/${payload[2].value.toLocaleString('en-US')}`}</p>
            </div>
        );
    }

    return null;
};

interface Data {
    name: string,
    income: number,
    expenses: number,
    balances: number
}

interface DateSelect {
    label: string,
    value: 'now' | 'oneMonth' | 'sixMonth' | 'year'
}

const dateSelect: DateSelect[] = [
    { label: 'Hoy', value: 'now' },
    { label: '1 Mes', value: 'oneMonth' },
    { label: '6 Meses', value: 'sixMonth' },
    { label: '1 Año', value: 'year' }
]

export const ChartSummary = ({ data, setDate }: { data: Data[], setDate: (val: DateSelect['value']) => void }) => {
    const [value, setValue] = useState('now');

    return (
        <div id="aqui agregar" className="row-span-21 col-span-3 bg-white shadow-xs rounded-lg p-5 flex flex-col">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg text-gray-500 font-semibold">Rendimiento de ventas</h2>
                <div id="state-date" className="flex items-center border-2 border-gray-300 bg-white rounded-lg shadow-sm text-sm text-gray-500">
                    {dateSelect.map((date) => (
                        <div key={date.value} onClick={() => {
                            setValue(date.value)
                            setDate(date.value)
                            }} id="date" className={`font-semibold ${date.value === value ? 'text-blue-500' : ''} cursor-pointer p-2 border-r-2 border-gray-300 hover:text-blue-600 transition-colors`}>
                            <span className="">{date.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <ResponsiveContainer className="flex-5">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="green" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="green" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="red" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="red" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="orange" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="orange" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="orange" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" vertical={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="linear"
                        dataKey="income"
                        stroke="green"
                        fillOpacity={1}
                        fill="url(#green)"
                        dot={{ stroke: 'green', strokeWidth: 2, r: 4 }} // Personalización de los puntos
                    />
                    <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="red"
                        fillOpacity={1}
                        fill="url(#red)"
                        dot={{ stroke: '#red', strokeWidth: 2, r: 4 }} // Personalización de los puntos
                    />
                    <Area
                        type="monotone"
                        dataKey="balances"
                        stroke="orange"
                        fillOpacity={1}
                        fill="url(#orange)"
                        dot // Habilita los puntos con estilo predeterminado
                    />


                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}