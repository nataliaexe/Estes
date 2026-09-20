"""Circuit breaker para provedores de IA.

Se um provedor falha N vezes seguidas, pula ele por T segundos.
"""

import time
from collections import defaultdict
from dataclasses import dataclass

from app.core.logging import get_logger

log = get_logger(__name__)


@dataclass
class EstadoProvedor:
    falhas_consecutivas: int = 0
    total_falhas: int = 0
    total_sucessos: int = 0
    bloqueado_ate: float = 0.0
    ultima_falha: float = 0.0


class CircuitBreaker:
    def __init__(
        self,
        max_falhas: int = 5,
        tempo_bloqueio: int = 300,  # 5 min
        tempo_reset: int = 60,
    ):
        self.max_falhas = max_falhas
        self.tempo_bloqueio = tempo_bloqueio
        self.tempo_reset = tempo_reset
        self.estados: dict[str, EstadoProvedor] = defaultdict(EstadoProvedor)
        # Pre-registra os provedores conhecidos
        for p in ("groq", "gemini", "ollama"):
            self.estados[p] = EstadoProvedor()

    def esta_disponivel(self, provedor: str) -> bool:
        estado = self.estados[provedor]
        agora = time.time()

        # Se passou o bloqueio, reseta
        if estado.bloqueado_ate and agora >= estado.bloqueado_ate:
            log.info(
                "circuit_breaker_reset",
                provedor=provedor,
                tempo_bloqueado=agora - estado.bloqueado_ate + self.tempo_bloqueio,
            )
            estado.bloqueado_ate = 0.0
            estado.falhas_consecutivas = 0

        return estado.bloqueado_ate == 0.0

    def registrar_sucesso(self, provedor: str) -> None:
        estado = self.estados[provedor]
        estado.falhas_consecutivas = 0
        estado.total_sucessos += 1
        if estado.bloqueado_ate:
            estado.bloqueado_ate = 0.0

    def registrar_falha(self, provedor: str) -> None:
        estado = self.estados[provedor]
        agora = time.time()
        estado.falhas_consecutivas += 1
        estado.total_falhas += 1
        estado.ultima_falha = agora

        if estado.falhas_consecutivas >= self.max_falhas:
            estado.bloqueado_ate = agora + self.tempo_bloqueio
            log.warning(
                "circuit_breaker_aberto",
                provedor=provedor,
                falhas=estado.falhas_consecutivas,
                bloqueado_por_seg=self.tempo_bloqueio,
            )

    def status(self) -> dict:
        agora = time.time()
        return {
            nome: {
                "disponivel": estado.bloqueado_ate == 0.0,
                "falhas_consecutivas": estado.falhas_consecutivas,
                "total_falhas": estado.total_falhas,
                "total_sucessos": estado.total_sucessos,
                "bloqueado_ate": estado.bloqueado_ate,
                "segundos_restantes": max(
                    0, int(estado.bloqueado_ate - agora)
                ) if estado.bloqueado_ate else 0,
            }
            for nome, estado in self.estados.items()
        }


# Singleton global
circuit_breaker = CircuitBreaker()
