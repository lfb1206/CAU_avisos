'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DynamicForm from '@/resources/form/DynamicForm';
import { generateAvisoSalidaPDF } from '@/resources/lib/pdfUtils';

const avisoSalida = {
  contactoCAU: "Martina Molina",
  telefonoContacto: "+56912345678",
  emailContacto: "mmolina@club.cl",
  fechaHoraReporteRegreso: "25/07/2025 20:00",
  actividad: "Ascenso técnico",
  cerroOSector: "Cerro Tenerife",
  ruta: "Cara norte",
  linkPronostico: "https://weather.com",
  linkRuta: "https://link-a-la-ruta.cl",
  participantes: [
    {
      nombre: "Lucas Fernandez",
      rut: "12.345.678-9",
      telefono: "+56987654321",
      contactoEmergencia: "Ana Ruiz",
      telefonoEmergencia: "+56911223344"
    }
  ],
  itinerario: [
    {
      fecha: "25/07",
      actividad: "Ascenso hasta campamento base",
      horario: "08:00 - 14:00",
      altitud: "1500 msnm"
    },
    {
      fecha: "26/07",
      actividad: "Cumbre y descenso",
      horario: "05:00 - 17:00",
      altitud: "2500 msnm"
    }
  ],
  gestionRiesgos: [
    {
      supuesto: "Tormenta eléctrica",
      riesgo: "Descargas eléctricas",
      lugar: "Cumbre",
      acciones: "Revisar pronóstico y reprogramar si es necesario"
    }
  ],
  imagenPronosticoUrl: "https://url-a-imagen.png",
  equipo: "Crampones, piolet, arnés, cuerda, casco",
  transporte: "Vehículo particular",
  datosMedicos: [
    {
      nombre: "Lucas Fernandez",
      enfermedades: "Asma leve",
      medicamentos: "Inhalador Salbutamol",
      grupoSangre: "O+",
      sistemaSalud: "Fonasa",
      seguros: "Seguro de montaña privado",
      comentarios: "No antecedentes graves"
    }
  ]
};


export default function Home() {
  const router = useRouter();

  const handleSubmit = async (values) => {
    generateAvisoSalidaPDF(avisoSalida);
  };

  return (
    <div className="p-6 space-y-6">
      

      <div className="w-full md:w-3/4 mb-20">
        <DynamicForm
          fields={{}}
          onSubmit={handleSubmit}
          submitLabel="Crear Agente"
        />
      </div>
    </div>
  );
}