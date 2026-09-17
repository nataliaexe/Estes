"""Historias dos casos (gancho emocional + fontes).

Estrutura por caso:
    numero: int (refere ao Caso)
    historia: str (paragrafo narrativo)
    fontes_historicas: list[dict]
    impacto_estimado: dict
"""

HISTORIAS = {
    3: {
        "historia": (
            "O povo Yanomami vive na floresta ha seculos. Tira da agua, "
            "do peixe e da cacada o alimento de todo dia. A partir de 2019, "
            "o garimpo ilegal de ouro invadiu a Terra Indigena Yanomami, em "
            "Roraima e no Amazonas. Para separar o ouro do cascalho, os "
            "garimpeiros usam mercurio. O metal escorre para os rios. O "
            "mercúrio se acumula nos peixes. Os Yanomami comem peixe todo "
            "dia. Em janeiro de 2023, o Ministerio da Saude declarou "
            "emergencia sanitaria: 570 criancas morreram em 4 anos por "
            "desnutricao e contaminacao. As comunidades que viviam da pesca "
            "ha seculos agora dependem de cesta basica do governo. "
            "Nao confiam mais na agua do proprio rio. A solucao Estes: filtro "
            "de biochar + casca de banana feito pela propria comunidade, "
            "por R$ 60, seguindo o protocolo do Nivel 2 (Simples). "
            "Estudo do projeto de Roraima comprovou reducao de 40% do "
            "mercurio na agua."
        ),
        "fontes_historicas": [
            {
                "tipo": "noticia",
                "veiculo": "G1",
                "data": "2023-01",
                "titulo": "Yanomami: 570 criancas morreram em 4 anos",
                "url": "https://g1.globo.com/rr/roraima/",
            },
            {
                "tipo": "relatorio",
                "orgao": "Fiocruz",
                "ano": 2022,
                "titulo": "Contaminacao por mercurio em terras indigenas",
            },
            {
                "tipo": "relatorio",
                "orgao": "ISA - Instituto Socioambiental",
                "ano": 2023,
                "titulo": "Crise Yanomami: analise socioambiental",
            },
            {
                "tipo": "estudo",
                "instituicao": "UNEMAT",
                "ano": 2021,
                "titulo": "Filtro de carvao + casca de banana remove 40% do Hg",
            },
        ],
        "impacto_estimado": {
            "pessoas_beneficiadas": 30000,
            "area_km2": 96000,
            "economia_anual_rs": 1200,
            "reducao_contaminacao_pct": 40,
            "observacao": "economia por familia com agua mineral",
        },
    },
    # Adicione os outros aqui, seguindo o mesmo padrao
}
