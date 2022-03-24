import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Cliente } from "../../../tipos/Cliente";
import { Venta } from "../../../tipos/Venta";
import { FetchVenta, FetchVentas } from "../../../utils/fetches";
import { notifyWarn } from "../../../utils/toastify";
import { Paginador } from "../../Forms/paginador";
import EditarVenta from "../../modal/editarVenta";
import SkeletonCard from "../../Skeletons/skeletonCard";

const variants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 1,
            ease: "easeInOut",
        },
    },
    exit: {
        y: '-100vh',
        opacity: 0,
        transition: {
            ease: [0.87, 0, 0.13, 1],
            duration: 1
        }
    },
}

const SalesPage = (props: { ventas: Venta[], clientes: Cliente[] }) => {
    if (props.ventas == undefined) throw new Error("Props de ventas en ventasTabs.tsx es undefined");
    if (props.clientes == undefined) throw new Error("Props de clientes en ventasTabs.tsx es undefined");

    const [CurrentPage, setCurrentPage] = useState<number>(1);
    const [CurrentVenta, setCurrentVenta] = useState<Venta>();
    const [showModalEditarVenta, setShowModal] = useState<boolean>();
    const [VentasFiltradas, setVentasFiltradas] = useState<Venta[] | undefined>();
    const [filtro, setFiltro] = useState<string>("");

    useEffect(() => {
        if (!filtro) {
            setVentasFiltradas(undefined);
        }
    }, [filtro])


    const elementsPerPage = 10;
    const numPages = props.ventas.length <= 0 ? 1 : Math.ceil(props.ventas.length / elementsPerPage);
    const arrayNum = [...Array(8)];

    const setPaginaActual = (page: number) => {
        if (page < 1) { return; }
        if (page > numPages) { return; }

        setCurrentPage(page);
    }

    const Filtrar = async (f: string) => {
        if (f === "") { setVentasFiltradas(undefined); return; }
        if (!f.match('^[0-9a-fA-F]{24}$')) { notifyWarn("Introduce un ID de venta válido"); return; }

        setVentasFiltradas(await FetchVenta(f));
    }

    return (
        <div className="flex flex-col h-96 w-full bg-white rounded-b-2xl rounded-r-2xl p-4 shadow-lg border-x">
            <div className="flex gap-4 h-1/3 w-5/12 self-end">
                <input autoFocus={true} className="rounded-lg border-transparent appearance-none shadow-lg w-full h-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600" placeholder="ID de la venta..."
                    onChange={(e) => { setFiltro(e.target.value); }} onKeyPress={async (e) => { }} />

                {
                    filtro ?
                        <button className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-purple-200"
                            onClick={async (e) => { e.preventDefault(); await Filtrar(filtro) }}>
                            Filtrar
                        </button>
                        :
                        <button disabled className="px-4 py-2 font-semibold text-white bg-blue-300 rounded-lg shadow-md cursor-default">
                            Filtrar
                        </button>
                }
            </div>
            <div className="bg-red-500 flex flex-col h-full w-full mt-4 pb-10">
                <div className="bg-white grid grid-cols-4 justify-evenly">
                    <div className="px-5 py-3 border-gray-200 text-gray-800 text-left text-sm font-semibold">
                        Cliente
                    </div>
                    <div className="py-3 border-gray-200 text-gray-800 text-left text-sm font-semibold">
                        Fecha de compra
                    </div>
                    <div className="py-3 border-gray-200 text-gray-800 text-left text-sm font-semibold">
                        Método de pago
                    </div>
                    <div className="py-3 border-gray-200 text-gray-800 text-left text-sm font-semibold">
                        Valor total
                    </div>
                </div>
                <div className="bg-cyan-500 flex flex-col grow-0 overflow-scroll overflow-x-hidden">
                    {
                        props.ventas.length <= 0 ?
                            arrayNum.map((e, i) => <SkeletonCard key={`skeletonprops.ventas-${i}`} />)
                            :
                            VentasFiltradas && filtro ?
                                VentasFiltradas.slice((elementsPerPage * (CurrentPage - 1)), CurrentPage * elementsPerPage).map((v) => {
                                    return (
                                        <div key={`FilaProdTable${v._id}`} onClick={() => { setCurrentVenta(v); setShowModal(true) }}>
                                            <FilaVenta key={`FilaVenta${v._id}`} venta={v} />
                                        </div>
                                    );
                                })
                                :
                                props.ventas.slice((elementsPerPage * (CurrentPage - 1)), CurrentPage * elementsPerPage).map((v) => {
                                    return (
                                        <div className="hover:bg-gray-200 cursor-pointer"
                                            key={`FilaProdTable${v._id}`} onClick={() => { setCurrentVenta(v); setShowModal(true) }}>
                                            <FilaVenta key={`FilaVenta${v._id}`} venta={v} />
                                        </div>
                                    );
                                })
                    }
                </div>
            </div>
            <div className="flex flex-row pt-2 items-center justify-center">
                <Paginador numPages={numPages} paginaActual={CurrentPage} maxPages={10} cambiarPaginaActual={setPaginaActual} />
            </div>
            <AnimatePresence initial={false}>
                {showModalEditarVenta && <EditarVenta venta={CurrentVenta} setModal={setShowModal} />}
            </AnimatePresence>
        </div>
    );
}

const FilaVenta = (props: { venta: Venta }) => {
    let fecha = new Date(0);
    fecha.setUTCMilliseconds(Number(props.venta.createdAt));

    return (
        <div className="grid grid-cols-4 w-full justify-evenly gap-x-6 border-t">
            <div className="px-5 py-5 border-gray-200 text-sm">
                <p className="text-gray-900">
                    {props.venta.cliente.nombre}
                </p>
            </div>
            <div className="py-5 border-gray-200 text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {fecha.toLocaleString()}
                </p>
            </div>
            <div className="py-5 border-gray-200 text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {props.venta.tipo}
                </p>
            </div>
            <div className="py-5 border-gray-200 text-lg">
                <p className="text-gray-900 whitespace-no-wrap">
                    {props.venta.precioVentaTotal.toFixed(2)}€
                </p>
            </div>
        </div>
    );
}

export default SalesPage;