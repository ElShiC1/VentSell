import { InpuTypes } from "@/components/atoms/Input"
import { useMargin } from "@/lib/hooks/useMargin"

export const MountPrice = ({ pricing = 0, costs = 0, func }: { pricing?: number , costs?: number, func: (val: any) => void }) => {
    const { changeCost, changeMargin, changePrice, val: { margin, cost, price } } = useMargin(pricing, costs)

    const test = (a: any, funt: any) => {
        const key = Object.keys(a)[0]
        func(a)
        funt(a[key])
    }

    return (
        <div className="flex gap-5">
            <InpuTypes.text onChange={(e) => test(e, changeCost)} value={cost} id="cost" label="Costo" placeholder="El Zapato" type="text" autoComplete="false" />
            <InpuTypes.text onChange={(e) => test(e, changeMargin)} value={margin} id="margin" label="Margen" placeholder="El Zapato" type="text" autoComplete="false" />
            <InpuTypes.text onChange={(e) => test(e, changePrice)} value={price} id="salePrice" label="Precio Venta" placeholder="El Zapato" type="text" autoComplete="false" />
        </div>
    )

}