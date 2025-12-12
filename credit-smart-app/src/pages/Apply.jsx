import React,{useEffect,useMemo,useState}from"react";
import creditsData from"../data/creditsData";
import { useLocation } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

function formatCurrency(n){if(!n)return"0";return Number(n).toLocaleString("es-CO");}

export default function Apply(){

const[form,setForm]=useState({
  name:"",
  docType:"",
  docNumber:"",
  phone:"",
  email:"",
  creditId:"",
  amount:"",
  term:""
});

const location = useLocation();

useEffect(() => {
  if (location.state?.creditId) {
    setForm(prev => ({
      ...prev,
      creditId: String(location.state.creditId)
    }));
  }
}, [location.state]);

const[errors,setErrors]=useState({});
const[requests,setRequests]=useState([]);
const[successMsg,setSuccessMsg]=useState("");

const selectedCredit = useMemo(
  ()=>creditsData.find(c=>String(c.id)===String(form.creditId)),
  [form.creditId]
);

useEffect(()=>{
  const e={};
  if(form.email&&!/^\S+@\S+\.\S+$/.test(form.email))e.email="Correo inválido";
  if(form.phone&&!/^\d{7,15}$/.test(form.phone))e.phone="Número inválido";
  if(form.docNumber&&!/^\d{5,12}$/.test(form.docNumber))e.docNumber="Documento inválido";
  if(form.amount&&Number(form.amount)<=0)e.amount="Monto debe ser mayor a 0";
  if(form.term&&(Number(form.term)<=0||Number(form.term)>360))e.term="Plazo inválido";
  setErrors(e);
},[form]);

const monthlyInstallment = useMemo(()=>{
  if(!selectedCredit||!form.amount||!form.term)return 0;
  const P=Number(form.amount);
  const n=Number(form.term);
  const iAnnual=selectedCredit.interestEA/100;
  const iMonthly=Math.pow(1+iAnnual,1/12)-1;
  const cuota=(P*iMonthly)/(1-Math.pow(1+iMonthly,-n));
  return cuota;
},[selectedCredit,form.amount,form.term]);

function update(f,v){
  setForm(p=>({...p,[f]:v}));
  setSuccessMsg("");
}

async function handleSubmit(e){
  e.preventDefault();

  const finalErrors={};
  if(!form.name)finalErrors.name="Nombre requerido";
  if(!form.docType)finalErrors.docType="Tipo de documento requerido";
  if(!form.docNumber||!/^\d{5,12}$/.test(form.docNumber))finalErrors.docNumber="Documento inválido";
  if(!form.email||!/^\S+@\S+\.\S+$/.test(form.email))finalErrors.email="Correo inválido";
  if(!form.phone||!/^\d{7,15}$/.test(form.phone))finalErrors.phone="Teléfono inválido";
  if(!form.creditId)finalErrors.creditId="Selecciona un crédito";
  if(!form.amount||Number(form.amount)<=0)finalErrors.amount="Monto inválido";
  if(!form.term||Number(form.term)<=0)finalErrors.term="Plazo inválido";

  if(Object.keys(finalErrors).length){
    setErrors(finalErrors);
    setSuccessMsg("");
    return;
  }

  try {
    await addDoc(collection(db,"solicitudes"),{
      name: form.name,
      docType: form.docType,
      docNumber: form.docNumber,
      phone: form.phone,
      email: form.email,
      creditId: form.creditId,
      amount: Number(form.amount),
      term: Number(form.term),
      monthlyInstallment: Math.round(monthlyInstallment),
      createdAt: serverTimestamp()
    });

    setRequests(p=>[...p,{...form,id:Date.now(),monthly:Math.round(monthlyInstallment)}]);

    setForm({
      name:"",
      docType:"",
      docNumber:"",
      phone:"",
      email:"",
      creditId:"",
      amount:"",
      term:""
    });

    setErrors({});
    setSuccessMsg("Solicitud enviada correctamente.");
    setTimeout(()=>setSuccessMsg(""),4000);

  } catch (error) {
    console.error(error);
    setSuccessMsg("Error al enviar la solicitud");
  }
}

return(
<div className="container">
  <section className="solicitud-container">
    <div className="solicitud-card">

      <h3>Solicitud de crédito</h3>
      <p>Completa los datos para enviar tu solicitud</p>

      <form className="solicitud-form" onSubmit={handleSubmit}>
        <h4>Datos Personales</h4>

        <div className="form-group">
          <label htmlFor="nombre">Nombre completo</label>
          <input id="nombre" value={form.name} onChange={e=>update("name",e.target.value)}/>
        </div>
        {errors.name&&<p style={{color:"crimson"}}>{errors.name}</p>}

        <div className="form-group">
          <label htmlFor="docType">Tipo de documento</label>
          <select id="docType" value={form.docType} onChange={e=>update("docType",e.target.value)}>
            <option value="">Seleccione</option>
            <option value="CC">Cédula de ciudadanía</option>
            <option value="CE">Cédula extranjera</option>
          </select>
        </div>
        {errors.docType&&<p style={{color:"crimson"}}>{errors.docType}</p>}

        <div className="form-group">
          <label htmlFor="docNumber">Número de documento</label>
          <input id="docNumber" value={form.docNumber} onChange={e=>update("docNumber",e.target.value)} placeholder="Ej: 1025487963"/>
        </div>
        {errors.docNumber&&<p style={{color:"crimson"}}>{errors.docNumber}</p>}

        <div className="form-group">
          <label htmlFor="telefono">Número telefónico</label>
          <input id="telefono" value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="Ej: 3207875462"/>
        </div>
        {errors.phone&&<p style={{color:"crimson"}}>{errors.phone}</p>}

        <div className="form-group">
          <label htmlFor="correo">Correo electrónico</label>
          <input id="correo" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="ejemplo@correo.com"/>
        </div>
        {errors.email&&<p st
