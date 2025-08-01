import { NSIcons } from "@/components/atoms/Icons/NSIcons";

interface Options {
    value: string,
    color: 'red' | 'green' | 'blue' | 'orange' | 'black' | 'purple',
    onclick: () => void
}

const colorVariants: Record<Options['color'], { text: string, hoverText: string, bg: string }> = {
    red: {
        text: "text-red-500",
        hoverText: "hover:text-red-700",
        bg: "bg-red-100",
    },
    blue: {
        text: "text-blue-500",
        hoverText: "hover:text-blue-700",
        bg: "bg-blue-100",
    },
    green: {
        text: "text-green-500",
        hoverText: "hover:text-green-700",
        bg: "bg-green-100",
    },
    orange: {
        text: "text-orange-500",
        hoverText: "hover:text-orange-700",
        bg: "bg-orange-100",
    },
    black: {
        text: "text-gray-500",
        hoverText: "hover:text-black",
        bg: "bg-gray-100",
    },
    purple: {
        text: "text-purple-500",
        hoverText: "hover:text-purple-700",
        bg: "bg-purple-100",
    }
};



export const DataCell = {
    Options: ({ status, options }: { status?: number, options: Options[] }) => {
        return (
            <td className="p-[7px] text-gray-500 cursor-pointer hover:text-black relative group">
                {status !== undefined ? <span className={`${colorVariants[options[status].color].bg} p-2 rounded-2xl ${colorVariants[options[status].color].text} font-semibold`}>{options[status].value}</span> : <NSIcons.MenuMore className="h-10 w-10 object-contain translate-x-[-20px] " />}
                <div className="absolute top-[85%] right-0 hidden group-hover:block bg-white shadow-xl rounded-md p-2 z-10 min-w-[120px]">
                    {options.map((val) => (
                        <div onClick={val.onclick} className={`hover:bg-gray-100 px-2 py-1 font-semibold rounded cursor-pointer ${colorVariants[val.color].text} ${colorVariants[val.color].hoverText}`}>{val.value}</div>
                    ))}
                </div>
            </td>
        )
    },
    Value: ({ value, className }: { value: string | number, className?: string }) => {
        return (
            <td className={`p-2 truncate`}>
                <span className={className}>
                    {value}
                </span>
            </td>
        );
    }
}