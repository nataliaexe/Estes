"""Passos visuais com fotos para cada caso.

Estrutura:
    numero: int
    passos: list[dict]
        - nivel: 1 | 2 | 3
        - passo: int
        - descricao: str
        - foto_url: str (URL relativa ou absoluta)
        - duracao: str
        - alerta: str | None
"""

PASSOS_VISUAIS = {
    1: {
        "passos": [
            {"nivel": 2, "passo": 1, "descricao": "Colete folhas verdes de eucalipto", "foto_url": "/static/passos/caso1/01-coleta.jpg", "duracao": "10 min", "alerta": None},
            {"nivel": 2, "passo": 2, "descricao": "Seque a sombra por 3 dias", "foto_url": "/static/passos/caso1/02-secagem.jpg", "duracao": "3 dias", "alerta": None},
            {"nivel": 2, "passo": 3, "descricao": "Ferva as folhas em agua por 15 min", "foto_url": "/static/passos/caso1/03-fervura.jpg", "duracao": "15 min", "alerta": "Use luvas - risco de queimadura"},
            {"nivel": 2, "passo": 4, "descricao": "Coe o extrato (cor de cha)", "foto_url": "/static/passos/caso1/04-extrato.jpg", "duracao": "5 min", "alerta": None},
            {"nivel": 2, "passo": 5, "descricao": "Misture com acido citrico e ureia", "foto_url": "/static/passos/caso1/05-mistura.jpg", "duracao": "2 min", "alerta": None},
            {"nivel": 2, "passo": 6, "descricao": "Aque\u00e7a no micro-ondas por 3 min", "foto_url": "/static/passos/caso1/06-micro-ondas.jpg", "duracao": "3 min", "alerta": "Cuidado com queimadura"},
            {"nivel": 2, "passo": 7, "descricao": "Deixe esfriar e dilua em agua", "foto_url": "/static/passos/caso1/07-diluicao.jpg", "duracao": "10 min", "alerta": None},
            {"nivel": 2, "passo": 8, "descricao": "Mergulhe o papel filtro", "foto_url": "/static/passos/caso1/08-imersao.jpg", "duracao": "10 min", "alerta": None},
            {"nivel": 2, "passo": 9, "descricao": "Seque no escuro por 12h", "foto_url": "/static/passos/caso1/09-secagem.jpg", "duracao": "12 h", "alerta": None},
            {"nivel": 2, "passo": 10, "descricao": "Corte em tiras de 2x5 cm", "foto_url": "/static/passos/caso1/10-corte.jpg", "duracao": "5 min", "alerta": None},
        ],
    },
}
