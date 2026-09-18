"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapPin, Flame } from "lucide-react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

type Ponto = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: Record<string, any>;
};

export function MapaInterativo() {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/mapa/pontos`
    )
      .then((r) => r.json())
      .then((d) => setPontos(d.features || []))
      .catch(() => setPontos([]))
      .finally(() => setLoading(false));
  }, []);

  const casos = pontos.filter((p) => p.properties.tipo === "caso");
  const medicoes = pontos.filter((p) => p.properties.tipo === "medicao");
  const noticias = pontos.filter((p) => p.properties.tipo === "noticia");

  return (
    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl border border-elfo-dourado/20">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-elfo-creme">
          <span className="text-elfo-cinza">Carregando mapa...</span>
        </div>
      ) : (
        <MapContainer
          center={[-15.79, -47.88]}
          zoom={4}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CartoDB"
          />

          {casos.map((c, i) => (
            <CircleMarker
              key={`caso-${i}`}
              center={[c.geometry.coordinates[1], c.geometry.coordinates[0]]}
              radius={8}
              pathOptions={{
                color: "#114224",
                fillColor: "#4BF98D",
                fillOpacity: 0.8,
                weight: 2,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <strong>
                    #{c.properties.numero} — {c.properties.titulo}
                  </strong>
                  <br />
                  <span className="text-xs text-gray-600">
                    {c.properties.categoria} · {c.properties.evidencia}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {medicoes.slice(0, 100).map((m, i) => (
            <CircleMarker
              key={`med-${i}`}
              center={[m.geometry.coordinates[1], m.geometry.coordinates[0]]}
              radius={5}
              pathOptions={{
                color: m.properties.resultado === "contaminada" ? "#dc2626" : "#f59e0b",
                fillColor: m.properties.resultado === "contaminada" ? "#ef4444" : "#fbbf24",
                fillOpacity: 0.7,
                weight: 1,
              }}
            >
              <Popup>
                <div className="text-xs">
                  <strong>Medição: {m.properties.resultado}</strong>
                  <br />
                  Confiança: {(m.properties.confianca * 100).toFixed(0)}%
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {noticias.slice(0, 50).map((n, i) => (
            <CircleMarker
              key={`not-${i}`}
              center={[n.geometry.coordinates[1], n.geometry.coordinates[0]]}
              radius={4}
              pathOptions={{
                color: "#A68A42",
                fillColor: "#CBB275",
                fillOpacity: 0.6,
                weight: 1,
              }}
            >
              <Popup>
                <div className="text-xs">
                  <strong>{n.properties.titulo}</strong>
                  <br />
                  {n.properties.fonte}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      )}

      {/* Legenda */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 text-xs z-[1000]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-elfo-verde-vivo border border-elfo-verde-escuro" />
          <span>Casos do Atlas</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span>Medições contaminadas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-elfo-dourado" />
          <span>Notícias</span>
        </div>
      </div>

      {/* Contadores */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 text-xs z-[1000] space-y-1">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-elfo-verde-escuro" />
          <span className="font-semibold">{casos.length}</span> casos
        </div>
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-red-500" />
          <span className="font-semibold">{medicoes.length}</span> medições
        </div>
      </div>
    </div>
  );
}
