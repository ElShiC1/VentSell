import React, { useEffect, useState } from "react"

export const useMargin = (cost: number = 0, price: number = 0, fuc?: (val: any) => void) => {
    const [val, setVal] = useState({
        margin: `%0`,
        price: `S/${price}`,
        cost: `S/${cost}`
    })

    useEffect(() => {
        calculate()
    }, [])


    const calculate = () => {

        const rawValuePrice = Number(val.price.replace('S/', ""))
        const rawValueCost = Number(val.cost.replace('S/', "")) || 0

        const newMargin = rawValueCost !== 0 ? rawValuePrice > 0
            ? ((rawValuePrice - rawValueCost) / rawValuePrice) * 100
            : 0 : 0

        setVal(val => {
            
            return {
                ...val,
                margin: `%${newMargin}`
            }
        })
    }

    const changeMargin = (inputValue: string) => {
        const rawValue = inputValue.replace('%', '');

        if (!/^\d*(\.\d{0,2})?$/.test(rawValue)) return;

        let processedValue = rawValue;

        // Caso especial: reemplazar "0" inicial
        if (val.price === "%0" && rawValue.length === 1 && rawValue !== "0" && rawValue !== ".") {
            processedValue = rawValue; // Reemplazo directo ("0" → "5")
        }
        // Eliminar ceros no significativos (ej: "05" → "5")
        else if (rawValue.startsWith("0") && rawValue.length > 1 && !rawValue.startsWith("0.")) {
            processedValue = rawValue.replace(/^0+/, '');
            if (processedValue === "" || processedValue === ".") {
                processedValue = "0" + processedValue;
            }
        }
        // Campo vacío → "0"
        else if (rawValue === "") {
            processedValue = "0";
        }



        const costReal = Number(val.cost.replace('S/', "")) === 0

        setVal((val) => ({
            ...val,
            margin: costReal ? '%0' : `%${processedValue}`,
            price: costReal ? val.price : `S/${(Number(val.cost.replace('S/', "")) / (1 - Number(rawValue) / 100)).toFixed(2)}`
        }))
    }

    const isValidDecimal = (val: string) => /^\d*\.?\d*$/.test(val); // Permite números vacíos temporalmente

    const changePrice = (inputValue: string) => {
        // Eliminar "S/" temporalmente para el procesamiento
        const rawValue = inputValue.replace('S/', '');

        // 1. Validar que sea un número decimal válido
        if (!/^\d*(\.\d{0,2})?$/.test(rawValue)) return;

        // 2. Determinar el valor procesado
        let processedValue = rawValue;

        // Caso especial: reemplazar "0" inicial
        if (val.price === "S/0" && rawValue.length === 1 && rawValue !== "0" && rawValue !== ".") {
            processedValue = rawValue; // Reemplazo directo ("0" → "5")
        }
        // Eliminar ceros no significativos (ej: "05" → "5")
        else if (rawValue.startsWith("0") && rawValue.length > 1 && !rawValue.startsWith("0.")) {
            processedValue = rawValue.replace(/^0+/, '');
            if (processedValue === "" || processedValue === ".") {
                processedValue = "0" + processedValue;
            }
        }
        // Campo vacío → "0"
        else if (rawValue === "") {
            processedValue = "0";
        }

        // 3. Cálculos numéricos (usamos el valor sin formato)
        const numericValue = processedValue === "0" ? 0 : parseFloat(processedValue);
        const safeCost = Number(val.cost.replace("S/", "")) || 0;

        const newMargin = safeCost !== 0 ? numericValue > 0
            ? ((numericValue - safeCost) / numericValue) * 100
            : 0 : 0

        // 4. Actualizar estado con formato "S/"
        setVal(prev => ({
            ...prev,
            price: `S/${processedValue}`,
            margin: `%${newMargin.toFixed(2)}`
        }));
    };


    const changeCost = (inputValue: string) => {
        const rawValue = inputValue.replace('S/', '');

        // 1. Validar que sea un número decimal válido
        if (!/^\d*(\.\d{0,2})?$/.test(rawValue)) return;

        // 2. Determinar el valor procesado
        let processedValue = rawValue;

        // Caso especial: reemplazar "0" inicial
        if (val.price === "S/0" && rawValue.length === 1 && rawValue !== "0" && rawValue !== ".") {
            processedValue = rawValue; // Reemplazo directo ("0" → "5")
        }
        // Eliminar ceros no significativos (ej: "05" → "5")
        else if (rawValue.startsWith("0") && rawValue.length > 1 && !rawValue.startsWith("0.")) {
            processedValue = rawValue.replace(/^0+/, '');
            if (processedValue === "" || processedValue === ".") {
                processedValue = "0" + processedValue;
            }
        }
        // Campo vacío → "0"
        else if (rawValue === "") {
            processedValue = "0";
        }

        // 3. Cálculos numéricos (usamos el valor sin formato)
        const numericValue = processedValue === "0" ? 0 : parseFloat(processedValue);
        const safeCost = Number(val.price.replace("S/", "")) || 0;

        const newMargin = safeCost !== 0 ? numericValue > 0
            ? ((safeCost - numericValue) / safeCost) * 100
            : 0 : 0

        // 4. Actualizar estado con formato "S/"
        setVal(prev => ({
            ...prev,
            cost: `S/${processedValue}`,
            margin: `%${newMargin.toFixed(2)}`
        }));
    }


    return {
        changeCost,
        changePrice,
        changeMargin,
        val
    }
}