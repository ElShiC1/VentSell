import { useRef } from "react";

export const ImportAndExport = ({ exportDB, importDB }: { exportDB: () => void, importDB: (jsonData: Record<string, unknown[]>) => void }) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const openFilePicker = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const target = event.target as FileReader | null;
            if (target && typeof target.result === "string") {
                const jsonData = JSON.parse(target.result);
                await importDB(jsonData);
                alert("Datos importados correctamente");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-white text-gray-500 text-sm flex gap-5 shadow-lg p-2 border-1 rounded-md border-gray-300 justify-between">
            <div className="hover:text-blue-600 hover:font-semibold cursor-pointer transition-all duration-300" onClick={openFilePicker}>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <span>Importar</span>
            </div>
            <div className="hover:text-blue-600 hover:font-semibold cursor-pointer transition-all duration-300" onClick={exportDB}>
                <span>Exportar</span>
            </div>
        </div>
    )
}