import { Link } from "react-router"

interface Summary {
    mountTotal: number,
    orderTotal: number,
    product: {
        name: string,
        category: string,
        soldTotal: number
    }
}

export const Summary = (props: Summary) => {


    return (
        <div className="row-span-5 bg-white rounded-xl shadow-xs p-5 flex flex-col gap-2">
            <h2 className="text-lg text-gray-500 font-semibold">Resumen Final</h2>
            <div id="resumen" className="flex flex-wrap gap-2 h-full">
                <div className="p-2 flex-1/4 flex flex-col rounded-lg justify-center bg-blue-50 border border-blue-200 shadow-sm">
                    <span className="text-sm text-blue-500">Productos Vendidos</span>
                    <span className="text-2xl font-bold text-blue-500">{props.mountTotal}</span>
                </div>

                <div className="p-2 flex-1/4 flex flex-col rounded-lg justify-center bg-blue-50 border border-blue-200 shadow-sm">
                    <span className="text-sm text-blue-500">Ordenes Totales</span>
                    <span className="text-2xl font-bold text-blue-500">
                        {props.orderTotal}
                    </span>
                </div>

                <div className="p-2 flex-2/4 flex flex-col rounded-lg justify-center bg-blue-50 border border-blue-200 shadow-sm">
                    <span className="text-sm text-blue-500">Producto mas Vendido</span>
                    <span className="text-2xl font-bold text-blue-500">{props.product.name}</span>
                    <span className="text-sm text-blue-500">Categoria {props.product.category} - Vendidos {props.product.soldTotal}</span>
                </div>
            </div>
        </div>
    )

}