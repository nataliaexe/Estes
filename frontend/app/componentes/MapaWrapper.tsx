"use client";

import dynamic from "next/dynamic";

const Mapa = dynamic(() => import("./Mapa"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-terra-50 rounded-xl">
      <p className="text-terra-500">Carregando mapa...</p>
    </div>
  ),
});

export default function MapaWrapper() {
  return <Mapa />;
}
