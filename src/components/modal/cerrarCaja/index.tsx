import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useEmpleadoContext from "../../../context/empleadoContext";
import { SesionEmpleado } from "../../../tipos/Empleado";
import { TPVType } from "../../../tipos/TPV";
import { Venta } from "../../../tipos/Venta";
import { FetchVentasByTPVDate, FetchTPV, AddCierreTPV } from "../../../utils/fetches";
import { GetEfectivoTotal, GetTarjetaTotal, GetTotalEnCaja } from "../../../utils/preciosUtils";
import { notifyError } from "../../../utils/toastify";
import { ValidatePositiveFloatingNumber } from "../../../utils/validator";
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

export const CerrarCaja = (props: { Empleado?: SesionEmpleado, setModalOpen: Function, setEmpleadoUsandoTPV: Function }) => {
    const [Ventas, setVentas] = useState<Venta[]>();
    const [Tpv, setTPV] = useState<TPVType>();
    const [TotalEfectivo, setTotalEfectivo] = useState<string>();
    const [TotalTarjeta, setTotalTarjeta] = useState<string>();
    const [TotalPrevistoEnCaja, setTotalPrevistoEnCaja] = useState<string>();
    const [TotalRealEnCaja, setTotalRealEnCaja] = useState<string>("0");
    const [DineroRetirado, setDineroRetirado] = useState<string>("0");
    const { Empleado, SetEmpleado } = useEmpleadoContext();

    useEffect(() => {
        const GetVentas = async (j: SesionEmpleado) => {
            if (!j.TPV) { notifyError("El empleado no está usando la TPV"); return; }

            const tpv = await FetchTPV(j.TPV);
            if (!tpv) { notifyError("No se ha encontrado la TPV que se quiere cerrar"); return; }

            const ventas = await FetchVentasByTPVDate(j.TPV, tpv.updatedAt.toString());

            setVentas(ventas);
            setTPV(tpv);
            setTotalEfectivo(GetEfectivoTotal(ventas).toString());
            setTotalTarjeta(GetTarjetaTotal(ventas).toString());
            setTotalPrevistoEnCaja(GetTotalEnCaja(ventas, tpv).toString());
        }

        GetVentas(Empleado);
    }, [])

    const CerrarCaja = async () => {
        if (!Tpv || !Tpv._id) { return; }

        await AddCierreTPV(Empleado, SetEmpleado, Number(TotalEfectivo),
            Number(TotalTarjeta), Number(DineroRetirado),
            Number(TotalPrevistoEnCaja), Number(TotalRealEnCaja),
            Ventas?.length || 0);

        props.setModalOpen(false);
        props.setEmpleadoUsandoTPV(false);
    }

    if (!Ventas) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full w-full">
                <Backdrop onClick={(e) => { e.stopPropagation(); props.setModalOpen(false) }} >
                    <motion.div className="h-3/6 w-2/6 m-auto py-2 flex flex-col items-center justify-center bg-white rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                        variants={In}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Meter skeletons */}
                        Cargando...
                    </motion.div>
                </Backdrop>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-full w-full ">
            <Backdrop onClick={(e) => { e.stopPropagation(); props.setModalOpen(false) }} >
                <motion.div className="h-3/6 w-3/6 flex flex-col items-center bg-white rounded-2xl p-4"
                    onClick={(e) => e.stopPropagation()}
                    variants={In}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="flex flex-col gap-4 h-full w-full rounded justify-center content-center">
                        <div className="text-lg text-center font-bold">
                            Ventana de cierre de TPV
                        </div>
                        <hr />
                        <div className="flex w-full h-full">
                            <div className="flex flex-col gap-2 xl:gap-4 w-full h-full">
                                <div className="flex gap-2">
                                    <p>Número de ventas: </p>
                                    <p>{Ventas.length}</p>
                                </div>

                                <div className="flex gap-2">
                                    <p>Ventas totales: </p>
                                    <p>{(Number(TotalEfectivo) + Number(TotalTarjeta)).toFixed(2)}€</p>
                                </div>

                                <div className="flex gap-2">
                                    <p>Ventas en efectivo: </p>
                                    <p>{Number(TotalEfectivo).toFixed(2)}€</p>
                                </div>

                                <div className="flex gap-2">
                                    <p>Ventas en tarjeta: </p>
                                    <p>{Number(TotalTarjeta).toFixed(2)}€</p>
                                </div>

                                <div className="flex gap-2">
                                    <p>Dinero total esperado en caja: </p>
                                    <p>{Number(TotalPrevistoEnCaja).toFixed(2)}€</p>
                                </div>

                                <div className="flex gap-2">
                                    <p>Dinero total real en caja: </p>
                                    <input className="rounded-lg border"
                                        onChange={(e) => { setTotalRealEnCaja(ValidatePositiveFloatingNumber(e.target.value)) }} value={TotalRealEnCaja} />
                                    €
                                </div>

                                <div className="flex gap-2">
                                    <p>Dinero retirado: </p>
                                    <input className="rounded-lg border"
                                        onChange={(e) => { setDineroRetirado(ValidatePositiveFloatingNumber(e.target.value)) }} value={DineroRetirado} />
                                    €
                                </div>

                            </div>

                        </div>

                        <div className="flex gap-4 h-auto w-full mb-auto text-white">
                            <div className="flex h-10 w-2/3 m-auto bg-red-500 hover:bg-red-600 rounded-lg cursor-pointer items-center justify-center shadow-lg"
                                onClick={() => { props.setModalOpen(false) }}>
                                <div>
                                    Cancelar
                                </div>
                            </div>
                            {
                                Number(TotalRealEnCaja) > 0 && Number(TotalRealEnCaja) - Number(DineroRetirado) >= 0 ?
                                    <div className={`flex h-10 w-2/3 m-auto bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer items-center justify-center shadow-lg`}
                                        onClick={async () => { await CerrarCaja() }}>
                                        <div>
                                            Cerrar TPV
                                        </div>
                                    </div>
                                    :
                                    <div className={`flex h-10 w-2/3 m-auto bg-blue-400 hover:bg-blue-400 rounded-lg cursor-default items-center justify-center shadow-lg`}>
                                        <div>
                                            Cerrar TPV
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                </motion.div>
            </Backdrop>
        </motion.div>
    );
}

export default CerrarCaja;