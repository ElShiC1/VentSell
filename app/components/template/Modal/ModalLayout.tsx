import { InpuTypes } from "@/components/atoms/Input"
import type React from "react"

export const ModalLayout = ({ children, className }: { children: React.ReactNode, className: string }) => {
    return (
        <div className="absolute inset-[0] w-[calc(100%+2rem)] h-[calc(100%+2rem)] -left-4 -top-4 bg-gradient-radial bg-gray-400/60 rounded-lg flex items-center justify-center">
            <div className={`bg-white rounded-lg overflow-hidden flex ${className}`}>
                {children}
            </div>
        </div>
    )
}
