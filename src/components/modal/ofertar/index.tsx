import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import useProductEnCarritoContext from "../../../context/productosEnCarritoContext"
import { Producto } from "../../../tipos/Producto"
import { In } from "../../../utils/animations"
import { notifyWarn } from "../../../utils/toastify"
import CargandoSpinner from "../../cargandoSpinner"
import Dropdown from "../../elementos/Forms/dropdown"
import FloatingLabel from "../../floatingLabel"
import { Backdrop } from "../backdrop"

const Ofertar = (props: { setModal: Function, productos: Producto[] }) => {
    const [infoOpen, setInfoOpen] = useState<boolean>(false);
    const [familiaOfertada, setFamiliaOfertada] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [ofertas, setOfertas] = useState<Producto[]>([]);
    const { ProductosEnCarrito, SetProductosEnCarrito } = useProductEnCarritoContext()

    const messagesEndRef = useRef<null | HTMLDivElement>(null)
    const scrollToBottom = () => {
        if (messagesEndRef.current == null) { return }
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [ofertas]);
    useEffect(() => {
        const GetData = async () => {
            const promise = new Promise<string>((resolve) => {
                setTimeout(() => {
                    setLoading(false)
                    resolve("PANADERIA")
                }, 1500)

            })

            const familia = await promise;
            setFamiliaOfertada(familia);
        }

        GetData();
    }, [])

    const DeleteItem = (index: number) => {
        setOfertas((ofertas) => {
            ofertas.splice(index, 1)
            return [...ofertas]
        })
    }

    if (isLoading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full w-full ">
                <Backdrop onClick={() => { props.setModal(false) }}>
                    <motion.div className="flex flex-col h-3/4 w-3/4 xl:h-1/2 xl:w-1/2 gap-2 items-center bg-white rounded-2xl p-4"
                        onClick={(e) => e.stopPropagation()}
                        variants={In}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="flex gap-1 w-full font-semibold text-xl items-center">
                            Ofertas disponibles
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                className="w-6 h-6 text-blue-500 cursor-pointer"
                                onClick={() => setInfoOpen(!infoOpen)}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            <AnimatePresence>
                                {infoOpen && <FloatingLabel texto="Oferta basada en la compra actual" />}
                            </AnimatePresence>
                        </div>
                        <div className="flex flex-col w-full h-full items-center justify-center">
                            <CargandoSpinner mensaje="Calculando oferta..." />
                        </div>
                        <div className="flex w-full items-end justify-around text-white gap-10">
                            <button className="h-10 w-full rounded-xl bg-red-500 hover:bg-red-600 shadow-lg" onClick={() => props.setModal(false)}>
                                Cancelar
                            </button>
                            <button className="h-10 w-full rounded-xl bg-blue-500 hover:bg-blue-600 shadow-lg" onClick={async () => { }}>
                                Añadir oferta
                            </button>
                        </div>
                    </motion.div>
                </Backdrop>
            </motion.div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-full w-full ">
            <Backdrop onClick={() => { props.setModal(false) }}>
                <motion.div className="flex flex-col h-3/4 w-3/4 xl:h-1/2 xl:w-1/2 gap-2 items-center bg-white rounded-2xl p-4"
                    onClick={(e) => e.stopPropagation()}
                    variants={In}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="flex gap-1 w-full font-semibold text-xl items-center">
                        Ofertas disponibles
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="w-6 h-6 text-blue-500 cursor-pointer"
                            onClick={() => setInfoOpen(!infoOpen)}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        <AnimatePresence>
                            {infoOpen && <FloatingLabel texto="Oferta basada en la compra actual" />}
                        </AnimatePresence>
                    </div>
                    <div className="flex flex-col w-full justify-center">
                        {
                            familiaOfertada ?
                                <div className="w-full h-full">
                                    <ProductoPicker productos={props.productos} familiaOfertada={familiaOfertada} setOfertas={setOfertas} />
                                </div>
                                :
                                <div className="w-full h-full">
                                    Ninguna oferta disponible
                                </div>
                        }
                    </div>
                    <div className="w-full h-full rounded-lg border overflow-y-scroll">
                        {
                            ofertas.map((prod, index) => {
                                return (
                                    <div className="w-full"
                                        key={`oferta-${prod.nombre}-${index}`} ref={messagesEndRef}>
                                        <div className="flex justify-between items-center p-2">
                                            <div className="flex gap-2">
                                                <span>{index + 1}</span>
                                                <span>{prod.nombre}</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                className="w-6 h-6 text-red-600 cursor-pointer"
                                                onClick={() => DeleteItem(index)}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <hr />
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="flex w-full items-end justify-around text-white gap-10">
                        <button className="h-10 w-full rounded-xl bg-red-500 hover:bg-red-600 shadow-lg" onClick={() => props.setModal(false)}>
                            Cancelar
                        </button>
                        {
                            ofertas.length <= 0 ?
                                <button disabled className="h-10 w-full rounded-xl bg-blue-400 shadow-lg">
                                    Añadir oferta
                                </button>
                                :

                                <button className="h-10 w-full rounded-xl bg-blue-500 hover:bg-blue-600 shadow-lg cursor-pointer" onClick={async () => { }}>
                                    Añadir oferta
                                </button>
                        }
                    </div>
                </motion.div>
            </Backdrop>
        </motion.div>
    )
}

const ProductoPicker = (props: { productos: Producto[], familiaOfertada: string, setOfertas: React.Dispatch<React.SetStateAction<Producto[]>> }) => {
    const [productoSeleccionado, setProductoSeleccionado] = useState<string>("");
    const AddOferta = () => {
        if (productoSeleccionado === "") {
            notifyWarn("Seleccione el producto a ofertar")
            return;
        }

        props.setOfertas((ofertasPrev) => {
            if (ofertasPrev.filter((p) => p.nombre === productoSeleccionado).length > 0) {
                notifyWarn("Este producto ya existe en la lista de ofertas")
                return [...ofertasPrev]
            }

            const productoOfertado = props.productos.filter((p) => {
                return p.nombre === productoSeleccionado
            })

            if (productoOfertado[0]) {
                ofertasPrev.push(productoOfertado[0])
            }
            setProductoSeleccionado("")
            return [...ofertasPrev];
        })
    }

    return (
        <div className="flex gap-1 w-full h-full items-center">
            <Dropdown elementos={props.productos.filter((p) => p.familia === props.familiaOfertada).map((p) => { return p.nombre })}
                setElemento={setProductoSeleccionado} selectedElemento={productoSeleccionado} />
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-6 h-6 text-blue-600 cursor-pointer"
                    onClick={AddOferta}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
    )
}

export default Ofertar;