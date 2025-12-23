def detectar_conexoes(dados: dict):
    conexoes = []

    for origem_id, bloco in dados.items():
        tipo = bloco.get("tipo")

        # Se for URA, percorremos as opções
        if tipo == "ura":
            opcoes = bloco.get("opcoes", {})
            for tecla, destino_id in opcoes.items():
                if destino_id in dados:
                    conexoes.append({
                        "origem": origem_id,
                        "destino": destino_id,
                        "via": f"opcao_{tecla}"
                    })

    return conexoes
