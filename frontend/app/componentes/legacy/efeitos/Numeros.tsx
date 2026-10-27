"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Contador({
  valor,
  duracao = 2,
}: {
  valor: number;
  duracao?: number;
}) {
  const [atual, setAtual] = useState(0);
  const ref = useRef(null);
  const emVista = useInView(ref, { once: true });

  useEffect(() => {
    if (!emVista) return;
    let inicio: number | null = null;
    const passo = (ts: number) => {
      if (inicio === null) inicio = ts;
      const progresso = Math.min((ts - inicio) / (duracao * 1000), 1);
      setAtual(Math.floor(progresso * valor));
      if (progresso < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }, [emVista, valor, duracao]);

  return <span ref={ref}>{atual.toLocaleString("pt-BR")}</span>;
}

const NUMEROS = [
  { valor: 22, rotulo: "casos no Atlas", sufixo: "" },
  { valor: 5, rotulo: "regiões do Brasil", sufixo: "" },
  { valor: 9, rotulo: "categorias de problema", sufixo: "" },
  { valor: 100, rotulo: "aberto e gratuito", sufixo: "%" },
];

export function Numeros() {
  return (
    <section className="bg-elfo-verde-escuro text-elfo-off-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {NUMEROS.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="font-display font-black text-5xl md:text-6xl text-elfo-verde-vivo mb-2">
                <Contador valor={n.valor} />
                {n.sufixo}
              </div>
              <div className="text-sm text-elfo-off-white/70 uppercase tracking-wider">
                {n.rotulo}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
