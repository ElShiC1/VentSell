import { useEffect } from "react"

export const TransitionHook = (callback: () => void) => {
    document.startViewTransition(() => {
        callback(); // Ejecutar la función directamente
    });
};