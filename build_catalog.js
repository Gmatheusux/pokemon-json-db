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

const query = `
query {
  pokemon_v2_pokemon(limit: 1025, order_by: {id: asc}) {
    id
    name
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
  }
}`;

async function buildCatalog() {
    console.log("Iniciando requisição GraphQL otimizada (Tipagem inclusa)...");
    
    try {
        const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        });
        const responseData = await response.json();
        const results = responseData.data.pokemon_v2_pokemon;

        let mdContent = "# Catálogo Nacional Pokémon (Gen 1-9)\n\n";
        mdContent += "> Catálogo gerado via GraphQL (Nomes, Sprites e Tipagem em 1 única requisição).\n\n";

        const jsonDatabase = [];

        for (const gen of gens) {
            mdContent += `## Geração ${gen.gen} - Região de ${gen.region}\n\n`;
            mdContent += "| ID | Nome | Tipos | Sprite Normal | Sprite Shiny |\n";
            mdContent += "|---|---|---|---|---|\n";

            for (let i = gen.start; i <= gen.end; i++) {
                const idx = i - 1;
                if (idx < results.length) {
                    const pkmn = results[idx];
                    const rawName = pkmn.name;
                    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
                    
                    const types = pkmn.pokemon_v2_pokemontypes.map(t => 
                        t.pokemon_v2_type.name.charAt(0).toUpperCase() + t.pokemon_v2_type.name.slice(1)
                    );
                    const typesStr = types.join(", ");
                    
                    const normalSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png`;
                    const shinySprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${i}.png`;
                    
                    mdContent += `| #${i} | **${name}** | ${typesStr} | <img src="${normalSprite}" width="64"/> | <img src="${shinySprite}" width="64"/> |\n`;
                    
                    jsonDatabase.push({
                        id: i,
                        name: name,
                        generation: gen.gen,
                        region: gen.region,
                        types: types,
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
        
        console.log(`SUCESSO: Catálogo e database.json atualizados com tipagem via GraphQL!`);
    } catch (error) {
        console.error("ERRO ao gerar catálogo:", error);
    }
}

buildCatalog();
