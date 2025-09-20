async function getPokemonData(pokemonName) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  if (!response.ok) throw new Error(`Pokémon "${pokemonName}" not found.`);
  return await response.json();
}

async function getPokemonChain() {
  const container = document.getElementById('imgContainer');
  const infoContainer = document.getElementById("pokemonDiv")
  const msg = document.getElementById('msg');
  infoContainer.innerHTML = "";
  container.innerHTML = "";
  msg.textContent = "";
  const pokemonName = document.getElementById("pokemonName").value.trim().toLowerCase();
  if (!pokemonName) throw new Error("Type a Pokémon Name");
  try {
    const pokemonData = await getPokemonData(pokemonName);
    const speciesData = await (await fetch(pokemonData.species.url)).json();
    const evolutionData = await (await fetch(speciesData.evolution_chain.url)).json();
    await buildEvolutionTree(evolutionData.chain, container);
  } catch (error) {
    msg.textContent = error.message;
  }
}

async function buildEvolutionTree(pokemonNode, container) {

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNode.species.name}`);
  if (!response.ok) return;
  const pokemonData = await response.json();

  const sprite = pokemonData.sprites.front_default;

  const nodeEl = document.createElement('div');
  nodeEl.classList.add('evoNode');

  const wrap = document.createElement('div');
  wrap.classList.add('pokemonCard');

  if (sprite) {
    const img = document.createElement('img');
    img.src = sprite;
    img.id = pokemonNode.species.name;
    img.alt = pokemonNode.species.name;
    img.onclick = function (){pokemonInformation(pokemonNode.species.name)};
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
function pokemonInformation(pokemonName){
  const container = document.getElementById("pokemonDiv");
  const label = document.createElement('p');
  label.classList.add("PokemonName");
  label.classList.add("pokemonDiv")
  label.textContent = pokemonName;
  pokemonImg = document.getElementById(pokemonName);

  container.appendChild(label);
  container.appendChild(pokemonImg);
  clearElement("imgContainer");
}
function clearElement(elementId){
  document.getElementById(elementId).innerHTML = "";
}
