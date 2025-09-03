async function getPokemonData() {
  const pokemonName = document.getElementById("pokemonName").value.trim().toLowerCase();
  if (!pokemonName) throw new Error("Type a Pokémon Name");
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  if (!response.ok) throw new Error(`Pokémon "${pokemonName}" not found.`);
  return await response.json();
}

async function getPokemonChain() {
  const container = document.getElementById('imgContainer');
  const msg = document.getElementById('msg');
  container.innerHTML = "";
  msg.textContent = "";

  try {
    const pokemonData = await getPokemonData();
    const speciesData = await (await fetch(pokemonData.species.url)).json();
    const evolutionData = await (await fetch(speciesData.evolution_chain.url)).json();
    await buildEvolutionTree(evolutionData.chain, container);
  } catch (err) {
    msg.textContent = err.message;
  }
}

async function buildEvolutionTree(pokemonNode, container) {

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNode.species.name}`);
  if (!res.ok) return;
  const pokemonData = await res.json();

  const sprite =
    pokemonData.sprites.front_default ||
    pokemonData.sprites.other?.['official-artwork']?.front_default ||
    pokemonData.sprites.other?.dream_world?.front_default;

  const nodeEl = document.createElement('div');
  nodeEl.classList.add('evoNode');

  const wrap = document.createElement('div');
  wrap.classList.add('pokemonCard');

  if (sprite) {
    const img = document.createElement('img');
    img.src = sprite;
    img.alt = pokemonNode.species.name;
    wrap.appendChild(img);
  }

  const label = document.createElement('p');
  label.textContent = pokemonNode.species.name;
  wrap.appendChild(label);

  nodeEl.appendChild(wrap);

  if (pokemonNode.evolves_to.length > 0) {
    const childrenEl = document.createElement('div');
    childrenEl.classList.add('evoChildren');

    for (const evo of pokemonNode.evolves_to) {
      await buildEvolutionTree(evo, childrenEl);
    }

    nodeEl.appendChild(childrenEl);
  }

  container.appendChild(nodeEl);
}