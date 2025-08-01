import { useEffect, useState } from "react"
import { useNavigate } from "react-router";


export const FormStep = ({ element, index = 0, stepForm }: { element: React.ReactElement[], index: number, stepForm: boolean[] }) => {
    const [page, setPage] = useState(index);
    const navigate = useNavigate()

    useEffect(() => {
        if (index === 0) {
            setPage(0);
            return;
        }

        // Verifica si el paso anterior está completado
        if (stepForm[index - 1]) {
            setPage(index);
        } else {
            setPage(0); // Solo se ejecuta si stepForm[index - 1] es false
        }
    }, [index, stepForm]); // ¡Añade stepForm a las dependencias!

    const nextPage = () => {
        setPage(i => {
            if (i >= element.length - 1) return i;
            return i + 1;
        });
    };

    const backPage = () => {
        setPage(i => {
            if (i <= 0) return i;
            return i - 1;
        });
    };

    function goTo(index: number) {
        setPage(index);
    }

    return {
        page,
        backPage,
        nextPage,
        goTo,
        step: element[page],
        next: page === element.length,
    };
};
