import { NavLink } from "react-router"
import { Pagination } from "../pagination/Pagination"

export const Table = ({ children, limit, currentPage }: { children: React.ReactNode, limit: number, currentPage: number }) => {
    console.log(limit, currentPage, 'Table component')
    
    return (
        <div className="col-span-full row-span-9 bg-white rounded-xl p-5 flex flex-col shadow-sm">
            <div className="flex-15 rounded-tl-lg rounded-tr-lg">
                <table className="table-fixed w-full">
                    {children}
                </table>
            </div>
            {limit !== 1 && <Pagination currentPage={currentPage} limit={limit} />}
        </div >
    )
}