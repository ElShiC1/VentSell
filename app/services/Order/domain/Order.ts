import type { Client } from "@/services/Client/domain/Client"
import type { Product } from "@/services/Products/domain/Product"

export interface Order {
    id: number,
    idCl: number,
    ubigeoCode: string,
    shipPrice: number,
    quantityTotal: number,
    costTotal: number,
    totalSold: number,
    address: string,
    payment: string,
    courier: string
    note: string,
    status: number,
    createAt: string,
    updateAt: string
    igv: number,
}

export interface OrderItem {
    idOrder: number,
    idProduct: number,
    quantity: number,
    salePrice: number
}

export interface OrderAll {
    order: (Order & { name: string, phone: string })[],
    cursor: {
        limit: number
        currentPage: number,
        next: boolean
    }
}

export type Item = (Pick<Product, "name" | "category" | "imgThumb"> & Pick<OrderItem, "idProduct" | "quantity" | "salePrice"> & { realPrice: number })

export interface OrderId {
    order: Order,
    client: Client
    products: Item[]
}

interface AnalyticsChartWeek {
    name: string,
    mount: number
}

interface AnalyticsSummary {
    name: string,
    category: string,
    soldTotal: number
    mountTotal: number
    orderTotal: number
}

export interface AnalyticsChartSummary {
    name: string,
    expenses: number,
    income: number,
    balances: number
}

interface Pie {
    category: string,
    value: number
}

export interface Analytics {
    chartWeekIncomes: {
        chart: AnalyticsChartWeek[],
        total: number
        percentage: number
    }
    chartWeekExpenses: {
        chart: AnalyticsChartWeek[],
        total: number
        percentage: number
    },
    chartWeekBalances: {
        chart: AnalyticsChartWeek[],
        total: number,
        percentage: number
    }
    summary: AnalyticsSummary,
    chartSummary: {
        day: AnalyticsChartSummary[],
        sixMonths: AnalyticsChartSummary[],
        oneYear: AnalyticsChartSummary[],
        allTime: AnalyticsChartSummary[],
        byYear: AnalyticsChartSummary[],
        rhismonth: AnalyticsChartSummary[]
    },
    pie: Pie[]
}