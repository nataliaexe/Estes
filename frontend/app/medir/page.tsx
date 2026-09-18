"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, CheckCircle2, AlertTriangle, XCircle, RotateCcw, Info } from "lucide-react";
import { toast } from "sonner";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function MedirPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [analisando, setAnalisando] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galeriaRef = useRef<HTMLInputElement>(null);

  async function analisar(file: File) {
    setAnalisando(true);
    setResultado(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const fd = new FormData();
    fd.append("arquivo", file);

    try {
      const r = await fetch(`${API}/imagens/analisar`, {
        method: "POST",
        body: fd,
      });
      if (!r.ok) throw new Error();
      const dados = await r.json();
      setResultado(dados);
      toast.success("Analysis complete");
    } catch {
      toast.error("Analysis failed");
    } finally {
      setAnalisando(false);
    }
  }

  function reset() {
    setPreview(null);
    setResultado(null);
  }

  const corResultado = resultado?.classificacao === "segura"
    ? { bg: "bg-green-50", border: "border-green-500", text: "text-green-900", icone: CheckCircle2, label: "SAFE", desc: "Water appears safe for consumption." }
    : resultado?.classificacao === "atencao"
    ? { bg: "bg-yellow-50", border: "border-yellow-500", text: "text-yellow-900", icone: AlertTriangle, label: "CAUTION", desc: "Possible contamination. Filter before consuming." }
    : { bg: "bg-red-50", border: "border-red-500", text: "text-red-900", icone: XCircle, label: "CONTAMINATED", desc: "Contamination detected. Do not consume. Filter and report." };

  return (
    <div className="min-h-screen bg-elfo-creme">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10 text-center">
          <h1 className="font-display font-black text-4xl md:text-5xl text-elfo-verde-escuro mb-4">
            Measure with your phone
          </h1>
          <p className="text-lg text-elfo-cinza">
            No hardware needed. Just the CQD strip, UV light, and your phone.
          </p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm p-8 border border-elfo-dourado/10">
          {!preview ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-elfo-verde-vivo/10 mb-6">
                  <Camera className="text-elfo-verde-vivo" size={40} />
                </div>
                <h2 className="font-display font-bold text-xl text-elfo-verde-escuro mb-2">
                  Take a photo of the strip
                </h2>
                <p className="text-sm text-elfo-cinza mb-8">
                  Dip the strip in water, then photograph it under UV light in
                  a dark box.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-elfo-verde-escuro text-elfo-off-white hover:bg-elfo-verde-vivo hover:text-elfo-verde-escuro transition-all group"
                >
                  <Camera size={32} className="group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Take photo</span>
                </button>
                <button
                  onClick={() => galeriaRef.current?.click()}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-elfo-verde-escuro text-elfo-verde-escuro hover:bg-elfo-verde-escuro hover:text-elfo-off-white transition-all group"
                >
                  <Upload size={32} className="group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Upload</span>
                </button>
              </div>

              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && analisar(e.target.files[0])}
              />
              <input
                ref={galeriaRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && analisar(e.target.files[0])}
              />
            </>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border-2 border-elfo-dourado/20">
                <img src={preview} alt="preview" className="w-full max-h-96 object-contain bg-black" />
                {analisando && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-elfo-verde-vivo border-t-transparent rounded-full"
                    />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {resultado && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-l-4 rounded-2xl p-6 ${corResultado.bg} ${corResultado.border}`}
                  >
                    <div className="flex items-start gap-4">
                      <corResultado.icone
                        size={40}
                        className={corResultado.text}
                      />
                      <div className="flex-1">
                        <p className={`font-display font-black text-2xl ${corResultado.text}`}>
                          {corResultado.label}
                        </p>
                        <p className={`text-sm mt-1 ${corResultado.text}`}>
                          {corResultado.desc}
                        </p>
                        <div className={`mt-4 pt-4 border-t ${corResultado.border} flex gap-6 text-xs ${corResultado.text} opacity-75`}>
                          <span>RGB ({resultado.r?.toFixed(0)}, {resultado.g?.toFixed(0)}, {resultado.b?.toFixed(0)})</span>
                          <span>Intensity: {resultado.intensidade?.toFixed(0)}</span>
                          <span>Confidence: {(resultado.confianca * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>

                    {resultado.classificacao === "contaminada" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 pt-4 border-t border-red-300"
                      >
                        <p className="text-sm font-semibold text-red-900 mb-2">
                          Recommended actions:
                        </p>
                        <ul className="text-xs text-red-800 space-y-1 list-disc list-inside">
                          <li>Do not drink this water</li>
                          <li>Filter with the Estes biochar filter</li>
                          <li>Report to local authorities</li>
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!analisando && (
                <button
                  onClick={reset}
                  className="w-full py-3 rounded-xl border-2 border-elfo-verde-escuro text-elfo-verde-escuro hover:bg-elfo-verde-escuro hover:text-elfo-off-white transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Take another photo
                </button>
              )}
            </div>
          )}
        </div>

        {/* Caixinha */}
        <div className="mt-8 bg-gradient-to-br from-elfo-verde-vivo/10 to-elfo-dourado/10 rounded-2xl p-6 border border-elfo-dourado/20">
          <div className="flex items-start gap-3 mb-4">
            <Info className="text-elfo-dourado flex-shrink-0 mt-0.5" size={20} />
            <h3 className="font-display font-bold text-lg text-elfo-verde-escuro">
              How to build the black box
            </h3>
          </div>
          <ol className="text-sm text-elfo-cinza space-y-2 list-decimal list-inside">
            <li>Cardboard box (15×15×10 cm) painted black inside</li>
            <li>Hole on top for the phone camera</li>
            <li>UV LED (395nm) on the internal side</li>
            <li>Strip fixed at the bottom with tape</li>
            <li>Close the box and take the photo</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
