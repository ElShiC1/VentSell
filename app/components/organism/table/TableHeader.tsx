export const TableHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <thead className="text-justify text-sm ">
            <tr className="bg-blue-500 text-white ">
                {children}
            </tr>
        </thead>
    )
}