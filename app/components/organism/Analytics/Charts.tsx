import type { Color } from "@/lib/types/global/Global";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis } from "recharts"


interface Data {
    name: string,
    mount: number,
}

interface Props{
    data: Data[],
    color: Color,
    mounTotal: number,
    percentage: number,
    title: string,
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
                <p className="text-sm font-semibold text-gray-700">{`Dia: ${label}`}</p>
                <p className="text-sm text-green-500">{`Total: S/${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const IconValueSymbol = (number: number) => {
    const result = number > 0 
    return {    
        symbol: result ? `+ ${number}% ▲`: `${number}% ▼`,
        result: result
    }
}

const color: Record<Color, string> = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    orange: 'text-orange-600',
}

export const ChartWeek = (props: Props) => {
    return (
        <div className="row-span-5 bg-white rounded-xl shadow-xs p-5 flex flex-col">
            <div className="flex-5 flex flex-col items-start">
                <span className="text-sm text-gray-500">{props.title}</span>
                <span className={`text-2xl font-bold text-gray-600`}>S/{props.mounTotal.toLocaleString('en-US')}</span>
                <span className={`text-sm ${IconValueSymbol(props.percentage).result ? color.green : color.red}`}>{IconValueSymbol(props.percentage).symbol}</span>
            </div>
            <ResponsiveContainer className="flex-5">
                <AreaChart data={props.data}>
                    <defs>
                        {/* Definimos un gradiente para el área */}
                        <linearGradient id={props.color} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={props.color} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={props.color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" hide={true} /> {/* Ocultamos las etiquetas del eje X */}
                    <Tooltip cursor={false} content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="mount" stroke={props.color} fill={`url(#${props.color})`} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
