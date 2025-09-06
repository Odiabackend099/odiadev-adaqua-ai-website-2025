import React from "react";
const PERSONAS = ["Ezinne","Lexi","ODIA","Atlas"] as const;
export type Persona = typeof PERSONAS[number];

export function PersonaSelect({ value, onChange }:{ value:Persona; onChange:(p:Persona)=>void }) {
  return (
    <select className="bg-navySoft border border-gold rounded px-2 py-1" value={value} onChange={e=>onChange(e.target.value as Persona)}>
      {PERSONAS.map(p=> <option key={p} value={p}>{p}</option>)}
    </select>
  );
}
