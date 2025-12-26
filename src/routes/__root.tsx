import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
// 🔑 CRITICAL: Ensure you have this import
import { TanStackRouterDevtools } from '@tanstack/router-devtools' 


export const Route = createRootRoute({
  component: () => (
    <>
      {/* --- Main Navigation Layout --- */}
      <div className="p-4 flex gap-4 bg-indigo-700 text-white shadow-lg">
        <Link to="/" className="text-lg font-bold hover:text-indigo-200 transition">
            Home
        </Link>
        <Link to="/about" className="text-lg font-bold hover:text-indigo-200 transition">
            About
        </Link>
      </div>
      
      {/* 🔑 The Outlet renders the current child page component */}
      <div className="p-4">
        <Outlet /> 
      </div>
      
      {/* 🔑 CRITICAL: Render the DevTools component here */}
      {/* The DevTools provide a visual interface for debugging the router state */}
      <TanStackRouterDevtools initialIsOpen={false} position="bottom-right" />
    </>
  ),
})