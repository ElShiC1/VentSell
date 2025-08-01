import type { Item, OrderItem } from "@/services/Order/domain/Order"



export const CardItems = (props: Item) => {
    return (
        <div className="p-4 bg-white rounded-lg flex gap-5 items-center">
            <img src="https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/d6202f062d4659943ebf353d99e4c219.jpg" className="size-15 rounded-lg" />
            <div id="datail-item" className="flex flex-col">
                <span id="name" className="text-sm font-semibold">{props.name}</span>
                <span id="price" className="">{props.salePrice}</span>
            </div>
            <span>X</span>
            <div>
                <span>-</span>
                <span>1</span>
                <span>+</span>
            </div>
            <span id="priceTotal" className="flex-auto text-end text-l font-bold text-gray-600 flex flex-col leading-5">
                <span>Total</span>
                <span>S/1200.00</span>
            </span>
        </div>
    )
}