import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"


interface Data {
    category: string,
    value: number
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

const CustomTooltip = ({ active, payload, label }: any) => {
    console.log(payload, label)
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
                <p className="text-sm text-gray-700 font-semibold">{`${payload[0].name}: ${payload[0].value} Productos`}</p>
            </div>
        );
    }
    return null;
};


export const ChartPie = ({data}:{data: Data[]}) => {
    return (
        <div className="row-span-21 bg-white shadow-xs rounded-lg p-5 flex flex-col">
            <h2 className="text-lg text-gray-500 font-semibold">Categorias</h2>
            <ResponsiveContainer className="flex-5">
                <PieChart width={730} height={250}>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend layout="vertical"
                        verticalAlign="bottom"
                        iconSize={12}
                    />
                    <Pie
                        legendType="square"
                        data={data}
                        dataKey="value"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        innerRadius={120}
                        paddingAngle={2}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}