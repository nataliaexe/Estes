"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Flame } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type Ponto = {
  type: string;
  geometry: { type: string; coordinates: [number, number] };
  properties: any;
};

export function MapaReal() {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        const r = await fetch(`${API}/mapa/pontos`);
        const d = await r.json();
        setPontos(d.features || []);
      } catch {
        setPontos([]);
      } finally {
        setLoading(false);
      }
    }
    carregar();
    const interval = setInterval(carregar, 60000);
    return () => clearInterval(interval);
  }, []);

  const casos = pontos.filter((p) => p.properties.tipo === "caso");
  const medicoes = pontos.filter((p) => p.properties.tipo === "medicao");
  const noticias = pontos.filter((p) => p.properties.tipo === "noticia");

  if (loading) {
    return (
      <div className="h-[500px] bg-elfo-verde-escuro/20 rounded-2xl flex items-center justify-center">
        <p className="text-elfo-cinza">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-elfo-dourado/20">
      <MapContainer
        center={[-15.79, -47.88]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        {casos.map((c, i) => (
          <CircleMarker
            key={`caso-${i}`}
            center={[c.geometry.coordinates[1], c.geometry.coordinates[0]]}
            radius={8}
            pathOptions={{
              color: "#114224",
              fillColor: "#4BF98D",
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <strong>Case #{c.properties.numero}</strong>
              <br />
              {c.properties.titulo}
              <br />
              <em>{c.properties.evidencia}</em>
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
              <strong>{m.properties.resultado}</strong>
              <br />
              Confidence: {(m.properties.confianca * 100).toFixed(0)}%
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
              <strong>{n.properties.titulo}</strong>
              <br />
              {n.properties.fonte}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Contadores */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 text-xs z-[1000] space-y-1">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-elfo-verde-escuro" />
          <span className="font-semibold">{casos.length}</span> cases
        </div>
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-red-500" />
          <span className="font-semibold">{medicoes.length}</span> measurements
        </div>
      </div>

      {/* Legenda */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 text-xs z-[1000]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-elfo-verde-vivo border border-elfo-verde-escuro" />
          <span>Atlas cases</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span>Contaminated</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-elfo-dourado" />
          <span>News</span>
        </div>
      </div>
    </div>
  );
}
