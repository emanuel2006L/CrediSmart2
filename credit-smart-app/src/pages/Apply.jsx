// src/pages/Apply.jsx
import React, {    useEffect,     useMemo, useState } from "react";
import creditsData   from "../data/creditsData";

function formatCurrency(num){
if(!num)return "0";
 return Number(num).toLocaleString("es-CO"); }

export default function Apply( ){

 const   [form,setForm] = useState({
name:"", docType:"" , phone:"",
 email:"", creditId:"", amount:"", term:""
 });

  const [errors,setErrors]   = useState({});
 const [requests,setRequests]=useState([]); const[successMsg,setSuccessMsg]=useState("");

const selectedCredit= useMemo(()=> creditsData.find(c=> String(c.id)===String(form.creditId)),[ form.creditId ]);

useEffect(()=>{
const e={};
if(form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email="Correo inválido";
 if(form.phone && !/^\d{7,15}$/.test(form.phone)) e.phone="Número inválido";
   if(form.amount && Number(form.amount)<=0) e.amount="Monto debe ser mayor a 0";
if(form.term&&(Number(form.term)<=0||Number(form.term)>360)) e.term="Plazo inválido";
  if(!form.name) e.name="Nombre requerido";
setErrors(e);
},[form]);

const monthlyInstallment= useMemo(()=>{
 if(!selectedCredit||!form.amount||!form.term) return 0;
   const P=Number(form.amount); const n=Number(form.term);
const iAnnual= selectedCredit.interestEA/100;
 const iMonthly= Math.pow(1+iAnnual,1/12)-1;
const cuota=(P*iMonthly)/(1-Math.pow(1+iMonthly,-n));
  return cuota;
},[selectedCredit,form.amount,form.term]);

function update(field,value){
setForm(prev=>({...prev,[field]:value}));
   setSuccessMsg("");
}

function handleSubmit(e){
 e.preventDefault();
 const finalErrors={};
 if(!form.name) finalErrors.name="Nombre requerido";
 if(!form.email||!/^\S+@\S+\.\S+$/.test(form.email)) finalErrors.email="Correo inválido";
if(!form.phone||!/^\d{7,15}$/.test(form.phone)) finalErrors.phone="Teléfono inválido";
 if(!form.creditId) finalErrors.creditId="Selecciona un crédito";
if(!form.amount||Number(form.amount)<=0) finalErrors.amount="Monto inválido";
 if(!form.term||Number(form.term)<=0) finalErrors.term="Plazo inválido";

 if(Object.keys(finalErrors).length){
setErrors(finalErrors); setSuccessMsg("");
 return;
 }

 setRequests(prev=>[...prev,{...form,id:Date.now(), monthly:Math.round(monthlyInstallment)}]);

 setForm({ name:"",docType:"",phone:"",email:"",creditId:"",amount:"",term:"" });
 setErrors({});
 setSuccessMsg("Solicitud enviada correctamente. Verifica en la lista de solicitudes.");

 setTimeout(()=>setSuccessMsg(""),4000);
}

return(
<div className="container">

 <section className="solicitud-container">
   <div className="solicitud-card">

<h3>Solicitud de crédito</h3>
 <p>Completa los datos para enviar tu solicitud</p>

<form className="solicitud-form"   onSubmit={handleSubmit}> 
<h4>Datos Personales</h4>

<div className="form-group">
<label htmlFor="nombre">Nombre completo</label>
<input id="nombre" value={form.name}
 onChange={e=>update("name",e.target.value)} />
</div>
{errors.name && <p style={{color:"crimson"}}>{errors.name}</p>}

<div className="form-group">
<label htmlFor="documento">Tipo de documento</label>
<select id="documento" value={form.docType}
 onChange={e=>update("docType",e.target.value)}>
<option value="">Seleccione</option>
<option value="CC">Cédula de ciudadanía</option>
<option value="CE">Cédula extranjera</option>
</select>
</div>

<div className="form-group">
<label htmlFor="telefono">Número telefónico</label>
<input id="telefono" value={form.phone}
onChange={e=>update("phone",e.target.value)} placeholder="Ej: 3207875462"/>
</div>
{errors.phone && <p style={{color:"crimson"}}>{errors.phone}</p>}

<div className="form-group">
<label htmlFor="correo">Correo electrónico</label>
 <input id="correo"
value={form.email} onChange={e=>update("email",e.target.value)}
 placeholder="ejemplo@correo.com"/>
</div>
{errors.email && <p style={{color:"crimson"}}>{errors.email}</p>}

<h4>Datos del crédito</h4>

<div className="form-group">
<label htmlFor="tipoCredito">Tipo de crédito</label>
<select id="tipoCredito" value={form.creditId}
 onChange={e=>update("creditId",e.target.value)}>
<option value="">Seleccione un crédito</option>
{creditsData.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
</select>
</div>
{errors.creditId && <p style={{color:"crimson"}}>{errors.creditId}</p>}

<div className="form-group">
<label htmlFor="monto">Monto solicitado</label>
 <input id="monto" type="number" value={form.amount}
 onChange={e=>update("amount",e.target.value)} placeholder="Ej: 20000000"/>
</div>
{errors.amount && <p style={{color:"crimson"}}>{errors.amount}</p>}

<div className="form-group">
<label htmlFor="plazo">Plazo en meses</label>
<input id="plazo" type="number" value={form.term}
onChange={e=>update("term",e.target.value)} placeholder="Ej: 24"/>
</div>
{errors.term && <p style={{color:"crimson"}}>{errors.term}</p>}

<div style={{   marginTop:12}}>
<p>Cuota mensual estimada: <strong>${formatCurrency(Math.round(monthlyInstallment))}</strong></p>
</div>

<div className="form-actions">
<button className="btn-primary" type="submit">Enviar solicitud</button>
</div>
</form>

{successMsg && <p style={{color:"green",marginTop:12}}>{successMsg}</p>}

{requests.length>0 && <>
<h4 style={{marginTop:18}}>Solicitudes en memoria</h4>
<ul>
{requests.map(r=>(
<li key={r.id}>
{r.name} - {creditsData.find(c=>String(c.id)===String(r.creditId))?.name||"—"}
 - Monto: ${formatCurrency(r.amount)} - Cuota: ${formatCurrency(r.monthly)}
</li>
))}
</ul>
</>}
</div>
</section>
</div>
);
}
