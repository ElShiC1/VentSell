import { InpuTypes } from "@/components/atoms/Input";
import type { OrderItem } from "@/services/Order/domain/Order";
import type { Product } from "@/services/Products/domain/Product";
import { VentSellDb } from "@/services/shared/VentSellDb";
import { useState } from "react";

type InputProductsProps = {
    products: Product[];
    addItem: (item: Pick<OrderItem, 'idProduct' | 'quantity' | 'salePrice'>) => void;
    className?: string;
};

export const InputProducts = ({
    products,
    addItem,
    className = ''
}: InputProductsProps) => {
    const getProducts = VentSellDb.Product.ProductGetMethods((state) => state.getProducts);
    const filter = VentSellDb.Product.ProductGetMethods((state) => state.filter);

    return (
        <InpuTypes.InputSelect
            label="Producto"
            placeholder="Selecionar Producto"
            id="product"
            value={filter?.search?.name ?? ""}
            onChange={(e) => {
                console.log(e, 'prueba de escribir')
                getProducts({ page: 1, filter: { search: { name: e.product } } })
            }}
            className={className}>
            {products.map((product) => (
                <div
                    key={product.id}
                    onClick={async (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        await addItem({
                            idProduct: product.id,
                            quantity: 1,
                            salePrice: product.salePrice
                        });
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0 group"
                    role="button"
                    aria-label={`Agregar ${product.name} al carrito`}
                >
                    {/* Imagen del producto con loading lazy */}
                    {product.imgThumb && (
                        <div className="relative flex-shrink-0">
                            <img
                                src={product.imgThumb as string}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md border border-gray-200"
                                loading="lazy"
                                width={48}
                                height={48}
                            />
                            <div className="absolute inset-0 rounded-md ring-1 ring-inset ring-gray-200 pointer-events-none" />
                        </div>
                    )}

                    {/* Contenido textual */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                            <h3 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                                {product.name}
                            </h3>
                            <span className="text-sm font-semibold text-primary-600 whitespace-nowrap">
                                S/{product.salePrice.toFixed(2)}
                            </span>
                        </div>

                        {/* Badges de categoría y cantidad */}
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full inline-flex items-center">
                                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm3-1a1 1 0 11-2 0 1 1 0 012 0zm3 1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                {product.category}
                            </span>

                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full inline-flex items-center">
                                <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                                </svg>
                                {product.quantity} en stock
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </InpuTypes.InputSelect>
    );
};