import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Cliente } from "../../../tipos/Cliente";
import { Venta } from "../../../tipos/Venta";
import { Paginador } from "../../paginador";

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

export const SalesPage = (props: { ventas: Venta[], clientes: Cliente[] }) => {
    const [Ventas, setVentas] = useState<Venta[]>(props.ventas);
    const [Clientes, setClientes] = useState<Cliente[]>(props.clientes);
    const [CurrentPage, setCurrentPage] = useState<number>(1);

    const elementsPerPage = 10;
    const numPages = Ventas.length <= 0 ? 1 : Math.ceil(Ventas.length / elementsPerPage);

    const UpdateVentas = (ventas: Array<any>, clientes: Cliente[]): void => {
        let ventasFormatted: Array<Venta> = [];
        ventas.forEach((v: Venta) => {
            const nombreCliente = clientes.find(c => c._id == v.nombreCliente)?.nombre;
            const sale: Venta = {
                _id: v._id,
                nombreCliente: nombreCliente || "General",
                productos: v.productos,
                descuentoEfectivo: v.descuentoEfectivo,
                descuentoTarjeta: v.descuentoTarjeta,
                dineroEntregadoEfectivo: v.dineroEntregadoEfectivo,
                dineroEntregadoTarjeta: v.dineroEntregadoTarjeta,
                precioVentaTotal: v.precioVentaTotal,
                cambio: v.cambio,
                tipo: v.tipo,
                vendidoPor: v.vendidoPor,
                modificadoPor: v.modificadoPor,
                createdAt: v.createdAt,
                updatedAt: v.updatedAt
            }
            ventasFormatted.push(sale);
        });
        setVentas(ventasFormatted);
    }

    const setPaginaActual = (page: number) => {
        if (page < 1) { return; }
        if (page > numPages) { return; }

        setCurrentPage(page);
    }

    return (
        <motion.div className="flex flex-col h-screen antialiased mx-8 py-8" initial={variants.initial} animate={variants.animate} exit={variants.exit}>
            <div className="text-center">
                <div className="flex mb-1 sm:mb-0 justify-between w-full">
                    <h2 className="text-2xl leading-tight">
                        Ventas
                    </h2>
                    <div className="text-end">
                        <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center">
                            <div className=" relative ">
                                <input type="text" id="&quot;form-subscribe-Filter" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="Producto a buscar..." />
                            </div>
                            <button className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200" type="submit">
                                Filtrar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="flex flex-col h-full mt-4 pb-10">
                <div className="bg-white grid grid-cols-4 justify-evenly  border-b-2 rounded-t-xl ">
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
                <div className="bg-white flex flex-col border-b-4 overflow-scroll overflow-x-hidden">
                    {Ventas.slice((elementsPerPage * (CurrentPage - 1)), CurrentPage * elementsPerPage).map((v) => {
                        return (
                            <div key={`FilaProdTable${v._id}`}>
                                <FilaVenta key={`FilaVenta${v._id}`} IDCompra={v._id} nombreCliente={v.nombreCliente} fechaCompra={v.createdAt} metodoPago={v.tipo} valorTotal={v.precioVentaTotal} />
                            </div>
                        );
                    })}
                </div>
                <div className="bg-white flex flex-row p-5 items-center justify-center rounded-b-xl shadow-lg">
                    <Paginador numPages={numPages} paginaActual={CurrentPage} maxPages={10} cambiarPaginaActual={setPaginaActual} />
                </div>
            </div>
        </motion.div>
    );
}

const FilaVenta = (props: { IDCompra: string, nombreCliente: string, fechaCompra: string, metodoPago: string, valorTotal: number }) => {
    return (
        <div className="grid grid-cols-4 w-full justify-evenly gap-x-6 border-t">
            <div className="px-5 py-5 border-gray-200 text-sm">
                <p className="text-gray-900">
                    {props.nombreCliente}
                </p>
            </div>
            <div className="py-5 border-gray-200 text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {props.fechaCompra}
                </p>
            </div>
            <div className="py-5 border-gray-200 text-sm">
                <p className="text-gray-900 whitespace-no-wrap">
                    {props.metodoPago}
                </p>
            </div>
            <div className="py-5 border-gray-200 text-lg">
                <p className="text-gray-900 whitespace-no-wrap">
                    {props.valorTotal}€
                </p>
            </div>
        </div>
    );
}