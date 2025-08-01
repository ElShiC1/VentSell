import type { Request } from "@/lib/types/global/Global";
import type { Client } from "@/services/Client/domain/Client";
import type { Order, OrderItem, OrderId, OrderAll, Analytics } from "../domain/Order";
import type { MethodsOrder, Repository, StateOrder } from "../domain/Repository";
import type { TableVentSell } from "@/services/db/Db";
import { ClientService } from "@/services/Client/infrastructure/ClientService";

export class OrderService implements Repository {

    #limit = 11

    constructor(private readonly db: TableVentSell) { }

    async postOrder(data: Order, orderItems: [OrderItem & { realPrice: number }], idCL: number): Promise<Request<Omit<Order, "idCL"> & { name: string; phone: string; }>> {
        try {
            const orderAdd = await this.db.order.add({ ...data, idCl: idCL, updateAt: new Date().toISOString(), createAt: new Date().toISOString(), status: 0, quantityTotal: orderItems.reduce((acc, val) => acc + val.quantity, 0), totalSold: orderItems.reduce((acc, val) => acc + (val.quantity * val.salePrice), 0), costTotal: orderItems.reduce((acc, val) => acc + (val.quantity * val.realPrice), 0) }) as number

            await this.db.orderItem.bulkAdd(orderItems.map((val) => ({
                ...val,
                idOrder: orderAdd
            })))

            orderItems.map(async (val) => {
                await this.db.product.where('id').equals(val.idProduct).modify((prev) => {
                    prev.quantity -= val.quantity
                    prev.quantitySold += val.quantity
                    prev.totalCost -= prev.cost! * val.quantity
                    prev.totalSold += prev.salePrice! * val.quantity
                })
            })

            await this.db.client.where('id').equals(idCL).modify((prev) => {
                prev.idorder = orderAdd
                prev.orderUlt = new Date().toISOString()
                prev.totalCost += orderItems.reduce((acc, val) => acc + (val.quantity * val.salePrice), 0)
                prev.quantitySold += orderItems.reduce((acc, val) => acc + val.quantity, 0)
            })

            const client = await this.db.client.get(idCL as any);

            return {
                data: { ...data, idCl: idCL, quantityTotal: orderItems.reduce((acc, val) => acc + val.quantity, 0), totalSold: orderItems.reduce((acc, val) => acc + (val.quantity * val.salePrice), 0), costTotal: orderItems.reduce((acc, val) => acc + (val.quantity * val.realPrice), 0), id: orderAdd, name: client?.fullname || "No disponible", phone: client?.phone || 'No disponible', status: 0 },
                loading: false,
                success: true,
                message: {
                    type: 'success',
                    text: `Orden creado con el id ${orderAdd}`,
                    animation: true
                },
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error('Error al editar')
        }
    }

    async updateOrder(data: Order, orderItems: (OrderItem & { state: 0 | 1 | 2, realPrice: number })[]): Promise<Request<Omit<Order, "idCL"> & { name: string; phone: string; }>> {
        try {
            if (data.status === 5) {
                throw new Error(`No puedes editar una orden cancelada.`)
            }

            const mapeoOrder = orderItems.map(async (val) => {
                const orderGet = await this.db.orderItem
                    .filter(item => item.idOrder === data.id && item.idProduct === val.idProduct)
                    .first();

                let quantityDelta = 0;
                let costDelta = 0;

                if (val.state === 0) {
                    await this.db.orderItem.add({ ...val, idOrder: data.id });

                    quantityDelta = val.quantity;
                    costDelta = val.quantity * val.salePrice;

                    await this.db.product.where('id').equals(val.idProduct).modify((prev) => {
                        prev.quantity -= val.quantity;
                        prev.quantitySold += val.quantity;
                        prev.totalCost -= prev.cost! * val.quantity;
                        prev.totalSold += val.salePrice! * val.quantity;
                    });
                }

                if (val.state === 1) {
                    const difference = val.quantity - orderGet!.quantity;

                    quantityDelta = difference;
                    costDelta = difference * val.salePrice;

                    await this.db.orderItem
                        .filter(item => item.idOrder === data.id && item.idProduct === val.idProduct)
                        .modify((prev) => {
                            prev.quantity = val.quantity;
                        });

                    await this.db.product.where('id').equals(val.idProduct).modify((prev) => {
                        prev.quantity -= difference;
                        prev.quantitySold += difference;
                        prev.totalCost -= prev.cost! * difference;
                        prev.totalSold += val.salePrice! * difference;
                    });
                }

                if (val.state === 2) {
                    quantityDelta = -orderGet!.quantity;
                    costDelta = -orderGet!.quantity * orderGet!.salePrice!;

                    await this.db.orderItem
                        .filter(item => item.idOrder === data.id && item.idProduct === val.idProduct)
                        .delete();

                    await this.db.product.where('id').equals(val.idProduct).modify((prev) => {
                        prev.quantity += orderGet!.quantity;
                        prev.quantitySold -= orderGet!.quantity;
                        prev.totalCost += prev.cost! * orderGet!.quantity;
                        prev.totalSold -= prev.salePrice! * orderGet!.quantity;
                    });
                }

                await this.db.client.where('id').equals(data.idCl).modify((prev) => {
                    prev.totalCost += costDelta;
                    prev.quantitySold += quantityDelta;
                    prev.orderUlt = new Date().toISOString();
                });
            });

            await Promise.all(mapeoOrder);

            await this.db.order.update(data.id as any, { ...data, updateAt: new Date().toISOString(), status: 0, quantityTotal: orderItems.reduce((acc, val) => acc + val.quantity, 0), totalSold: orderItems.reduce((acc, val) => acc + (val.quantity * val.salePrice), 0), costTotal: orderItems.reduce((acc, val) => acc + (val.quantity * val.realPrice), 0) })

            const client = await this.db.client.get(data.idCl as any);

            return {
                data: { ...data, name: client?.fullname || "No disponible", phone: client?.phone || 'No disponible' },
                loading: false,
                success: true,
                message: {
                    type: 'success',
                    text: `Orden editado con el id ${data.id}`,
                    animation: true
                },
            }

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error('Error al editar')
        }
    }

    async getOrderId(id: number): Promise<Request<OrderId>> {
        try {
            const clientNew = new ClientService(this.db.client)

            const order = await this.db.order.where('id').equals(id).first()

            if (!order) {
                throw new Error(`Order con el id ${id} no encontrado.`)
            }


            const orders = await this.db.orderItem.where('idOrder').equals(id).toArray()
            const client = await this.db.client.where('id').equals(order.id).first()

            const product = await this.db.product.toArray()
            const getProduct = new Map(product.map(val => [val.id, { name: val.name, category: val.category }]))

            return {
                message: {
                    text: `Orden ${id} encontrado correctamente`,
                    type: 'success',
                    animation: true
                },
                success: true,
                loading: false,
                data: {
                    client: {
                        ...client!
                    },
                    order,
                    products: orders.map((val) => {
                        const product = getProduct.get(val.idProduct);
                        return {
                            category: product ? product.category : "",
                            name: product ? product.name : "",
                            idProduct: val.idProduct,
                            quantity: val.quantity,
                            salePrice: val.salePrice,
                        };
                    })
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error('Error al editar')
        }
    }

    async getOrderAll(methods: MethodsOrder): Promise<OrderAll["order"]> {
        try {
            let orders = await this.db.order.orderBy('[updateAt+createAt]').reverse().offset((methods.page - 1) * this.#limit).limit(this.#limit).toArray()
            const getClient = new Map((await this.db.client.toArray()).map(val => [val.id, { dni: val.dni, fullname: val.fullname, phone: val.phone }]))

            if (methods.filter && methods.filter.orderBy && Object.values(methods.filter.orderBy).some(v => v !== null)) {
                console.log(methods.filter.orderBy, "Filter OrderBy", "funcionando");
                const [key, order] = Object.entries(methods.filter.orderBy)[0] as [keyof typeof methods.filter.orderBy, any];
                orders = await (methods.filter.orderBy[key] === 'asc' ? this.db.order.orderBy(key as string).reverse() : this.db.order.orderBy(key as string)).offset((methods.page - 1) * this.#limit).limit(this.#limit).toArray()
            }

            if (methods.filter?.search && Object.values(methods.filter.search).some(v => v !== "" && v !== undefined && v !== 0)) {
                console.log(methods.filter.search, "Filter Search", "funcionando");
                orders = await this.db.order.filter(order => {
                    let array = []

                    if (methods.filter!.search!.fullname) {
                        const client = getClient.get(order.idCl);
                        if (!client || !client.fullname) return false;
                        array.push(client.fullname.startsWith(methods.filter!.search!.fullname!));
                    }

                    if (methods.filter!.search!.dni) {
                        const client = getClient.get(order.idCl);
                        if (!client || !client.dni) return false
                        array.push(client.dni.startsWith(methods.filter!.search!.dni!));
                    }

                    if (methods.filter!.search!.phone) {
                        const client = getClient.get(order.idCl);
                        if (!client || !client.dni) return false
                        if (!client.phone) return false;
                        array.push(client.phone.startsWith(methods.filter!.search!.phone!));
                    }

                    if (methods.filter!.search!.ubigeoCode) {
                        array.push(order.ubigeoCode === methods.filter!.search!.ubigeoCode!);
                    }

                    if (methods.filter?.search?.id) {
                        array.push(order.id === methods.filter.search.id);
                    }

                    return array.some(val => val);

                }).offset((methods.page - 1) * this.#limit).limit(this.#limit).reverse().toArray()
            }

            const mappedOrders = await Promise.all(
                orders.map(async (val) => {
                    const client = await this.db.client.get(val.idCl as any);
                    return {
                        name: client?.fullname || "Desconocido",
                        phone: client?.phone || "No disponible",
                        ...val
                    };
                })
            );
            return mappedOrders;
        } catch (error) {
            throw new Error('Fallo al obtener los productos')
        }
    }

    async getOrderCursor(methods: MethodsOrder): Promise<OrderAll["cursor"]> {
        try {
            let orders = await this.db.order.orderBy('[updateAt+createAt]').count()
            const getClient = new Map((await this.db.client.toArray()).map(val => [val.id, { dni: val.dni, fullname: val.fullname, phone: val.phone }]))

            if (methods.filter && methods.filter.orderBy && Object.values(methods.filter.orderBy).some(v => v !== null)) {
                const [key, order] = Object.entries(methods.filter.orderBy)[0] as [keyof typeof methods.filter.orderBy, any];
                orders = await (methods.filter.orderBy[key] === 'asc' ? this.db.order.orderBy(key as string).reverse() : this.db.order.orderBy(key as string)).count()
            }

            if (methods.filter?.search && Object.values(methods.filter.search).some(v => v !== "" && v !== undefined)) {
                orders = await this.db.order.filter(order => {
                    let array = []

                    if (methods.filter!.search!.fullname) {
                        const client = getClient.get(order.idCl);
                        if (!client || !client.fullname) return false;
                        array.push(client.fullname.startsWith(methods.filter!.search!.fullname!));
                    }

                    if (methods.filter!.search!.dni) {
                        const client = getClient.get(order.idCl);
                        if (!client || !client.dni) return false
                        array.push(client.dni.startsWith(methods.filter!.search!.dni!));
                    }

                    if (methods.filter!.search!.phone) {
                        const client = getClient.get(order.idCl);
                        if (!client || !client.dni) return false
                        if (!client.phone) return false;
                        array.push(client.phone.startsWith(methods.filter!.search!.phone!));
                    }

                    if (methods.filter!.search!.ubigeoCode) {
                        array.push(order.ubigeoCode === methods.filter!.search!.ubigeoCode!);
                    }

                    if (methods.filter?.search?.id) {
                        array.push(order.id === methods.filter.search.id);
                    }

                    return array.some(val => val);

                }).count()
            }


            const limitPage = Math.ceil(orders / this.#limit)

            return {
                limit: limitPage,
                currentPage: methods.page,
                next: methods.page < limitPage
            }
        } catch (error) {
            throw new Error('Fallo al obtener los productos')
        }
    }

    async changeState(id: number, state: StateOrder): Promise<Request<Omit<Order, "idCL"> & { name: string; phone: string; }>> {
        try {
            let data = await this.db.order.get(id as any);
            let message: string

            if (!data) {
                throw new Error(`Order con el id ${id} no encontrado.`);
            }

            if (data.status === 5) {
                throw new Error(`No puedes cambiar el estado de una orden cancelada.`);
            }

            const client = await this.db.client.get(data.idCl as any);
            if (!client) {
                throw new Error(`Cliente con el id ${data.idCl} no encontrado.`);
            }

            let updateAt = new Date().toISOString();

            switch (state) {
                case 'Pendiente':
                    await this.db.order.update(id as any, { status: 0, updateAt: updateAt })
                    message = `Orden con el id ${data.id} cambio a Pediente.`;
                    data = {
                        ...data,
                        status: 0,
                        updateAt: updateAt
                    }
                    break;
                case 'Confirmado':
                    await this.db.order.update(id as any, { status: 1, updateAt: updateAt })
                    message = `Orden con el id ${data.id} cambio a Confirmado.`;
                    data = {
                        ...data,
                        status: 1,
                        updateAt: updateAt
                    }
                    break;
                case 'Preparando':
                    await this.db.order.update(id as any, { status: 2, updateAt: updateAt })
                    message = `Orden con el id ${data.id} cambio a Preparando.`;
                    data = {
                        ...data,
                        status: 2,
                        updateAt: updateAt
                    }
                    break;
                case 'Enviado':
                    await this.db.order.update(id as any, { status: 3, updateAt: updateAt })
                    message = `Orden con el id ${data.id} cambio a Enviado.`;
                    data = {
                        ...data,
                        status: 3,
                        updateAt: updateAt
                    }
                    break;
                case 'Entregado':
                    await this.db.order.update(id as any, { status: 4, updateAt: updateAt })
                    message = `Orden con el id ${data.id} cambio a Entregado.`;
                    data = {
                        ...data,
                        status: 4,
                        updateAt: updateAt
                    }
                    break;
                case 'Cancelado':
                    await this.db.order.update(id as any, { status: 5, updateAt: new Date().toISOString() })
                    const orderItems = await this.db.orderItem.where('idOrder').equals(id).toArray();
                    await Promise.all(orderItems.map(async (val) => {
                        const orderGet = await this.db.orderItem.filter((item) => item.idOrder === id && item.idProduct === val.idProduct).first();
                        if (!orderGet) return;

                        await this.db.product.where('id').equals(val.idProduct).modify((prev) => {
                            prev.quantity += orderGet!.quantity;
                            prev.quantitySold -= orderGet!.quantity;
                            prev.totalCost += prev.cost! * orderGet!.quantity;
                            prev.totalSold -= prev.salePrice! * orderGet!.quantity;
                        });

                    }))
                    message = `Orden con el id ${data.id} cambio a Cancelado.`;
                    data = {
                        ...data,
                        status: 5
                    }
                    await this.db.orderItem.where('idOrder').equals(id).delete();
                    break;
                default:
                    throw new Error(`Estado ${state} no reconocido.`);
            }

            return {
                data: { ...data, name: client.fullname, phone: client.phone || 'No disponible' },
                loading: false,
                success: true,
                message: {
                    type: 'success',
                    text: message,
                    animation: true
                },
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error('Error al editar')
        }
    }

    async getAnalytics(): Promise<Analytics> {
        try {
            const { startOfWeek, endOfWeek, dayNames } = this.dayNowMonthly()

            // #region 📊 Cálculo de ingresos semanales
            const weekTotalAllTime = (await this.db.order
                .where('status')
                .equals(4)
                .toArray())
                .reduce((acc, val) => {
                    const date = new Date(val.createAt);
                    const day = date.getDay();

                    if (!acc[day]) {
                        acc[day] = 0;
                    }
                    acc[day] += val.totalSold;

                    return acc;
                }, {} as Record<number, number>);

            const weekOrders = (await this.db.order
                .where('status')
                .equals(4)
                .filter(val => {
                    const date = new Date(val.createAt);
                    return date >= startOfWeek && date <= endOfWeek;
                })
                .toArray());

            const weekTotal = weekOrders.reduce((acc, val) => {
                const date = new Date(val.createAt);
                const day = date.getDay();

                if (!acc[day]) {
                    acc[day] = 0;
                }
                acc[day] += val.totalSold;

                return acc;
            }, {} as Record<number, number>);

            const chartWeekIcomes = dayNames.map((day, index) => ({
                name: day,
                mount: weekTotal[index] || 0
            }))

            const totalIncomes = Object.values(weekTotalAllTime).reduce((acc, val) => acc + val, 0);

            const chartWeekIcomesPercentege = this.pecentegeChange(weekTotal)
            // #endregion

            // ───📉 Cálculo de gastos semanales ───────────────────────────────────────────────

            // Gastos totales de todos los tiempos agrupados por día
            const weekTotalExpensesAllTime = (await this.db.product.toArray()).reduce((acc, val) => {
                const date = new Date(val.updateAt || val.createAt);
                const day = date.getDay();
                acc[day] = (acc[day] || 0) + val.totalCost;
                return acc;
            }, {} as Record<number, number>);

            // Solo productos creados o actualizados en la semana actual
            const weekExpenses = (await this.db.product
                .filter(val => {
                    const date = new Date(val.updateAt || val.createAt);
                    return date >= startOfWeek && date <= endOfWeek;
                })
                .toArray());

            // Agrupamos los gastos de la semana actual por día
            const weekTotalExpenses = weekExpenses.reduce((acc, val) => {
                const date = new Date(val.updateAt || val.createAt);
                const day = date.getDay();
                acc[day] = (acc[day] || 0) + val.totalCost;
                return acc;
            }, {} as Record<number, number>);

            // Datos para el gráfico semanal de gastos
            const chartWeekExpenses = dayNames.map((day, index) => ({
                name: day,
                mount: weekTotalExpenses[index] || 0
            }));

            // Total de gastos acumulados históricos
            const totalExpenses = Object.values(weekTotalExpensesAllTime).reduce((acc, val) => acc + val, 0);

            // Variación porcentual semanal de gastos
            const chartWeekExpensesPercentege = this.pecentegeChange(weekTotalExpenses);

            // ────────────────────────────────────────────────────────────────────────────────

            // ───📊 BALANCES SEMANALES ──────────────────────────────────────────────────────
            // Órdenes completadas históricas
            const completedOrdersAllTime = await this.db.order.where('status').equals(4).toArray();

            const weekTotalBalancesAllTime = completedOrdersAllTime.reduce((acc, val) => {
                const date = new Date(val.updateAt || val.createAt);
                const day = date.getDay();
                acc[day] = (acc[day] || 0) + (val.totalSold - val.costTotal);
                return acc;
            }, {} as Record<number, number>);

            // Órdenes dentro de la semana actual
            const completedOrdersWeek = await this.db.order
                .where('status')
                .equals(4)
                .filter(val => {
                    const date = new Date(val.updateAt || val.createAt);
                    return date >= startOfWeek && date <= endOfWeek;
                })
                .toArray();

            const weekTotalBalances = completedOrdersWeek.reduce((acc, val) => {
                const date = new Date(val.updateAt || val.createAt);
                const day = date.getDay();
                acc[day] = (acc[day] || 0) + (val.totalSold - val.costTotal);
                return acc;
            }, {} as Record<number, number>);

            // Datos para gráfico
            const chartWeekBalances = dayNames.map((day, index) => ({
                name: day,
                mount: weekTotalBalances[index] || 0
            }));

            // Total histórico acumulado
            const totalBalances = Object.values(weekTotalBalancesAllTime).reduce((acc, val) => acc + val, 0);

            // Variación porcentual de la semana actual
            const chartWeekBalancesPercentege = this.pecentegeChange(weekTotalBalances);

            // ──────────────────────────────────────────────────────────────────────────────

            //Summary

            const products = (await this.db.product.toArray()).reduce((acc, val) => {
                if (!acc.soldTotal || val.quantitySold > acc.soldTotal) {
                    acc.soldTotal = val.quantitySold;
                    acc.category = val.category;
                    acc.name = val.name;
                }

                acc.mountTotal = (acc.mountTotal || 0) + val.quantitySold;

                return acc;
            }, {
                soldTotal: 0,
                mountTotal: 0,
                category: '',
                name: ''
            } as Analytics['summary']);

            const countOrder = await this.db.order.where('status').equals(4).count();


            //Chart Summary

            function formatFullLabel(date: Date) {
                const hour = date.toLocaleTimeString('es-ES', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                const numberDay = date.getDate();
                const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' });
                const month = date.toLocaleDateString('es-ES', { month: 'long' });
                const year = date.getFullYear();
                return {
                    hour,
                    weekday,
                    month,
                    year,
                    numberDay
                }
            }

            const now = new Date();
            const oneDayAgo = new Date(Date.now() - 86400000);
            const oneMonthsAgo = new Date(new Date().setDate(now.getDate() - 30));
            const sixMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 6));
            const oneYearAgo = new Date(new Date().setFullYear(now.getFullYear() - 1));

            const selectedYear = 2023; // dinámico desde UI

            const chartSummary = (await this.db.order.where('status').equals(4).toArray()).reduce((acc, order) => {
                const date = new Date(order.createAt);

                const summary = {
                    income: order.totalSold ?? 0,
                    expenses: order.costTotal ?? 0,
                    balances: (order.totalSold ?? 0) - (order.costTotal ?? 0)
                };

                // Día actual (agrupado por hora)
                if (date > oneDayAgo) {
                    acc.day.push({ ...summary, name: `${formatFullLabel(date).weekday} ${formatFullLabel(date).hour}` });
                }

                // Últimos 30 días
                if (date > oneMonthsAgo) {
                    const existing = acc.rhismonth.find((e) => e.name === `${formatFullLabel(date).weekday} ${formatFullLabel(date).numberDay}`);

                    if (existing) {
                        existing.income += summary.income;
                        existing.expenses += summary.expenses;
                        existing.balances += summary.balances;
                    } else {
                        acc.rhismonth.push({ ...summary, name: `${formatFullLabel(date).weekday} ${formatFullLabel(date).numberDay}` });
                    }
                }

                // Últimos 6 meses
                if (date > sixMonthsAgo) {
                    const existing = acc.sixMonths.find((e) => e.name === formatFullLabel(date).month);

                    if (existing) {
                        existing.income += summary.income;
                        existing.expenses += summary.expenses;
                        existing.balances += summary.balances;
                    } else {
                        acc.sixMonths.push({ ...summary, name: formatFullLabel(date).month });
                    }
                }

                // Últimos 12 meses
                if (date > oneYearAgo) {
                    const existing = acc.oneYear.find((e) => e.name === formatFullLabel(date).year.toString());

                    if (existing) {
                        existing.income += summary.income;
                        existing.expenses += summary.expenses;
                        existing.balances += summary.balances;
                    } else {
                        acc.oneYear.push({ ...summary, name: formatFullLabel(date).year.toString() });
                    }
                }

                // Todo el histórico
                acc.allTime.push({ ...summary, name: formatFullLabel(date).year.toString() });

                // Año seleccionado

                return acc;
            }, {
                day: [],
                sixMonths: [],
                oneYear: [],
                allTime: [],
                byYear: [],
                rhismonth: []
            } as Analytics['chartSummary']);

            //Pie
            const pieData = (await this.db.product.toArray()).reduce((acc, val) => {
                if (!acc.some(item => item.category === val.category)) {
                    acc.push({ category: val.category, value: val.quantitySold });
                } else {
                    const index = acc.findIndex(item => item.category === val.category);
                    acc[index].value += val.quantitySold;
                }
                return acc;
            }, [] as Analytics['pie']);

            const Analytics = {
                chartWeekIncomes: {
                    chart: chartWeekIcomes,
                    total: totalIncomes,
                    percentage: chartWeekIcomesPercentege
                },
                chartWeekExpenses: {
                    chart: chartWeekExpenses,
                    total: totalExpenses,
                    percentage: chartWeekExpensesPercentege
                },
                chartWeekBalances: {
                    chart: chartWeekBalances,
                    total: totalBalances,
                    percentage: chartWeekBalancesPercentege
                },
                summary: { ...products, orderTotal: countOrder },
                chartSummary,
                pie: pieData
            }

            console.log(Analytics, 'observando analíticas');

            return Analytics;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Error al obtener las analíticas');
        }
    }

    private pecentegeChange(weekTotal: Record<number, number>): number {
        const today = new Date();
        const todayDay = today.getDay();
        const yesterdayDay = (todayDay + 6) % 7;

        const todayIncome = weekTotal[todayDay] ?? 0;
        const yesterdayIncome = weekTotal[yesterdayDay] ?? 0;

        const percentageChange = yesterdayIncome === 0
            ? 0 // o puedes manejarlo como "sin datos"
            : ((todayIncome - yesterdayIncome) / yesterdayIncome) * 100;

        return percentageChange;
    }

    private dayNowMonthly() {
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        // Calculamos el inicio (domingo) y fin (sábado) de la semana actual
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);


        return { dayNames, startOfWeek, endOfWeek }

    }
}