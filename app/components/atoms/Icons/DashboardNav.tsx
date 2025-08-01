import { NavLink, useLocation, useMatch, useMatches, useNavigation, useParams } from "react-router";

export const DashboardIcon = {
    Analytics: ({ className, title }: { className: string, title: string }) => (
        <NavLink to={'/'} className={({ isActive }) =>
            isActive ? 'flex items-center gap-5 font-medium text-blue-600 cursor-pointer' : 'flex items-center gap-5 font-medium text-gray-500 cursor-pointer group hover:text-blue-600'
        } end>
            <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm10 2a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0zm-4 3a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0zm8 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0z" clipRule="evenodd"></path></svg>
            <span className="group-hover:font-semibold transition-all">{title}</span>
        </NavLink>
    ),
    Customers: ({ className, title }: { className: string, title: string }) => (
        <NavLink to={'/Clientes'} className={({ isActive }) =>
            isActive ? 'flex items-center gap-5 font-medium text-blue-600 cursor-pointer' : 'flex items-center gap-5 font-medium text-gray-500 cursor-pointer group hover:text-blue-600'
        }>
            <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><circle cx={12} cy={10} r={3} fill="currentColor"></circle><path fill="currentColor" d="M12 13c-2.761 0-5 1.79-5 4h10c0-2.21-2.239-4-5-4"></path><rect width={18} height={18} x={3} y={3} rx={3}></rect></g></svg>
            <span className="group-hover:font-semibold transition-all">{title}</span>
        </NavLink>
    ),
    Orders: ({ className, title }: { className: string, title: string }) => (
        <NavLink to={'/Ordenes'} className={({ isActive }) =>
            isActive ? 'flex items-center gap-5 font-medium text-blue-600 cursor-pointer' : 'flex items-center gap-5 font-medium text-gray-500 cursor-pointer group hover:text-blue-600'
        }>
            <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" ><path fill="currentColor" fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm5 1a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z" clipRule="evenodd"></path></svg>
            <span className="group-hover:font-semibold transition-all">{title}</span>
        </NavLink>
    ),
    Products: ({ className, title }: { className: string, title: string }) => (
        <NavLink to={'/Productos'} className={({ isActive }) =>
            isActive ? 'flex items-center gap-5 font-medium text-blue-600 cursor-pointer' : 'flex items-center gap-5 font-medium text-gray-500 cursor-pointer group hover:text-blue-600'
        }>
            <svg className={className} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" ><g fill="none"><path fill="currentColor" d="M18 15H7L5.5 6H21z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.5 3m0 0L7 15h11l3-9z"></path><circle cx={8} cy={20} r={1} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></circle><circle cx={17} cy={20} r={1} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}></circle></g></svg>
            <span className="group-hover:font-semibold transition-all">{title}</span>
        </NavLink>

    ),
    Settings: ({ className, title }: { className: string, title: string }) => (
        <NavLink to={'/Configurar'} className={({ isActive }) =>
            isActive ? 'flex items-center gap-5 font-medium text-blue-600 cursor-pointer' : 'flex items-center gap-5 font-medium text-gray-500 cursor-pointer group hover:text-blue-600'
        }>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className={className}><path fill="currentColor" fillRule="evenodd" d="M9.024 2.783A1 1 0 0 1 10 2h4a1 1 0 0 1 .976.783l.44 1.981q.6.285 1.14.66l1.938-.61a1 1 0 0 1 1.166.454l2 3.464a1 1 0 0 1-.19 1.237l-1.497 1.373a8 8 0 0 1 0 1.316l1.497 1.373a1 1 0 0 1 .19 1.237l-2 3.464a1 1 0 0 1-1.166.454l-1.937-.61q-.54.375-1.14.66l-.44 1.98A1 1 0 0 1 14 22h-4a1 1 0 0 1-.976-.783l-.44-1.981q-.6-.285-1.14-.66l-1.938.61a1 1 0 0 1-1.166-.454l-2-3.464a1 1 0 0 1 .19-1.237l1.497-1.373a8 8 0 0 1 0-1.316L2.53 9.97a1 1 0 0 1-.19-1.237l2-3.464a1 1 0 0 1 1.166-.454l1.937.61q.54-.375 1.14-.66l.44-1.98zM12 15a3 3 0 1 0 0-6a3 3 0 0 0 0 6" clipRule="evenodd"></path></svg>
            <span className="group-hover:font-semibold transition-all">{title}</span>
        </NavLink>
    ),
    Logout: ({ className, title }: { className: string, title: string }) => (
        <div className="flex items-center gap-5 text-gray-500 cursor-pointer group hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className={`${className}`}><path fill="currentColor" fillRule="evenodd" d="M6 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3zm10.293 5.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L18.586 13H10a1 1 0 1 1 0-2h8.586l-2.293-2.293a1 1 0 0 1 0-1.414" clipRule="evenodd"></path></svg>
            <span className="group-hover:font-semibold transition-all">{title}</span>
        </div>
    )
}