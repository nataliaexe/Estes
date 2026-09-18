#!/bin/bash
API="http://localhost:8000/api/v1"

echo "=== 1. Registra usuario comum (cidadao) ==="
TOKEN=$(curl -s -X POST $API/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Cidada",
    "email": "maria'$(date +%s)'@teste.com",
    "senha": "senha12345",
    "perfil": "cidadao",
    "uf": "MG"
  }' | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo "Token: ${TOKEN:0:30}..."

echo ""
echo "=== 2. Maria posta contribuicao ==="
RESP=$(curl -s -X POST $API/contribuicoes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "tipo": "historia",
    "titulo": "Uso de casca de cafe no tratamento de agua",
    "conteudo": "Meu avo sempre usou a casca do cafe para limpar a agua do rio. Fervia, secava e passava num pano. A agua ficava mais clara e sem gosto.",
    "uf": "MG",
    "municipio": "Ouro Preto"
  }')
echo "$RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'ID: {d[\"id\"]}'); print(f'Status: {d[\"status\"]}'); print(f'Autor: {d[\"autor\"][\"nome\"]}')"

CID=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

echo ""
echo "=== 3. Registra curador ==="
TOKEN_CUR=$(curl -s -X POST $API/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dr. Pesquisador",
    "email": "pesq'$(date +%s)'@teste.com",
    "senha": "senha12345",
    "perfil": "curador",
    "uf": "SP"
  }' | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo "Curador registrado"

echo ""
echo "=== 4. Outro usuario vota +1 ==="
curl -s -X POST $API/contribuicoes/$CID/votar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_CUR" \
  -d '{"valor": 1}' | python3 -m json.tool

echo ""
echo "=== 5. Curador valida ==="
curl -s -X POST $API/contribuicoes/$CID/validar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_CUR" \
  -d '{
    "aprovado": true,
    "motivo": "Uso documentado em literatura (biochar de casca de cafe)."
  }' | python3 -m json.tool

echo ""
echo "=== 6. Curador comenta ==="
curl -s -X POST $API/contribuicoes/$CID/comentar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_CUR" \
  -d '{"conteudo": "Confirmado por estudo de 2024 (DOI: 10.xxxx)."}' \
  | python3 -m json.tool

echo ""
echo "=== 7. Detalhe completo ==="
curl -s $API/contribuicoes/$CID | python3 -m json.tool | head -40

echo ""
echo "=== 8. Lista validados ==="
curl -s "$API/contribuicoes?status=validado" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(f'Total: {len(d)}')
for c in d[:3]:
    print(f'  [{c[\"tipo\"]}] {c[\"titulo\"][:60]} (votos: {c[\"votos\"]})')
"
