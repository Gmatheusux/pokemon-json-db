const fs = require('fs');
const path = require('path');

const gens = [
    { gen: 1, start: 1, end: 151, region: "Kanto" },
    { gen: 2, start: 152, end: 251, region: "Johto" },
    { gen: 3, start: 252, end: 386, region: "Hoenn" },
    { gen: 4, start: 387, end: 493, region: "Sinnoh" },
    { gen: 5, start: 494, end: 649, region: "Unova" },
    { gen: 6, start: 650, end: 721, region: "Kalos" },
    { gen: 7, start: 722, end: 809, region: "Alola" },
    { gen: 8, start: 810, end: 905, region: "Galar" },
    { gen: 9, start: 906, end: 1025, region: "Paldea" }
];

async function buildCatalog() {
    console.log("Iniciando requisição otimizada para a PokéAPI (1 única chamada)...");
    
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await response.json();
        const results = data.results;

        let mdContent = "# Catálogo Nacional Pokémon (Gen 1-9)\n\n";
        mdContent += "> Catálogo gerado de forma otimizada para evitar excesso de requisições e consumo de tokens.\n\n";

        const jsonDatabase = [];

        for (const gen of gens) {
            mdContent += `## Geração ${gen.gen} - Região de ${gen.region}\n\n`;
            mdContent += "| ID | Nome | Sprite Normal | Sprite Shiny |\n";
            mdContent += "|---|---|---|---|\n";

            for (let i = gen.start; i <= gen.end; i++) {
                const idx = i - 1;
                if (idx < results.length) {
                    const rawName = results[idx].name;
                    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
                    
                    const normalSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`;
                    const shinySprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${i}.png`;
                    
                    mdContent += `| #${i} | **${name}** | <img src="${normalSprite}" width="64"/> | <img src="${shinySprite}" width="64"/> |\n`;
                    
                    jsonDatabase.push({
                        id: i,
                        name: name,
                        generation: gen.gen,
                        region: gen.region,
                        sprites: {
                            normal: normalSprite,
                            shiny: shinySprite
                        }
                    });
                }
            }
            mdContent += "\n";
        }

        fs.writeFileSync(path.join(__dirname, "pokemon_catalog.md"), mdContent, 'utf-8');
        fs.writeFileSync(path.join(__dirname, "database.json"), JSON.stringify(jsonDatabase, null, 2), 'utf-8');
        
        console.log(`SUCESSO: Catálogo Markdown e database.json gerados com sucesso!`);
    } catch (error) {
        console.error("ERRO ao gerar catálogo:", error);
    }
}

buildCatalog();
