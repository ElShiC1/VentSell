import type { Request, SchemaError } from "@/lib/types/global/Global";
import type { Analytics, AnalyticsChartSummary, Order, OrderAll } from "../domain/Order";
import type { MethodsOrder, Repository } from "../domain/Repository";
import { create } from "zustand";

interface OrderInterface {
    analytics: Analytics,
    selectCharSummary: AnalyticsChartSummary[],
    request: Request<Order>,
    orders: OrderAll['order'],
    selects: {
        category: Record<string, string>
    }
    error: SchemaError<{ order: Partial<Order> }>,
    cursor: OrderAll['cursor'] | null,
    filter: MethodsOrder['filter'],
    addOrder: (data: Order & { name: string, phone: string }) => void,
    getAnalytics: (methods: 'now' | 'oneMonth' | 'sixMonth' | 'year') => Promise<void>,
    getOrders: (methods: MethodsOrder) => Promise<void>,
    getOrderInitial: (methods: MethodsOrder) => Promise<void>
}

export const OrderGetStore = (repository: Repository) => create<OrderInterface>((set, get) => ({
    analytics: {
        chartWeekIncomes: {
            chart: [],
            total: 0,
            percentage: 0
        },
        chartWeekExpenses: {
            chart: [],
            total: 0,
            percentage: 0
        },
        chartWeekBalances: {
            chart: [],
            total: 0,
            percentage: 0
        },
        summary: {
            name: '',
            category: '',
            soldTotal: 0,
            mountTotal: 0,
            orderTotal: 0
        },
        chartSummary: {
            day: [],
            sixMonths: [],
            oneYear: [],
            allTime: [],
            byYear: [],
            rhismonth: []
        },
        pie: []
    },
    selectCharSummary: [],
    request: {
        loading: null,
        success: null,
        message: undefined,
        data: undefined
    },
    selects: {
        category: {}
    },
    filter: {
        orderBy: {}
    },
    cursor: null,
    orders: [],
    error: {
        data: {},
        success: false
    },
    addOrder: (data) => {
        set((state) => {
            const existingIndex = state.orders.findIndex(p => p.id === data.id);
            console.log(existingIndex, "Existing Index");
            const newProduct = { ...data };
            let orders;
            if (existingIndex !== -1) {
                orders = [
                    newProduct,
                    ...state.orders.slice(0, existingIndex),
                    ...state.orders.slice(existingIndex + 1)
                ];
            } else {
                orders = [
                    newProduct,
                    ...(state.orders.length === 11 ? state.orders.slice(0, -1) : state.orders)
                ];
            }
            return { orders };
        });
    },
    getOrders: async (methods) => {
        const data = await repository.getOrderAll(methods);
        set(({ orders: [...data], filter: { orderBy: methods.filter?.orderBy ?? {}, search: methods.filter?.search ?? {} } }))
    },
    getOrderInitial: async (methods) => {

        const getMethods = get()

        if (
            getMethods.cursor &&
            getMethods.cursor.currentPage !== methods.page &&
            Object.values(methods.filter?.search || {}).every(val => !val)
        ) {
            const { currentPage, ...data } = getMethods.cursor;
            console.log('Using cached cursor');
            set({ cursor: { currentPage: methods.page, ...data } });
            return;
        }

        const data = await repository.getOrderCursor(methods);
        console.log(data, "Data from getProductsInitial");
        set(({ cursor: data, filter: { orderBy: methods.filter?.orderBy ?? {}, search: methods.filter?.search ?? {} } }));
    },
    getAnalytics: async (methods) => {
        const result = await repository.getAnalytics();
        set((state) => {
            switch (methods) {
                case 'now':
                    state.selectCharSummary = result.chartSummary.day;
                    break;
                case 'oneMonth':
                    state.selectCharSummary = result.chartSummary.rhismonth;
                    break;
                case 'sixMonth':
                    state.selectCharSummary = result.chartSummary.sixMonths;
                    break;
                case 'year':
                    state.selectCharSummary = result.chartSummary.oneYear;
                    break;
                default:
                    state.selectCharSummary = result.chartSummary.day;
            }
            return {
                ...state,
                analytics: result,
            };
        })
    }
}));