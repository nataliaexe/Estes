#!/bin/bash
# Teste rapido da API Estes
API="http://localhost:8000/api/v1"

echo "=== 1. HEALTH ==="
curl -s http://localhost:8000/health | python3 -m json.tool

echo ""
echo "=== 2. IA STATUS ==="
curl -s $API/ia/status | python3 -m json.tool

echo ""
echo "=== 3. ESTATISTICAS ATLAS ==="
curl -s $API/casos/estatisticas | python3 -m json.tool

echo ""
echo "=== 4. LISTAR CASOS (categoria=mercurio) ==="
curl -s "$API/casos?categoria=mercurio" | python3 -m json.tool | head -30

echo ""
echo "=== 5. BUSCA SEMANTICA ==="
curl -s -X POST $API/casos/buscar \
  -H "Content-Type: application/json" \
  -d '{"consulta": "queimada perto de mim", "limite": 3}' \
  | python3 -m json.tool | head -40

echo ""
echo "=== 6. DETALHE CASO #1 ==="
curl -s $API/casos/1 | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('Titulo:', d['titulo'])
print('Categoria:', d['categoria'])
print('Historia:', d['historia'][:150] + '...')
"

echo ""
echo "=== 7. REGISTRAR USUARIO ==="
curl -s -X POST $API/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Teste",
    "email": "maria@teste.com",
    "senha": "senha12345",
    "perfil": "cidadao",
    "uf": "MG"
  }' | python3 -m json.tool | head -20
