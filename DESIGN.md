---
name: "Pokemon JSON DB"
type: "Data API"
version: "1.0.0"
author: "Gabe (Gmatheusux)"
description: "Repositório atuando como API/Database estática contendo os dados de 1.025 Pokémon (Gen 1-9)."
---

# Arquitetura do Projeto

## Propósito
Atuar como um CDN/Banco de Dados estático para aplicações Frontend. Os dados são atualizados através de um script Node.js otimizado que faz uma única chamada à PokéAPI.

## Estrutura de Dados
O arquivo `database.json` é a fonte da verdade e pode ser consumido via requisição HTTP (GET) no link Raw do GitHub. Isso permite aplicações frontend escaláveis de custo zero e latência mínima.
