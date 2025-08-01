import React from "react";
import { NavLink } from "react-router";

export const Pagination = ({ limit, currentPage }: { limit: number, currentPage: number }) => {
    const getPages = () => {
        const pages: (number | string)[] = [];
        if (limit <= 7) {
            // Si hay pocas páginas, muéstralas todas
            for (let i = 1; i <= limit; i++) pages.push(i);
        } else {
            // Siempre muestra la primera página
            pages.push(1);

            // Si currentPage está lejos del inicio, muestra ...
            if (currentPage > 4) pages.push("...");

            // Páginas alrededor del currentPage
            let start = Math.max(2, currentPage - 3);
            let end = Math.min(limit - 1, currentPage + 3);
            console.log({ start, end, currentPage, limit });
            // Ajusta para los extremos
            if (currentPage <= 4) {
                start = 2;
                end = 4;
            }
            if (currentPage >= limit - 3) {
                start = limit - 3;
                end = limit - 1;
            }

            for (let i = start; i <= end; i++) {
                if (i > 1 && i < limit) pages.push(i);
            }

            // Si currentPage está lejos del final, muestra ...
            if (currentPage < limit - 3) pages.push("...");

            // Siempre muestra la última página
            pages.push(limit);
        }
        return pages;
    };

    const pages = getPages();

    return (
        <div className="flex-1 flex justify-center items-center gap-2">
            {pages.map((page, idx) =>
                typeof page === "number" ? (
                    <NavLink to={`?page=${page}`} className="no-underline" key={page}>
                        <div
                            key={page}
                            className={`page w-8 h-8 flex items-center justify-center rounded-4xl font-semibold ${page === currentPage
                                ? "bg-blue-500 text-white"
                                : "bg-blue-300 text-gray-700"
                                }`}
                        >
                            {page}
                        </div>
                    </NavLink>

                ) : (
                    <div key={`dots-${idx}`} className="page w-8 h-8 flex items-center justify-center text-gray-400">
                        ...
                    </div>
                )
            )}
        </div>
    );
};