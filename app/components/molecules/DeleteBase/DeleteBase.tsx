export const DeleteBase = ({deleteBase}: {deleteBase: () => void}) => {

    return (
        <div onClick={() => {
            const request = window.confirm("¿Estás seguro de que deseas eliminar la base de datos? Esta acción no se puede deshacer.")
            if (!request) return;            
            deleteBase()
            alert("Base de datos eliminada correctamente");
        }} className="cursor-pointer bg-white group text-gray-500 text-sm flex gap-5 shadow-lg p-2 border-1 rounded-md border-gray-300 justify-between hover:bg-red-500 transition-all">
            <span className="text-center w-full group-hover:text-white group-hover:font-semibold">🗑 Base de datos</span>
        </div>
    )

}