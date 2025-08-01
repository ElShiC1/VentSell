import { SideBar } from "@/components/organism/sidebar/Sidebar";
import { deleteDatabase, exportDatabase, importDatabase } from "@/services/db/Db";
import { VentSellDb } from "@/services/shared/VentSellDb";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Outlet, redirect } from "react-router";

export default function Layout() {
  return (
    <main className="p-3 md:p-3 h-screen max-screen m-auto">
      <div className="flex gap-4 h-full w-full">
        <SideBar logo={"/public/favicon.ico"} importDB={importDatabase} exportDB={exportDatabase} deleteBase={deleteDatabase}/>
        <div className="h-full w-9/10 bg-gray-100 p-4 rounded-lg">
          <Outlet />
        </div>
      </div>
    </main>
  )
}