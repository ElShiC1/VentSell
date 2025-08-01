import type { EntityTable } from "dexie"
import { ClientDomain, type AllClient, type Client, type ClientMore } from "../domain/Client"
import type { MethodsClients, Repository, StateClient } from "../domain/Repository"
import type { Request, Cursor } from "@/lib/types/global/Global"
import type { Order } from "@/services/Order/domain/Order"

export class ClientService implements Repository {
    #limit = 11
    #client = new ClientDomain()

    constructor(private readonly db: EntityTable<Client>, readonly dbOrder: EntityTable<Order>) { }

    async postClient({ createAt, updateAt, orderUlt, status, ...data }: Client): Promise<Request<ClientMore>> {
        try {
            const { id, ...more } = data

            const [dniExist, phoneExist] = await Promise.all([
                data.dni && this.db.where('dni').equals(data.dni).first(),
                data.phone && this.db.where('phone').equals(data.phone).first(),
            ]);

            if (dniExist) {
                throw new Error('El DNI ya está registrado.', {
                    cause: {
                        status: 500,
                        code: 'DUPLICATE_DNI'
                    }
                });
            }

            if (phoneExist) {
                throw new Error('El teléfono ya está registrado.', {
                    cause: {
                        status: 500,
                        code: 'DUPLICATE_PHONE'
                    }
                });
            }

            const idNew = await this.db.add({ status: 1, createAt: new Date().toISOString(), updateAt: new Date().toISOString(), orderUlt: new Date().toISOString(), ...data, quantitySold: 0, totalCost: 0 })

            return {
                loading: false,
                success: true,
                message: {
                    type: 'success',
                    text: `Cliente creado exitosamente con el ${idNew}`,
                    animation: true
                },
                data: { status: 1, id: idNew, ...more, createAt: new Date().toISOString(), updateAt: new Date().toISOString(), orderUlt: new Date().toISOString() }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error('Error al crear el cliente')
        }
    }

    async updateClient({ id, updateAt, orderUlt, ...data }: Partial<Client>): Promise<Request<ClientMore>> {
        try {
            const client = await this.db.where('id').equals(id!).first()

            if (!client) {
                throw new Error(`Cliente con el id ${id} no existe`)
            }

            const update = await this.db.where('id').equals(id!).modify({ updateAt: new Date().toISOString(), ...data })

            if (update === 0) {
                throw new Error('Error al actualizar el cliente.')
            }

            return {
                loading: false,
                success: true,
                message: {
                    type: 'success',
                    text: `Cliente actualizado exitosamente con el ${id}`,
                    animation: true
                },
                data: {
                    ...client,
                    ...data,
                    updateAt: new Date().toISOString(),
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error('Error al editar')
        }
    }

    async getClient(id: number): Promise<Request<ClientMore>> {
        try {
            const client = await this.db.where('id').equals(id).first()
            console.log(client, 'entro weon')
            if (!client) {
                throw new Error(`Cliente con el id ${id} no existe`)
            }

            return {
                loading: false,
                success: true,
                message: {
                    type: 'success',
                    text: `Cliente creado exitosamente con el ${id}`,
                    animation: true
                },
                data: { ...client }
            }
        } catch (error) {

            throw new Error("Error al crear el Cliente")
        }
    }

    async deleteClient(id: number): Promise<Request<ClientMore>> {
        try {

            const orderExist = await this.dbOrder.where('idCl').equals(id).first()

            if (orderExist) {
                throw new Error('Ya está asignado a una orden el Cliente')
            }

            const client = await this.db.where('id').equals(id!).first()

            if (!client) {
                throw new Error(`Cliente con el id ${id} no existe`)
            }

            const deleted = await this.db.where('id').equals(id!).delete()

            if (deleted === 0) {
                throw new Error('Error al eliminar')
            }

            return {
                loading: false,
                success: true,
                message: {
                    type: 'success',
                    text: `Cliente eliminado exitosamente con el id ${id}`,
                    animation: true
                },
                data: { ...client }
            }
        } catch (error) {
            console.log(error, 'wefi qijqwijrqrij')
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error(`Error al eliminar id ${id}`)
        }
    }

    getStatus(): Promise<Record<string, string>> {
        throw new Error("Method not implemented.")
    }

    async getClientInitial(methods: MethodsClients): Promise<AllClient['cursor']> {
        try {
            let clients = await this.db.orderBy('[updateAt+createAt+orderUlt]').reverse().offset((methods.page - 1) * this.#limit).limit(this.#limit).count()

            if (methods.filter && methods.filter.orderBy && Object.values(methods.filter.orderBy).some(v => v !== null)) {
                const [key, order] = Object.entries(methods.filter.orderBy)[0] as [keyof typeof methods.filter.orderBy, any];
                clients = await (methods.filter.orderBy[key] === 'asc' ? this.db.orderBy(key as string).reverse() : this.db.orderBy(key as string)).offset((methods.page - 1) * this.#limit).limit(this.#limit).count()
            }

            if (methods.filter?.search && Object.values(methods.filter.search).some(v => v !== null)) {
                console.log('testeando')
                const searchFields = methods.filter.search;
                const [key] = Object.entries(searchFields)[0] || [];

                if (key && key in searchFields) {
                    const searchKey = key as keyof typeof searchFields;
                    const searchValue = searchFields[searchKey];

                    if (typeof searchValue === 'string') {
                        clients = await this.db
                            .where(searchKey)
                            .startsWith(searchValue)
                            .offset((methods.page - 1) * this.#limit)
                            .limit(this.#limit)
                            .count()
                    }

                    if (typeof searchValue === 'number') {
                        clients = await this.db
                            .where(searchKey)
                            .equals(searchValue)
                            .offset((methods.page - 1) * this.#limit)
                            .limit(this.#limit)
                            .count()
                    }
                }
            }

            return this.#client.getCursor({ totalClients: clients, limit: this.#limit }, methods.page)
        } catch (error) {
            throw new Error('Error al obtener clientes.')
        }
    }

    async getClients(methods: MethodsClients): Promise<AllClient["clients"]> {
        try {
            let clients = await this.db.orderBy('[updateAt+createAt+orderUlt]').reverse().offset((methods.page - 1) * this.#limit).limit(this.#limit).toArray()

            if (methods.filter && methods.filter.orderBy && Object.values(methods.filter.orderBy).some(v => v !== null)) {
                console.log("esta ejecutando esto? filter")
                const [key, order] = Object.entries(methods.filter.orderBy)[0] as [keyof typeof methods.filter.orderBy, any];
                clients = await (methods.filter.orderBy[key] === 'asc' ? this.db.orderBy(key as string).reverse() : this.db.orderBy(key as string)).offset((methods.page - 1) * this.#limit).limit(this.#limit).toArray()
            }

            if (methods.filter?.search && Object.values(methods.filter.search).some(v => v !== "" && v !== undefined)) {
                const searchTerms = methods.filter.search;
                console.log(methods.filter.search, "test search")
                clients = await this.db.filter(val => {
                    // Verificamos todos los campos de búsqueda relevantes
                    const matches = [];

                    if (searchTerms.dni && val.dni) {
                        matches.push(val.dni.startsWith(searchTerms.dni));
                    }

                    if (searchTerms.fullname && val.fullname) {
                        matches.push(val.fullname.toLowerCase().startsWith(searchTerms.fullname.toLowerCase()));
                    }

                    if (searchTerms.tipoID && val.tipoID) {
                        matches.push(val.tipoID.startsWith(searchTerms.tipoID));
                    }

                    if (searchTerms.phone && val.phone) {
                        matches.push(val.phone.toLowerCase().startsWith(searchTerms.phone.toLowerCase()));
                    }

                    // Devuelve true si al menos un campo coincide (OR)
                    // Para búsqueda AND: return matches.length > 0 && !matches.includes(false)
                    return matches.some(match => match);
                })
                    .offset((methods.page - 1) * this.#limit)
                    .limit(this.#limit)
                    .toArray();
            }

            const getall = this.#client.getAllClients(clients)
            console.log(getall, 'getall')
            return getall
        } catch (error) {
            throw new Error('Error al obtener clientes.')
        }

    }

    async changeState(id: number, state: StateClient): Promise<Request<ClientMore>> {
        try {
            const product = await this.db.where('id').equals(id).first();

            if (!product) {
                throw new Error('Cliente no encontrado');
            }

            const { status, updateAt, ...data } = product

            let request = {}
            let statusNum: number
            switch (state) {
                case 'Prioritario':
                    const Prioritario = await this.db.where('id').equals(id).modify({ status: 3, updateAt: new Date().toISOString() })
                    if (Prioritario === 0) throw Error('No se pudo cambiar el estado.')
                    request = {
                        message: {
                            text: `Cliente ${id} estado Prioritario`,
                            type: 'success',
                            animation: true
                        },
                        success: true,
                        loading: false,
                    }
                    statusNum = 1
                    console.log('paso aaqui', 'whtt')
                    break;
                case 'Frecuente':
                    const Frecuente = await this.db.where('id').equals(id).modify({ status: 2, updateAt: new Date().toISOString() })
                    if (Frecuente === 0) throw Error('No se pudo cambiar el estado.')
                    request = {
                        message: {
                            text: `Cliente ${id} estado Frecuente`,
                            type: 'success',
                            animation: true
                        },
                        success: true,
                        loading: false,
                    }
                    statusNum = 1
                    console.log('paso aaqui', 'whtt')
                    break;
                case 'Activo':
                    const active = await this.db.where('id').equals(id).modify({ status: 1, updateAt: new Date().toISOString() })
                    if (active === 0) throw Error('No se pudo cambiar el estado.')
                    request = {
                        message: {
                            text: `Cliente ${id} estado Activo`,
                            type: 'success',
                            animation: true
                        },
                        success: true,
                        loading: false,
                    }
                    statusNum = 1
                    console.log('paso aaqui', 'whtt')
                    break;
                case 'Inactivo':
                    const inactive = await this.db.where('id').equals(id).modify({ status: 0, updateAt: new Date().toISOString() })
                    if (inactive === 0) throw Error('No se pudo cambiar el estado.')
                    request = {
                        message: {
                            text: `Cliente ${id} estado Inactivo`,
                            type: 'success',
                            animation: true
                        },
                        success: true,
                        loading: false,
                    }
                    statusNum = 0
                    console.log('paso aaqui', 'whtt')
                    break
                default:
                    throw new Error('Estado invalido.')

            }



            return {
                ...request as Request<ClientMore>,
                data: { status: statusNum, updateAt: new Date().toISOString(), ...data }
            }

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message)
            }
            throw new Error('Error al editar')
        }
    }
}