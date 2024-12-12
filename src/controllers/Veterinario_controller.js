import mongoose from "mongoose";
import {sendMailToUser, sendMailToRecoveryPassword} from "../config/nodemailer.js";
import {generarJWT} from "../helpers/crearJWT.js";
import Veterinario from "../models/Veterinario.js";

const registro = async (req, res) => {
    //1. Tomar los datos
    const {email, password} = req.body;
    //2. Validar datos
    if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Por favor llene todos los campos."});

    const VerificarEmailBDD = await Veterinario.findOne({email})
    if(VerificarEmailBDD) return res.status(400).json({msg:"El email ya registrado."});

    //3. Interactura con bdd
    const nuevoVeterinario = new Veterinario(req.body)
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password);
    const token = nuevoVeterinario.crearToken();
    await sendMailToUser(email, token);
    await nuevoVeterinario.save();
    res.status(200).json({msg:"Revisa tu correo electrónico"});
};

const confirmEmail = async (req, res) => {
    //1. Tomar datos
    const {token} = req.params;
    //2. Validar Datos
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos no sepuede validar tu cuenta"});
    
    const veterinarioBDD = await Veterinario.findOne({token});
    if(!veterinarioBDD?.token) return res.status(400).json({msg:"La cuenta ya ha sido confirmada"});
    
    //3. Interactuar con la BDD
    veterinarioBDD.token = null;
    veterinarioBDD.confirmemail = true;
    await veterinarioBDD.save();

    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesion"});
}

const login = async (req, res) => {
    //1. Tomar datos
    const {email, password} = req.body;
    //2. Validar Datos
    if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Por favor llene todos los campos."});

    const VerinarioBDD = await Veterinario.findOne({email});
    if(VerinarioBDD?.confirmemail==false) return res.status(400).json({msg:"Cuenta no validada."});
    if(!VerinarioBDD) return res.status(400).json({msg:"Cuenta no Registrada, Registrate."});

    const verifyPassword = await VerinarioBDD?.matchPassword(password);
    if (!verifyPassword) return res.status(400).json({msg:"Contraseña incorrecta."});

    //3. Interactuar con la BDD
    console.log(VerinarioBDD)
    const tokenJWT = generarJWT(VerinarioBDD._id, "veterinario");
    res.status(200).json({VerinarioBDD, tokenJWT});
}

const recuperarPassword = async (req, res) => { 
    //1. Tomar datos
    const {email} = req.body;
    //2. Validar Datos
    if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Por favor llene todos los campos."});
    const VerinarioBDD = await Veterinario.findOne({email});
    if(!VerinarioBDD) return res.status(400).json({msg:"Cuenta no Registrada, Registrate."});
    //3. Interactuar con la BDD
    const token = VerinarioBDD.crearToken();
    Veterinario.token = token;
    await sendMailToRecoveryPassword(email,token);
    await VerinarioBDD.save();
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu contraseña"});
}

const comprobarTokenPassword = async (req, res) => { 
    //1. Tomar datos
    const {token} = req.params;
    //2. Validar Datos
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos no sepuede validar tu cuenta"});
    const veterinarioBDD = await Veterinario.findOne({token});
    if(veterinarioBDD?.token !== token) res.status(404).json({msg:"Lo sentimos no sepuede validar tu cuenta"});
    //3. Interactuar con la BDD
    await veterinarioBDD.save();
    res.status(200).json({msg:"Token confirmado, ya puedes cambiar tu contraseña"});
}

const nuevoPassword = async (req, res) => { 
    //1. Tomar datos
    const{password,confirmpassword} = req.body
    //2. Validar Datos
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    //3. Interactuar con la BDD
    veterinarioBDD.token = null
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"})
}

const perfilUsuario = (req, res) => { 
    res.status(200).json({msg: "Tu usuario"});
}

const updatePerfil = async (req, res) =>{
    //1. Tomar datos
    const {id} = req.params;

    //2. Validar Datos
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({msg:"Debe ser un id válido"});

    //3. Interactuar con la BDD
    const VerinarioBDD = await Veterinario.findOne({id});
    console.log(VerinarioBDD);

    
    
    res.status(200).json({msg: "Va a actualizar"});
}

export {
    registro,
    confirmEmail,
    login,
    recuperarPassword,
    comprobarTokenPassword,
    nuevoPassword,
    perfilUsuario,
    updatePerfil
}