import { sendMailToPaciente } from "../config/nodemailer.js";
import Paciente from "../models/Paciente.js";

const registrarPaciente = async (req, res) => { 
    //Paso 1 - tomar datos del request
    const {email} = req.body;
    //Paso 2 - Validar datos
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos debe llenar todos los datos"})
    const VerificarEmailBDD = await Paciente.findOne({email})
    if (VerificarEmailBDD) return res.status(400).json({msg:"email no válido"})
    //Pasp 3 - Interactuar con la BDD
    const nuevoPaciente = new Paciente(req.body)
    const password = Math.random().toString(36).slice(2)
    nuevoPaciente.password = await nuevoPaciente.encrypPassword("vet"+password)
    nuevoPaciente.veterinario = req.veterinarioBDD._id
    sendMailToPaciente(email,"vet"+password)
    await nuevoPaciente.save()

    res.status(200).json({msg:"Paciente registrado exitosamente"})
}

const listarPaciente = async (req, res) => { 
    const pacientes = await Paciente.find({estado:true}).where('veterinario').equals(req.veterinarioBDD).select("-salida -createAt -updateAt -__v").populate('veterinario','nombre email')
    res.status(200).json(pacientes)
    
}
const detallePaciente = (req, res) => { 
    res.send("Paciente detalle")
}
const actualizarPaciente = (req, res) => { 
    res.send("Paciente listado")
}
const eliminirPaciente = (req, res) => { 
    res.send("Paciente listado")
}

const loginPaciente = (req, res) => { 
    res.send("Inicio sesión con éxito")
}

const perfilPaciente = (req, res) => { 
    res.send("Dueño puede ver su peril")
}

export {
    registrarPaciente,
    listarPaciente,
    detallePaciente,
    actualizarPaciente,
    eliminirPaciente,
    loginPaciente,
    perfilPaciente
}