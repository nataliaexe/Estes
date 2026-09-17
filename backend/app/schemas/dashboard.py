from pydantic import BaseModel


class DashboardOut(BaseModel):
    total_casos: int
    total_medicoes: int
    total_noticias: int
    total_usuarios: int
    total_documentos: int
    casos_por_categoria: dict[str, int]
    casos_por_uf: dict[str, int]
    casos_por_evidencia: dict[str, int]
    casos_com_hardware: int
    medicoes_por_resultado: dict[str, int]
    noticias_por_severidade: dict[str, int]
