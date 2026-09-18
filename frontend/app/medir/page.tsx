"use client";

import { useRef, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function MedirPage() {
  const [branco, setBranco] = useState<{ r: number; g: number; b: number } | null>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const brancoRef = useRef<HTMLInputElement>(null);
  const medicaoRef = useRef<HTMLInputElement>(null);

  async function analisar(file: File, calibracao = false) {
    setCarregando(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);

      // Análise local no navegador (rápida, offline)
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);

        const w = img.width, h = img.height;
        const data = ctx.getImageData(w * 0.25, h * 0.25, w * 0.5, h * 0.5).data;

        let r = 0, g = 0, b = 0;
        const n = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i]; g += data[i+1]; b += data[i+2];
        }
        r /= n; g /= n; b /= n;

        if (calibracao) {
          setBranco({ r, g, b });
          setResultado(null);
          setCarregando(false);
          return;
        }

        // Envia a imagem real pro backend (analise oficial)
        const fd = new FormData();
        fd.append("arquivo", file);

        try {
          const resp = await fetch(`${API}/imagens/analisar`, {
            method: "POST",
            body: fd,
          });
          const dados = await resp.json();
          setResultado(dados);
        } catch {
          setResultado({ erro: "Falha ao analisar" });
        } finally {
          setCarregando(false);
        }
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  }

  const corClass = resultado?.classificacao === "segura"
    ? "bg-green-50 border-green-500 text-green-900"
    : resultado?.classificacao === "atencao"
    ? "bg-yellow-50 border-yellow-500 text-yellow-900"
    : "bg-red-50 border-red-500 text-red-900";

  return (
    <div className="min-h-screen bg-terra-50 p-6">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-verde-900">Medir com o celular</h1>
          <p className="text-gray-600 mt-1">
            Sem hardware. Só precisa da tira de CQD, LED UV e o celular.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <section>
            <h2 className="font-bold text-verde-900 mb-2">1. Calibrar (opcional)</h2>
            <p className="text-sm text-gray-600 mb-3">
              Fotografe uma tira limpa. Serve de referência.
            </p>
            <button
              onClick={() => brancoRef.current?.click()}
              className="bg-terra-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-terra-900 transition"
            >
              Escolher foto da tira limpa
            </button>
            <input
              ref={brancoRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && analisar(e.target.files[0], true)}
            />
            {branco && (
              <p className="text-xs text-green-600 mt-2">
                ✓ Calibrado: RGB ({branco.r.toFixed(0)}, {branco.g.toFixed(0)}, {branco.b.toFixed(0)})
              </p>
            )}
          </section>

          <section>
            <h2 className="font-bold text-verde-900 mb-2">2. Medir</h2>
            <p className="text-sm text-gray-600 mb-3">
              Mergulhe a tira na água, fotografe sob luz UV.
            </p>
            <button
              onClick={() => medicaoRef.current?.click()}
              disabled={carregando}
              className="bg-verde-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-verde-700 transition disabled:opacity-50"
            >
              {carregando ? "Analisando..." : "Fotografar a tira"}
            </button>
            <input
              ref={medicaoRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && analisar(e.target.files[0])}
            />
          </section>

          {preview && (
            <div className="border rounded-lg p-2">
              <img src={preview} alt="preview" className="max-h-48 mx-auto rounded" />
            </div>
          )}

          {resultado && !resultado.erro && (
            <div className={`border-l-4 rounded-lg p-4 ${corClass}`}>
              <p className="font-bold text-lg capitalize">{resultado.classificacao}</p>
              <p className="text-sm mt-1">{resultado.recomendacao}</p>
              <p className="text-xs mt-2 opacity-70">
                RGB ({resultado.r?.toFixed(0)}, {resultado.g?.toFixed(0)}, {resultado.b?.toFixed(0)})
                · Intensidade {resultado.intensidade?.toFixed(0)}
                · Confiança {(resultado.confianca * 100).toFixed(0)}%
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-verde-50 rounded-xl p-4 border border-verde-500">
          <h3 className="font-bold text-verde-900 mb-1">Como montar a caixinha</h3>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>Caixa de papelão preta (15x15x10 cm)</li>
            <li>Furo no topo pra câmera do celular</li>
            <li>LED UV na lateral interna</li>
            <li>Tira no fundo, presa com fita</li>
            <li>Feche a caixa e fotografe</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
