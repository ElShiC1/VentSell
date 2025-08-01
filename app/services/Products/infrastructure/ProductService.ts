import type { EntityTable } from "dexie";
import { ProductClass, type AllProducts, type Category, type Product } from "../domain/Product";
import type { MethodsProducts, Repository, StateProduct } from "../domain/Repository";
import type { User } from "@/services/Auth/domain/Auth";
import type { MethodsPagination } from "@/lib/types/services/Service";
import type { Request } from "@/lib/types/global/Global";
import { set } from "zod/v4";
import type { Order, OrderItem } from "@/services/Order/domain/Order";

export class ProductService implements Repository {

    #Product = new ProductClass();
    #limit = 11

    constructor(private readonly db: EntityTable<Product>, private readonly dbCategory: EntityTable<Category>,private readonly dbOrderItem: EntityTable<OrderItem>) { }
    async getCategory(): Promise<Record<string, string>> {
        try {
            const category = await this.dbCategory.toArray();

            const categoryObject = Object.fromEntries(category.map(c => [c.name, c.name]))
            return categoryObject

        } catch (error) {
            throw new Error('Error al obtener la categoria')
        }
    }

    async changeState(id: number, state: StateProduct): Promise<Request<Product>> {
        try {
            const product = await this.db.where('id').equals(id).first();

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const { status, updateAt, ...data } = product

            let request = {}
            let statusNum: number
            console.log(id, state, 'analisis de aqui')
            switch (state) {
                case 'Activo':
                    const active = await this.db.where('id').equals(id).modify({ status: 1, updateAt: new Date().toISOString() })
                    if (active === 0) throw Error('No se pudo cambiar el estado.')
                    request = {
                        message: {
                            text: `El producto ${id} esta Activo`,
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
                            text: `El producto ${id} esta Inactivo`,
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
                ...request as Request<Product>,
                data: { status: statusNum, updateAt: new Date().toISOString(), ...data }
            }

        } catch (error) {
            throw new Error('Error al cambiar el estado del producto')
        }
    }

    async deleteProducto(id: number): Promise<Request<Product>> {
        try {
            const order = await this.dbOrderItem.where('idProduct').equals(id).first()

            if(order){
                throw new Error('Ya está asignado a una orden el Producto')
            }

            const product = await this.db.where('id').equals(id).first();

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const deleted = await this.db.where('id').equals(id).delete();

            if (deleted === 0) {
                throw new Error('No se pudo eliminar el producto');
            }

            return {
                message: {
                    text: `Producto ${id} eliminado correctamente`,
                    type: 'success',
                    animation: true
                },
                success: true,
                loading: false,
                data: product
            }
        } catch (error) {
            if(error instanceof Error){
                throw new Error(error.message)
            }

            throw new Error('Error al eliminar el producto');
        }
    }

    async updateProducto({ updateAt, id, ...data }: Partial<Product>): Promise<Request<Product>> {
        try {
            const product = await this.db.where('id').equals(id!).first();

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            const category = await this.dbCategory.where('name').equals(data.category!).first()

            if (!category) {
                await this.dbCategory.add({ createAt: new Date().toISOString(), updateAt: new Date().toISOString(), name: data.category!, count: 0 })
            }

            if (data.category !== product?.category) {
                await this.dbCategory.where('name').equals(product?.category).modify(({ count, ...prev }, ref) => {
                    ref.value = {
                        count: count - 1,
                        ...prev,
                    }
                    return true;
                })

                await this.dbCategory.where('name').equals(data?.category!).modify(({ count, ...prev }, ref) => {
                    ref.value = {
                        count: count + 1,
                        ...prev,
                    }
                    return true;
                })
            }



            const productModified = {
                ...product,
                ...data,
                updateAt: new Date().toISOString()
            }

            const update = await this.db.where('id').equals(id!).modify((prev, ref) => {
                ref.value = {
                    ...prev,
                    ...productModified,
                    totalCost: (productModified.quantity * (productModified.cost || 0 )),
                }
                return true;
            })
            console.log('pasa aqui o no?', update)
            if (update === 0) {
                throw new Error('No se pudo actualizar el producto');
            }

            return {
                message: {
                    text: `Producto ${id} actualizado correctamente`,
                    type: 'success',
                    animation: true
                },
                success: true,
                loading: false,
                data: productModified
            }

        } catch (error) {
            console.log(error, "Error updating product");
            throw new Error('Error al actualizar el producto');
        }
    }

    async getProducto(id: number): Promise<Request<Product>> {
        try {
            console.log(id, 'por que mrd no funciona diganme weones')
            const product = await this.db.where('id').equals(id).first();

            if (!product) {
                console.log('que paso aqui no pasa o que')
                throw new Error('Producto no encontrado');
            }

            return {
                message: {
                    text: `Producto ${id} encontrado correctamente`,
                    type: 'success',
                    animation: true
                },
                success: true,
                loading: false,
                data: product
            }
        } catch (error) {
            console.log(error)
            throw new Error('Error al obtener el producto');
        }
    }

    async setProducto({ createAt, updateAt, totalCost, totalSold, category, ...data }: Product): Promise<Request<Product>> {
        try {
            const existCategory = await this.dbCategory.where('name').equals(category).first()

            if (!existCategory) {
                await this.dbCategory.add({ createAt: new Date().toISOString(), updateAt: new Date().toISOString(), name: category, count: 0 })
            }

            const id = await this.db.add({ ...data, category, createAt: new Date().toISOString(), updateAt: new Date().toISOString(), status: 1, totalCost: data.quantity * (data.cost || 0), totalSold: 0, quantitySold: 0 });
            await this.dbCategory.where('name').equals(category).modify(({ count, ...prev }, ref) => {
                ref.value = {
                    count: count + 1,
                    ...prev,
                }
                return true;
            })
            const product = await this.db.get(id);

            return {
                message: {
                    text: `Producto ${id} insertado correctamente`,
                    type: 'success',
                    animation: true
                },
                success: true,
                loading: false,
                data: product
            }
        } catch (error) {
            throw new Error('Error al insertar el producto');
        }
    }

    async getProductsInitial(methods: MethodsProducts): Promise<AllProducts['cursor']> {
        try {
            let products = await this.db.orderBy('[updateAt+createAt]').reverse().count()
            console.log(methods, 'me pregunto aqui que pasa')
            if (methods.filter && methods.filter.orderBy && Object.values(methods.filter.orderBy).some(v => v !== null)) {
                const [key, order] = Object.entries(methods.filter.orderBy)[0] as [keyof typeof methods.filter.orderBy, any];
                products = await (methods.filter.orderBy[key] === 'asc' ? this.db.orderBy(key as string).reverse() : this.db.orderBy(key as string)).count()
            }

            if (methods.filter && methods.filter.search && methods.filter.search.name) {
                products = await this.db.where('name').startsWith(methods.filter.search.name!).count()
            }

            if (methods.filter && methods.filter.search && methods.filter.search.category) {
                products = await this.db.where('category').equals(methods.filter.search.category!).count()
            }

            return this.#Product.getCursor({ totalProducts: products, limit: this.#limit }, methods.page)
        } catch (error) {
            throw new Error('Fallo al obtener los productos')
        }
    }

    async getProducts(methods: MethodsProducts): Promise<AllProducts['products']> {
        try {
            let products = await this.db.orderBy('[updateAt+createAt]').reverse().offset((methods.page - 1) * this.#limit).limit(this.#limit).toArray()


            if (methods.filter && methods.filter.orderBy && Object.values(methods.filter.orderBy).some(v => v !== null)) {
                const [key, order] = Object.entries(methods.filter.orderBy)[0] as [keyof typeof methods.filter.orderBy, any];
                products = await (methods.filter.orderBy[key] === 'asc' ? this.db.orderBy(key as string).reverse() : this.db.orderBy(key as string)).offset((methods.page - 1) * this.#limit).limit(this.#limit).toArray()
            }

            if (methods.filter && methods.filter.search && methods.filter.search.name) {
                products = await this.db.where('name').startsWith(methods.filter.search.name!).offset((methods.page - 1) * this.#limit).limit(this.#limit).toArray()
            }

            if (methods.filter && methods.filter.search && methods.filter.search.category) {
                products = await this.db.where('category').equals(methods.filter.search.category!).offset((methods.page - 1) * this.#limit).limit(this.#limit).toArray()
            }

            const getall = this.#Product.getAllProducts(products)
            return getall
        } catch (error) {
            throw new Error('Fallo al obtener los productos')
        }
    }

}