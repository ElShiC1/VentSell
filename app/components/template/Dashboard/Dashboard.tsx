export const TPDashboard = ({ children, title }: { children: React.ReactNode, title: string }) => {
    return (
        <main className="grid grid-cols-4 grid-rows-[1.5rem_repeat(10,1fr)] w-full h-full gap-5 relative">
            {/* Cabecera DELGADA con altura fija */}
            <div className="col-span-4 rounded-sm flex items-center justify-start">
                <span className="truncate text-xl font-semibold">{title}</span>
            </div>
            {children}
        </main>
    )
}
