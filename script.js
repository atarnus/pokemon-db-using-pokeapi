let urlTypes = "https://pokeapi.co/api/v2/type/";
let urlType;
const table = "<table><tr><th class=\"right\">ID:</th><th> Name:</th></tr>";

// Function to fetch data from API and transform it to JS
async function getData(url) {
    const obj = await fetch(url);
    const text = await obj.text();
    const parsed = JSON.parse(text);
    return parsed;
}

// Function to empty all fields and backgrounds
function clean() {
    document.getElementById("headline1").innerHTML = "";
    document.getElementById("headline2").innerHTML = "";
    document.getElementById("total").innerHTML = "";
    document.getElementById("top1").innerHTML = "";
    document.getElementById("top2").innerHTML = "";
    document.getElementById("col1").innerHTML = "";
    document.getElementById("col2").innerHTML = "";
    document.getElementById("col3").innerHTML = "";
    // Remove background to type relations section
    document.getElementById("relations").classList.remove("box");
}

// List colums content center-aligned
function botColCenter() {
    document.getElementById("bot1").classList.remove("justify-content-left");
    document.getElementById("bot2").classList.remove("justify-content-left");
    document.getElementById("bot3").classList.remove("justify-content-left");
    document.getElementById("bot1").classList.add("justify-content-center");
    document.getElementById("bot2").classList.add("justify-content-center");
    document.getElementById("bot3").classList.add("justify-content-center");
}

// List colums content left-aligned
function botColLeft() {
    document.getElementById("bot1").classList.remove("justify-content-center");
    document.getElementById("bot2").classList.remove("justify-content-center");
    document.getElementById("bot3").classList.remove("justify-content-center");
    document.getElementById("bot1").classList.add("justify-content-left");
    document.getElementById("bot2").classList.add("justify-content-left");
    document.getElementById("bot3").classList.add("justify-content-left");
}

// Function to remove hyphens and capitalize first letters
function capitalize(str) {         
    return str
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// POKEMON LISTS

// Initial SEARCH function -- redirects to all or type search
function searchPokemons () {
    let search = document.getElementById("searchfield").value;
    let str = search.toLowerCase();

    // Direct to search from all pokemons or certain type of pokemons
    if (document.getElementById("typeSelector").value == "all") {
        listPokemons(str);
    } else {
        listPokemonsByType(str);
    }
}

// Function to CREATE a string for Pokemon LISTS
function getPokemonList(id, url, pokemon) {
    return "<tr><td class=\"right\">" + id +
    "</td><td><button value=\"" + url + "\"onclick=\"getPokemonDetails(this.value)\">" + pokemon + "</button></td></tr>";
}

// Function to COMPILE LISTS for the 3 bottom columns
function compileLists(array, length) {
    let col1 = "";
    let col2 = "";
    let col3 = "";
    for (const x in array) {
        pokemon = array[x];

        // Capitalize the names for visible choices
        capPokemon = capitalize(pokemon.name);
        // Pick up ID from url
        pokemonId = pokemon.url.substring(34,pokemon.url.length-1);

        // Split the results into columns
        if (length > 30) {
            perColumn = Math.ceil(length/3);

            if (x < perColumn) {
                // Create the rows for list items on the 1st column
                col1 += getPokemonList(pokemonId, pokemon.url, capPokemon);
            } else if (x < perColumn * 2) {
                // Create the rows for list items on the 1st column
                col2 += getPokemonList(pokemonId, pokemon.url, capPokemon);
            } else {
                // Create the rows for list items on the 3rd column
                col3 += getPokemonList(pokemonId, pokemon.url, capPokemon);
            }

        } else if (length > 15) {
            perColumn = Math.ceil(length/2);

            if (x < perColumn) {
                // Create the rows for list items on the 1st column
                col1 += getPokemonList(pokemonId, pokemon.url, capPokemon);
            } else {
                // Create the rows for list items on the 1st column
                col2 += getPokemonList(pokemonId, pokemon.url, capPokemon);   
            }

        } else {
            col1 += getPokemonList(pokemonId, pokemon.url, capPokemon);
        }
    }
    return {
        'col1' : col1,
        'col2' : col2,
        'col3' : col3
    };
}

// Function to PRINT THE POKEMON LISTS to bottom colums
function printLists(col1, col2, col3) {

    // If column 1 is empty, print no results
    if (col1 == "") {
        document.getElementById("col2").innerHTML = "No results.";

    // If not, print 1st column
    } else {
        document.getElementById("col1").innerHTML = table + col1 + "</table>";

        // If not empty print the 2nd column list in a table
        if (col2 != "") {
            document.getElementById("col2").innerHTML = table + col2; + "</table>";
        } else {
            document.getElementById("col2").innerHTML = "";
        }

        // If not empty print the 2nd column list in a table
        if (col3 != "") {
            document.getElementById("col3").innerHTML = table + col3; + "</table>";
        } else {
            document.getElementById("col3").innerHTML = "";
        }
    }
}

// Function to list SEARCHED pokemons when no type is selected
async function listPokemons(str) {
    clean();
    botColLeft();
    let url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
    let parsedDetails = await getData(url);
    let array = parsedDetails.results;
    let total = 0;
    let array2 = [];

    console.log("listPokemons called");

    // Loop through all pokemons
    for (const x in array) {
        pokemon = array[x];

        // If string is found in the name, push to second array
        if (pokemon.name.includes(str)) {
            total ++;

            array2.push({
                "name" : pokemon.name,
                "url" : pokemon.url});
        }
    }

    // Compile printable lists for the bottom columns from the second array
    let cols = compileLists(array2, total);

    // Print the bottom columns
    printLists(cols.col1, cols.col2, cols.col3);

    // Print the list headline and total
    document.getElementById("total").innerHTML = "<p class=\"hl2 pl\">Total: " + total + "</p>";
    document.getElementById("headline2").innerHTML = "<p class=\"hl2 large\">Pokémon with '" + str + "':</p>"
}

// TYPE CHOSEN

// Function to list SEARCHED Pokemons when certain TYPE is selected
async function listPokemonsByType(str) {

    // Less cleanup -- leaving the type details box
    document.getElementById("total").innerHTML = "";
    document.getElementById("col1").innerHTML = "";
    document.getElementById("col2").innerHTML = "";
    document.getElementById("col3").innerHTML = "";

    urlType = document.getElementById("typeSelector").value;
    console.log(urlType);
    let parsedDetails = await getData(urlType);
    let array = parsedDetails.pokemon;
    let type = parsedDetails.name;
    let total = 0;
    let array2 = [];

    for (const x in array) {
        pokemon = array[x];

        if (pokemon.pokemon.name.includes(str)) {
            total ++;

            array2.push({
                "name" : pokemon.pokemon.name,
                "url" : pokemon.pokemon.url});
        }
    }

    // Compile printable lists for the bottom columns from the second array
    let cols = compileLists(array2, total);

    // Print the bottom columns
    printLists(cols.col1, cols.col2, cols.col3);

    document.getElementById("total").innerHTML = "<p class=\"hl2 pl\">Total: " + total + "</p>";
    document.getElementById("headline2").innerHTML = "<p class=\"hl2 large text-shadow " + type + "\">" + capitalize(type) + " Pokémon with '" + str + "':</p>"
}

// Function to create a string for TYPE BUTTONS in RELATIONS section
function getButtonString(array) {
    let buttons = "";
    for (const x in array) {
        let obj = array[x];

        buttons += "<button class=\"poke-type " + obj.name + 
            "\" value=\"" + obj.url + "\" onclick=\"getTypeList(this.value)\">" + capitalize(obj.name) + "</button>";
    }
    return buttons;
}

// TYPE -- Function to list all relations and pokemons of chosen type
async function getTypeList(url) {
    clean();
    // Call function to select the active type from drop down menu
    selectFromMenu(url);
    // Add background to type relations section
    document.getElementById("relations").classList.add("box");
    // List bottom columns content left-aligned
    botColLeft();

    let parsedTypeList = await getData(url);
    let typeListArray = parsedTypeList.pokemon;
    let pokemonType = parsedTypeList.name;
    let headline = capitalize(pokemonType);

    // Print the type headline
    document.getElementById("headline1").innerHTML = "<h1 class=\"text-shadow " + pokemonType + "\">" + headline + "</h1>";

    // RELATIONS
    let damages = parsedTypeList.damage_relations;

    // Get the printable strings for buttons from each array
    let weakDef = getButtonString(damages.double_damage_from);
    let strongDam = getButtonString(damages.double_damage_to);
    let strongDef = getButtonString(damages.half_damage_from);
    let weakDam = getButtonString(damages.half_damage_to);
    let noDam = getButtonString(damages.no_damage_to);
    let immune = getButtonString(damages.no_damage_from);

    // Print Attack relations
    document.getElementById("top1").innerHTML = "<h2>Attack</h2>";
    if (strongDam != "") {
        document.getElementById("top1").innerHTML += "<h4 class=\"green\">Super-effective (2x damage) against:</h4>" + strongDam;
    }
    document.getElementById("top1").innerHTML += "<h4 class=\"red\">Not very effective (0.5x damage) against:</h4>" + weakDam;
    if (noDam != "") {
        document.getElementById("top1").innerHTML += "<h4 class=\"red\">No effect against:</h4>" + noDam;
    }

    // Print Defense relations
    document.getElementById("top2").innerHTML = "<h2>Defense</h2>";
    if (immune != "") {
        document.getElementById("top2").innerHTML += "<h4 class=\"green\">Immune to:</h4>" + immune;
    }
    if (strongDef != "") {
        document.getElementById("top2").innerHTML += "<h4 class=\"green\">Strong defense (halved damage taken) from:</h4>" + strongDef;
    }
    document.getElementById("top2").innerHTML += "<h4 class=\"red\">Weak defense (2x damage taken) from:</h4>" + weakDef;

    // POKEMONS

    // Loop through all pokemons
    let total = typeListArray.length;
    let array = [];

    for (const x in typeListArray) {
        typeList = typeListArray[x];
        pokemon = typeList.pokemon;

            array.push({
                "name" : pokemon.name,
                "url" : pokemon.url});
    }

    // Compile printable lists for the bottom columns from the second array
    let cols = compileLists(array, total);

    // Print the bottom columns
    printLists(cols.col1, cols.col2, cols.col3);

    // Print the list headline and total
    document.getElementById("headline2").innerHTML = "<p class=\"hl2 large text-shadow " + pokemonType + "\">" + headline + " Pokémon:</p>"
    document.getElementById("total").innerHTML = "<p class=\"hl2 pl\">Total: " + total + "</p>";
}

// SINGLE POKEMON FUNCTIONS

// Function to fetch EVOLUTION details for SINGLE POKEMON
async function getEvolutionDetails(url) {
    let parsedDetails = await getData(url);
    let chain = parsedDetails.chain;
    let evoToArray = chain.evolves_to;
    let evoTo = "";
    let evoTo2 = "";
    const evoArrow = "<tr><td colspan=\"2\"><img class=\"arrow\" src=\"arrow-down.svg\"></i></td></tr>";

    // Get single pokemon url and id from species url
    let urlPokemon = chain.species.url.replace("-species", "");
    pokemonId = urlPokemon.substring(34,urlPokemon.length-1);

    // Get link for first pokemon in chain
    let evoFrom = getPokemonList(pokemonId, urlPokemon, capitalize(chain.species.name));

    // Loop through possible evolutions
    for (const x in evoToArray) {
        evoToPokemon = evoToArray[x];
        species = evoToPokemon.species;
        speciesUrl = species.url;
        evoToArray2 = evoToPokemon.evolves_to;

        // Loop through possible further evolutions
        for (const x in evoToArray2) {
            evoToPokemon2 = evoToArray2[x];
            species2 = evoToPokemon2.species;
            speciesUrl2 = species2.url;

            urlPokemon2 = speciesUrl2.replace("-species", "");
            pokemonId2 = urlPokemon2.substring(34,urlPokemon2.length-1);
            
            // Get link for 3rd step pokemons in the chain
            evoTo2 += getPokemonList(pokemonId2, urlPokemon2, capitalize(species2.name));
        }

        urlPokemon = speciesUrl.replace("-species", "");
        pokemonId = urlPokemon.substring(34,urlPokemon.length-1);

        // Get link for 2nd step pokemons in the chain
        evoTo += getPokemonList(pokemonId, urlPokemon, capitalize(species.name));
    }

    // Return only relevant steps
    if (evoTo == "") {
        return "<h3>Evolution Chain:</h3>Does not evolve.";
    } else if (evoTo2 == "") {
        return "<h3>Evolution Chain:</h3><table>" + evoFrom + evoArrow + evoTo + evoTo2 + "</table>";
    } else {
        return "<h3>Evolution Chain:</h3><table>" + evoFrom + evoArrow + evoTo + evoArrow + evoTo2 + "</table>"
    }
}

// Function to get SPECIES details for SINGLE POKEMON
async function getSpeciesDetails(url) {
    let parsedDetails = await getData(url);
    let evoChain = parsedDetails.evolution_chain;
    let evoFrom = parsedDetails.evolves_from_species;
    let evoFromPokemon = "";

    if (evoFrom != null) {
        evoFromPokemon = capitalize(evoFrom.name);
    }

    return {
        'evoChainUrl': evoChain.url,
        'evoFromPokemon': evoFromPokemon,
        'isBaby': parsedDetails.is_baby,
        'isLegendary': parsedDetails.is_legendary,
        'isMythical': parsedDetails.is_mythical
    };
}

// SINGLE POKEMON -- Function to get All Details of a single Pokemon
async function getPokemonDetails(url) {
    clean();
    // Center bottom columns content
    botColCenter();

    // Get Pokemon details
    let parsedDetails = await getData(url);
    let pokemonId = parsedDetails.id;
    let typesArray = parsedDetails.types;
    let speciesUrl = parsedDetails.species;
    let abilitiesArray = parsedDetails.abilities;

    // NAME & IMAGE
    // Pokemon's name capitalized and printed to headline section
    let capName = capitalize(parsedDetails.name);
    document.getElementById("headline1").innerHTML = "<h1>" + capName + "</h1>ID: " + pokemonId;

    // Find url for sprite image
    let sprite = parsedDetails.sprites;
    let spriteUrl = sprite.front_default;

    // Pokemon image printed to col2
    document.getElementById("col2").innerHTML = "<img class=\"center\" src=\"" + spriteUrl + "\" alt=\"" + capName + "\">";

    // TYPES
    let types;
    let type;
    let typeList = "";

    for (const x in typesArray) {
        types = typesArray[x];
        type = types.type;

        //Create list of the pokemon's types
        typeList += "<br><button class=\"poke-type " + type.name + "\" value=\"" + type.url + "\" onclick=\"getTypeList(this.value)\">" + capitalize(type.name) + "</button>";
    }

    // Print type buttons to the end of column 2
    document.getElementById("col2").innerHTML += typeList;

    // ABILITIES
    let abilities;
    let ability;
    let abilityList = "";
    let hidden = "";

    for (const x in abilitiesArray) {
        abilities = abilitiesArray[x];
        ability = abilities.ability;
        
        // If the ability is hidden, add hidden class to button
        if (abilities.is_hidden) {
            hidden = "hidden ";
        } 

        // Create list of abilities
        abilityList += "<button class=\"" + hidden + "ability\" value=\"" + ability.url + "\">" + capitalize(ability.name) + "</button><br>";
    }
    
    // Print abilities to bot col3
    document.getElementById("col3").innerHTML = "<h3>Abilities:</h3>" + abilityList;

    // SPECIES   
    // Get Species details (leads to evolution chain, special type)
    let species = await getSpeciesDetails(speciesUrl.url);

    // Check if baby, legendary, mythical
    let specialTypes = "";

    if (species.isBaby) {
        specialTypes += "<br><button class=\"special baby\">Baby</button>";
    }
    if (species.isLegendary) {
        specialTypes += "<br><button class=\"special legendary\">Legendary</button>";
    }
    if (species.isMythical) {
        specialTypes += "<br><button class=\"special mythical\">Mythical</button>";
    }

    // Print special types to the end of col2
    document.getElementById("col2").innerHTML += specialTypes;

    // EVOLUTION
    // Call evolution details with the url from species
    let evolution = await getEvolutionDetails(species.evoChainUrl);

    // Print evolution chain to col1
    document.getElementById("col1").innerHTML = evolution;
}

// SELECTOR

// Function to change the selected value from drop down menu (when pokemon type has been chosen from a link)
function selectFromMenu(url) {
    document.getElementById("typeSelector").value = url;
}

// Function to redirect from SELECTOR choice to TYPE list
function chooseType() {
    urlType = document.getElementById("typeSelector").value;

    // If all types are selected prompt for choice or search
    if (urlType == "all") {
        clean();
        document.getElementById("col2").innerHTML = "Please select a type or enter text on search bar.";
    // If type is chosen, redirect to type list
    } else {
        getTypeList(urlType);
    }
}

// SELECTOR: TYPE -- Function to fetch the list of types and create selector
async function getTypesSelector(url) {
    let parsedTypes = await getData(url);
    let typesArray = parsedTypes.results;

    // Establish variables for loop
    let types;
    let typeChoices = "";

    // Loop through the options
    for (const x in typesArray) {
        types = typesArray[x];

        // Do not include type Unknown or Shadow (no pokemons under them)
        if (types.name != "unknown" && types.name != "shadow") {
            //Capitalize the names for visible choices
            typeChoices += "<option class=\"" + types.name + "\" value=\"" + types.url + "\">" + capitalize(types.name) + "</option>";
        }
    }

    // Print the selector
    document.getElementById("selector").innerHTML = "<label for=\"type\">Choose a type:</label> <select name=\"typeSelector\" id=\"typeSelector\" onchange=\"chooseType()\"><option value=\"all\">All</option>" + typeChoices + "</select>";
}

// Initial call for function -- calls SELECTOR
getTypesSelector(urlTypes);
document.getElementById("headline1").innerHTML = "<h1>Simplified Pokémon Database</h1>";