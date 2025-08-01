import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("routes/Dasboard/Layout.tsx", [
            index("routes/Dasboard/Analytics/Analytics.tsx", { id: "Analytics" }),
            route("productos", "routes/Dasboard/Products/Products.tsx", { id: "Products" }),
            route("ordenes", "routes/Dasboard/Order/Order.tsx", { id: "Orders" }),
            route("clientes", "routes/Dasboard/Customers/Customers.tsx", { id: "Customers" }),
    ])

    // Agrega un identificador único
] satisfies RouteConfig;