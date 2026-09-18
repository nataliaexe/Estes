#!/bin/bash
API="http://localhost:8000/api/v1"

echo "════════════════════════════════════════════════════════"
echo "  TESTE FINAL DO BACKEND — ESTES"
echo "════════════════════════════════════════════════════════"

echo ""
echo "=== 1. HEALTH GERAL ==="
curl -s http://localhost:8000/health | python3 -m json.tool

echo ""
echo "=== 2. HEALTH APIs EXTERNAS ==="
curl -s $API/health/apis | python3 -c "
import sys,json
d = json.load(sys.stdin)
for s in d['servicos']:
    status = 'OK' if s['ok'] else 'FALHOU'
    print(f\"  [{status}] {s['nome']}: {s['latencia_ms']}ms\")
print(f\"  Todos OK: {d['todos_ok']}\")
"

echo ""
echo "=== 3. CIRCUIT BREAKER ==="
curl -s $API/ia/circuit-breaker | python3 -m json.tool

echo ""
echo "=== 4. DASHBOARD ==="
curl -s $API/dashboard | python3 -c "
import sys,json
d = json.load(sys.stdin)
print(f\"  Casos: {d['total_casos']}\")
print(f\"  Medicoes: {d['total_medicoes']}\")
print(f\"  Noticias: {d['total_noticias']}\")
print(f\"  Usuarios: {d['total_usuarios']}\")
"

echo ""
echo "=== 5. MAPA GEOJSON ==="
curl -s $API/mapa/pontos | python3 -c "
import sys,json
d = json.load(sys.stdin)
tipos = {}
for f in d['features']:
    t = f['properties']['tipo']
    tipos[t] = tipos.get(t, 0) + 1
print(f\"  Total: {d['total']}\")
print(f\"  Por tipo: {tipos}\")
"

echo ""
echo "=== 6. BUSCA SEMANTICA NO ATLAS ==="
curl -s -X POST $API/casos/buscar \
  -H "Content-Type: application/json" \
  -d '{"consulta": "casca de arroz enchente", "limite": 3}' \
  | python3 -c "
import sys,json
d = json.load(sys.stdin)
for r in d:
    print(f\"  [{r['similaridade']:.3f}] #{r['caso']['numero']} {r['caso']['titulo'][:50]}\")
"

echo ""
echo "=== 7. IA PERGUNTAR (casca de cafe) ==="
time curl -s -X POST $API/ia/perguntar \
  -H "Content-Type: application/json" \
  -d '{"pergunta": "tenho casca de cafe e o rio ta contaminado"}' \
  | python3 -c "
import sys,json
d = json.load(sys.stdin)
print(f\"  Provedor: {d['provedor']}\")
print(f\"  Intencao: {d['intencao']}\")
print(f\"  Motor cientifico: {d.get('usou_motor_cientifico', False)}\")
print(f\"  Fontes: {len(d['fontes'])}\")
"

echo ""
echo "=== 8. CLIMA (Ouro Preto) ==="
curl -s "$API/clima?lat=-20.3856&lon=-43.5035" | python3 -c "
import sys,json
d = json.load(sys.stdin)
print(f\"  {d['temperatura_c']}C, {d['condicao']}\")
print(f\"  Risco queimada: {d['risco_queimada']}\")
"

echo ""
echo "=== 9. QUEIMADAS (Pantanal) ==="
curl -s "$API/queimadas?lat=-17.5&lon=-56.5&raio_km=200&dias=1" | python3 -c "
import sys,json
d = json.load(sys.stdin)
print(f\"  Total focos: {d['total']}\")
"

echo ""
echo "=== 10. PREDICAO ==="
curl -s "$API/predicao?lat=-17.5&lon=-56.5&uf=MT" | python3 -c "
import sys,json
d = json.load(sys.stdin)
print(f\"  Risco geral: {d['risco_geral']}\")
print(f\"  Riscos identificados: {len(d['riscos'])}\")
for r in d['riscos']:
    print(f\"    - {r['tipo']}: {r['nivel']}\")
"

echo ""
echo "=== 11. CONTRIBUICOES ==="
curl -s "$API/contribuicoes?status=validado" | python3 -c "
import sys,json
d = json.load(sys.stdin)
print(f\"  Total validadas: {len(d)}\")
"

echo ""
echo "=== 12. EXPORTACAO CSV ==="
curl -s $API/exportar/casos.csv | head -2

echo ""
echo "=== 13. ACESSIBILIDADE ==="
curl -s $API/acessibilidade/config | python3 -c "
import sys,json
d = json.load(sys.stdin)
print(f\"  Modos: {len(d['modos'])}\")
print(f\"  Idiomas de voz: {d['idiomas_voz']}\")
print(f\"  Recursos: {d['recursos']}\")
"

echo ""
echo "════════════════════════════════════════════════════════"
echo "  FIM DO TESTE"
echo "════════════════════════════════════════════════════════"
