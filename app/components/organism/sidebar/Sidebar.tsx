import { DashboardIcon } from "@/components/atoms/Icons/DashboardNav"
import { DeleteBase } from "@/components/molecules/DeleteBase/DeleteBase"
import { ImportAndExport } from "@/components/molecules/ImportAndExport/ImportAndExport"

export const SideBar = ({ logo, exportDB, importDB, deleteBase }: { logo: string, exportDB: () => void, importDB: (jsonData: Record<string, unknown[]>) => void, deleteBase: () => void }) => {
    return (
        <nav className="h-full w-1/10 bg-white p-4 rounded-lg flex flex-col">
            <div className="flex flex-col h-full">
                <div className="logo mb-8 w-[48px] h-[48px]">
                    <img className="" src={logo} alt="" />
                </div>
                <div id="nav-links" className="flex flex-col gap-3">
                    <DashboardIcon.Analytics title="Analisís" className="" />
                    <DashboardIcon.Orders title="Ordenes" className="" />
                    <DashboardIcon.Products title="Productos" className="" />
                    <DashboardIcon.Customers title="Clientes" className="" />
                </div>
            </div>
            <div id="settings" className="flex flex-col gap-3">
                <ImportAndExport exportDB={exportDB} importDB={importDB} />
                <DeleteBase deleteBase={deleteBase} />
            </div>
        </nav>
    )
}