"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api, Caso, Foco } from "../lib/api";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
);

const CENTROS_UF: Record<string, [number, number]> = {
  AC: [-9.97, -67.81],
  AM: [-3.1, -60.0],
  BA: [-12.97, -38.5],
  GO: [-16.68, -49.25],
  MG: [-18.51, -44.31],
  MT: [-12.64, -55.42],
  PA: [-3.79, -52.48],
  PE: [-8.05, -34.88],
  PR: [-25.42, -49.27],
  RJ: [-22.9, -43.2],
  RO: [-8.76, -63.9],
  RR: [2.82, -60.67],
  RS: [-30.03, -51.22],
  SC: [-27.24, -50.21],
  SP: [-23.55, -46.63],
  TO: [-10.18, -48.33],
};

export default function Mapa() {
  const [casos, setCasos] = useState<Caso[]>([]);
  const [focos, setFocos] = useState<Foco[]>([]);
  const [climaTexto, setClimaTexto] = useState<string>("");
  const [posicao, setPosicao] = useState<[number, number] | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizadoEm, setAtualizadoEm] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosicao([lat, lon]);

        try {
          const [c, q] = await Promise.all([
            api.clima(lat, lon),
            api.queimadas(lat, lon, 200),
          ]);
          setClimaTexto(
            `${c.temperatura_c.toFixed(1)}°C, ${c.condicao}. ` +
              `Risco queimada: ${c.risco_queimada}. ` +
              `Risco enchente: ${c.risco_enchente}.`
          );
          setFocos(q.focos);
          setAtualizadoEm(new Date().toLocaleTimeString("pt-BR"));
        } catch (e) {
          console.error(e);
        } finally {
          setCarregando(false);
        }
      },
      () => {
        // Sem geolocalizacao: centraliza no Brasil
        setPosicao([-15.79, -47.88]);
        setCarregando(false);
      }
    );
  }, []);

  useEffect(() => {
    api.casos().then(setCasos).catch(console.error);
  }, []);

  if (!posicao) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-terra-50 rounded-xl">
        <p className="text-terra-500">Carregando mapa...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={posicao}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {casos.map((c) => {
          const centro = CENTROS_UF[c.uf];
          if (!centro) return null;
          return (
            <CircleMarker
              key={c.id}
              center={centro}
              radius={8}
              pathOptions={{
                color: "#14532d",
                fillColor: "#22c55e",
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>
                    Caso #{c.numero} — {c.titulo}
                  </strong>
                  <br />
                  <span className="text-xs text-gray-600">
                    {c.categoria} · {c.uf} · {c.evidencia}
                  </span>
                  <br />
                  <a
                    href={`/caso/${c.numero}`}
                    className="text-green-700 underline text-xs"
                  >
                    Ver detalhes
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
        {focos.slice(0, 500).map((f, i) => (
          <CircleMarker
            key={`foco-${i}`}
            center={[f.latitude, f.longitude]}
            radius={3}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#ef4444",
              fillOpacity: 0.8,
              weight: 1,
            }}
          >
            <Popup>
              <div className="text-xs">
                <strong>Foco de queimada</strong>
                <br />
                {f.data} {f.hora} · {f.satelite}
                <br />
                FRP: {f.frp.toFixed(2)}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 max-w-xs z-[1000]">
        {carregando ? (
          <p className="text-sm text-gray-500">Carregando dados...</p>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-1">Sua região</p>
            <p className="text-sm text-gray-800">{climaTexto || "Sem dados"}</p>
            <p className="text-xs text-red-600 mt-2 font-semibold">
              {focos.length} foco(s) de queimada em 200 km
            </p>
            {atualizadoEm && (
              <p className="text-xs text-gray-400 mt-1">
                Atualizado {atualizadoEm}
              </p>
            )}
          </>
        )}
      </div>

      <div className="absolute bottom-4 right-4 bg-white/95 rounded-xl shadow-lg p-3 z-[1000] text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-verde-500"></span>
          <span>Caso do Atlas</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          <span>Foco de queimada</span>
        </div>
      </div>
    </div>
  );
}
