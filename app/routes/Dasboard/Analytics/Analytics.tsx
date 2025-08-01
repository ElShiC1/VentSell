import { ChartPie, ChartSummary, ChartWeek, Summary } from "@/components/organism/Analytics";
import { TPDashboard } from "@/components/template/Dashboard";
import type { Analytics } from "@/services/Order/domain/Order";
import { VentSellDb } from "@/services/shared/VentSellDb";
import { useEffect, useState } from "react";
import { data } from "react-router";
import { LineChart, Line, Tooltip, ResponsiveContainer, AreaChart, YAxis, XAxis, CartesianGrid, ReferenceLine, Area, Pie, PieChart, Legend, Cell, ReferenceDot } from "recharts";


export function meta() {
    return [
        { title: "VentSell - Dashboard" }
    ];
}




const data01 = [
    {
        "category": "Group A",
        "value": 400
    },
    {
        "category": "Group B",
        "value": 300
    },
    {
        "category": "Group C",
        "value": 300
    },
    {
        "category": "Group D",
        "value": 200
    },
    {
        "category": "Group E",
        "value": 278
    },
    {
        "category": "Group F",
        "value": 189
    }
];

export const DataIngresos = [
    {
        name: 'Lunes',
        mount: 200.57
    },
    {
        name: 'Martes',
        mount: 200.57
    },
    {
        name: 'Miercoles',
        mount: 200.57
    },
    {
        name: 'Jueves',
        mount: 150.57
    },
    {
        name: 'Viernes',
        mount: 50.57
    },
    {
        name: 'Sabado',
        mount: 500.57
    },
    {
        name: 'Domingo',
        mount: 180.57
    }
]

export const Data = [
    {
        name: 'Enero',
        expenses: 1234,
        income: 21313,
        balances: 24544
    },
    {
        name: 'Febrero',
        expenses: 1567,
        income: 22500,
        balances: 24544
    },
    {
        name: 'Marzo',
        expenses: 1890,
        income: 23800,
        balances: 24544
    },
    {
        name: 'Abril',
        expenses: 2100,
        income: 24500,
        balances: 2544
    },
    {
        name: 'Mayo',
        expenses: 2345,
        income: 25200,
        balances: 55432
    },
    {
        name: 'Junio',
        expenses: 2789,
        income: 26500,
        balances: 3233
    },
    {
        name: 'Julio',
        expenses: 2950,
        income: 27100,
        balances: 54545
    },
    {
        name: 'Agosto',
        expenses: 3100,
        income: 28300,
        balances: 12323
    },
    {
        name: 'Septiembre',
        expenses: 2876,
        income: 27400,
        balances: 24145
    },
    {
        name: 'Octubre',
        expenses: 3245,
        income: 29100,
        balances: 76503
    },
    {
        name: 'Noviembre',
        expenses: 3567,
        income: 30200,
        balances: 23135
    },
    {
        name: 'Diciembre',
        expenses: 4123,
        income: 32500,
        balances: 2132
    }
];

export default function Analytics() {

    const analytics = VentSellDb.Order.OrderGetMethods((state) => state.analytics);
    const selectCharSummary = VentSellDb.Order.OrderGetMethods((state) => state.selectCharSummary);
    const getAnalytics = VentSellDb.Order.OrderGetMethods((state) => state.getAnalytics);

    useEffect(() => {
        getAnalytics('now').then(data => {
            console.log(data, "Analytics Data, Analytics.tsx");
        }).catch(error => {
            console.error("Error fetching analytics:", error);
        });
    }, [])


    return (
        <TPDashboard title="Analísis">
            <ChartWeek title="Ingresos" mounTotal={analytics?.chartWeekIncomes.total} data={analytics?.chartWeekIncomes.chart} color="green" percentage={analytics?.chartWeekIncomes.percentage} />
            <ChartWeek title="Gastos" mounTotal={analytics?.chartWeekExpenses.total} data={analytics?.chartWeekExpenses.chart} color="red" percentage={analytics?.chartWeekExpenses.percentage} />
            <ChartWeek title="Balance" mounTotal={analytics?.chartWeekBalances.total} data={analytics?.chartWeekBalances.chart} color="orange" percentage={analytics?.chartWeekBalances.percentage} />
            {/*Resumen Final*/}
            <Summary mountTotal={analytics?.summary.mountTotal} orderTotal={analytics?.summary.orderTotal} product={{ name: analytics?.summary.name, category: analytics?.summary.category, soldTotal: analytics?.summary.soldTotal }} />

            {/* Cuadro de estadísticas comparacion*/}
            <ChartSummary setDate={async (val) => {
                await getAnalytics(val)
            }} data={selectCharSummary} />
            { }
            <ChartPie data={analytics?.pie} />
        </TPDashboard>
    );
}