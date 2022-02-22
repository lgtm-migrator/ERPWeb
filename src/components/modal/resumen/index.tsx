import { gql, useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect } from "react";
import useJwt from "../../../hooks/jwt";
import useClientContext from "../../../context/clientContext";
import useEmpleadoContext from "../../../context/empleadoContext";
import { CustomerPaymentInformation } from "../../../tipos/CustomerPayment";
import { Empleado } from "../../../tipos/Empleado";
import { ProductoVendido } from "../../../tipos/ProductoVendido";
import { ADD_SALE } from "../../../utils/querys";
import { CreateEmployee } from "../../../utils/typeCreator";
import { Backdrop } from "../backdrop";

const In = {
    hidden: {
        scale: 0,
        opacity: 0
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            duration: 0.1,
            type: "spring",
            damping: 15,
            stifness: 500
        }
    },
    exit: {
        y: "-100vh",
        opacity: 0,
        transition: {
            duration: 0.25,
        }
    }
}


export const Resumen = (props: {
    productosVendidos: ProductoVendido[], setProductosCarrito: Function,
    pagoCliente: CustomerPaymentInformation, handleCloseResumen: Function, handleCloseAll: Function
}) => {
    const [addVentasToDB, { loading, error }] = useMutation(ADD_SALE);
    const { Clientes, } = useClientContext();
    const { Empleado, SetEmpleado } = useEmpleadoContext();
    const jwt = useJwt();

    useEffect(() => {
        const GetEmpleadoFromDB = async () => {
            if (Empleado._id) { return; }
            const fetchRes = await fetch(`/api/empleado/${jwt._id}`);

            const empleadoJson = await fetchRes.json();
            SetEmpleado(CreateEmployee(empleadoJson.empleado));
        }

        GetEmpleadoFromDB();
    }, [])


    const addSale = async () => {
        try {
            let cliente;
            if (!props.pagoCliente.cliente) {
                cliente = Clientes.find((c) => c.nombre === "General");
            }
            else {
                cliente = props.pagoCliente.cliente;
            }

            await addVentasToDB({
                variables: {
                    "fields": {
                        "productos": props.productosVendidos,
                        "dineroEntregadoEfectivo": props.pagoCliente.pagoEnEfectivo,
                        "dineroEntregadoTarjeta": props.pagoCliente.pagoEnTarjeta,
                        "precioVentaTotal": props.pagoCliente.precioTotal,
                        "tipo": props.pagoCliente.tipo,
                        "cambio": props.pagoCliente.cambio,
                        "cliente": cliente,
                        "vendidoPor": Empleado,
                        "modificadoPor": Empleado,
                        "descuentoEfectivo": props.pagoCliente.dtoEfectivo || 0,
                        "descuentoPorcentaje": props.pagoCliente.dtoPorcentaje || 0,
                        "tpv": jwt.TPV
                    }
                }
            });

            if (!error && !loading) {
                props.handleCloseAll();
                props.setProductosCarrito([]);
            }
            else {
                console.log("Error al realizar la venta");
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} >
            <Backdrop onClick={() => { props.handleCloseResumen() }} >
                <motion.div className="flex flex-col gap-2 items-center bg-white rounded-2xl w-96 h-5/6 py-2"
                    onClick={(e) => e.stopPropagation()}
                    variants={In}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="w-full h-5/6 rounded-3xl bg-white z-10 ">
                        <div >
                            <h2 className="text-xl font-semibold text-center py-4">ERPWeb</h2>
                            <div className="flex justify-evenly text-sm">
                                <div className="text-left relative ">Cliente: {props.pagoCliente.cliente.nombre} </div>
                            </div>
                        </div>
                        <div id="receipt-content" className="text-left w-full h-5/6 text-sm p-4">
                            <hr />
                            <div className="w-full h-full text-xs">
                                <div className="flex w-full justify-around">
                                    <p className="w-1/4 text-left font-semibold">#</p>
                                    <p className="w-1/4 text-left font-semibold">Producto</p>
                                    <p className="w-1/4 text-center font-semibold">Cantidad</p>
                                    <p className="w-1/4 text-center font-semibold">Total</p>
                                </div>
                                <div className="flex flex-col gap-2 w-full h-full overflow-y-auto overflow-x-hidden pt-2">
                                    {
                                        props.productosVendidos.map((prod, index) => {
                                            if (prod.dto) {
                                                return <GenerarFilaProducto key={"modalRes" + prod._id} numFila={index + 1} nombreProducto={prod.nombre} cantidad={Number(prod.cantidadVendida)} precio={Number(prod.precioVenta * (1 - Number(prod.dto) / 100))} />
                                            }
                                            else {
                                                return <GenerarFilaProducto key={"modalRes" + prod._id} numFila={index + 1} nombreProducto={prod.nombre} cantidad={Number(prod.cantidadVendida)} precio={prod.precioVenta} />
                                            }
                                        })
                                    }
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full h-auto items-center">
                        <div className="font-semibold">
                            {props.pagoCliente.tipo}
                        </div>
                        <div className="text-sm">
                            <div>
                                Total: {props.pagoCliente.precioTotal.toFixed(2)}€
                            </div>
                            <div>
                                Cambio: {props.pagoCliente.cambio.toFixed(2)}€
                            </div>
                        </div>
                    </div>
                    <div className="px-4 pb-2 w-full h-auto flex flex-grow text-center gap-2">
                        <button className="bg-red-500 hover:bg-red-600 text-white w-1/2 h-8 hover:shadow-lg rounded-lg ml-auto flex items-center justify-center" onClick={() => props.handleCloseResumen()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white w-1/2 h-8 hover:shadow-lg rounded-lg flex items-center justify-center" onClick={addSale}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </Backdrop>
        </motion.div>
    );

}

const GenerarFilaProducto = (props: { numFila: number, nombreProducto: string, cantidad: number, precio: number }) => {
    return (
        <div className="flex w-full">
            <div className="w-1/4 text-left">
                {props.numFila}
            </div>
            <div className="w-1/4 text-left">
                {props.nombreProducto}
            </div>
            <div className="w-1/4 text-center">
                {props.cantidad}
            </div>
            <div className="w-1/4 text-center">
                {(props.precio * props.cantidad).toFixed(2)}€
            </div>
        </div>
    );
}

export default Resumen;