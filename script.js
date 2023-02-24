let urlTypes = "https://pokeapi.co/api/v2/type/";
let urlType;

// Function to fetch data and transform it to JS
async function getData(url) {
    const obj = await fetch(url);
    const text = await obj.text();
    const parsed = JSON.parse(text);
    return parsed;
}

// Function to empty all fields and backgrounds
function clean() {
    document.getElementById("total").innerHTML = "";
    document.getElementById("headline").innerHTML = "";
    document.getElementById("top1").innerHTML = "";
    document.getElementById("top2").innerHTML = "";
    document.getElementById("col1").innerHTML = "";
    document.getElementById("col2").innerHTML = "";
    document.getElementById("col3").innerHTML = "";
    // Remove background to type relations section
    document.getElementById("relations").classList.remove("box");
}

// Function to remove hyphens and capitalize first letters
function capitalize(str) {         
    return str
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Function to select specific item from options
function selectChoice(id, value) {    
    let element = document.getElementById(id);
    element.value = value;
}

// Function to change the selected value from drop down menu
function selectFromMenu(url) {
    document.getElementById("typeSelector").value = url;
}

// SINGLE POKEMON -- Function to get Details of a single Pokemon
async function getPokemonDetails(url) {
    clean();

    // document.getElementById("col1").innerHTML = url;

    let parsedDetails = await getData(url);
    let typesArray = parsedDetails.types;
    let abilitiesArray = parsedDetails.abilities;

    // NAME & IMAGE

    // Pokemon's name capitalized and printed to headline section
    let capName = capitalize(parsedDetails.name);
    document.getElementById("headline").innerHTML = "<h1>" + capName + "</h1>"

    // Find url for sprite image
    let sprite = parsedDetails.sprites;
    let spriteUrl = sprite.front_default;

    // Pokemon image printed to col2
    document.getElementById("col2").innerHTML = "<img src='" + spriteUrl + "' alt='" + capName + "'>";

    // TYPES
    let types;
    let type;
    let typeList = "";

    for (const x in typesArray) {
        types = typesArray[x];
        type = types.type;
        urlType = type.url;

        //Create list of the pokemon's types
        typeList += "<br><button class=\"poke-type " + type.name + "\" value='" + type.url + "' onclick=\"getTypeList('" + urlType + "')\">" + capitalize(type.name) + "</button>";
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
        urlAbility = ability.url;
        
        // If the ability is hidden, add hidden class to button
        if (abilities.is_hidden) {
            hidden = "hidden ";
        } 

        // Create list of abilities
        abilityList += "<button class=\"" + hidden + "ability\" value=\"" + ability.url + "\">" + capitalize(ability.name) + "</button><br>";
    }

    // Print abilities to col3
    document.getElementById("col3").innerHTML = "<h3>Abilities:</h3>" + abilityList;
}

// Function to set the url for Pokemon type list
function chooseType() {
    urlType = document.getElementById("typeSelector").value;

    // If all types are selected call for different function
    if (urlType == "all") {
        url = "https://pokeapi.co/api/v2/pokemon/"
        allPokemons(url);
    } else {
        getTypeList(urlType);
    }
}

// Function to create a string for type buttons in relations section
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

    let parsedTypeList = await getData(url);
    let typeListArray = parsedTypeList.pokemon;
    let total = typeListArray.length;
    let pokemon = parsedTypeList.name;
    let headline = capitalize(pokemon);

    document.getElementById("headline").innerHTML = "<h1 data-outline=\"" + headline + "\" class=\"" + pokemon + "\">" + headline + "</h1>";

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
    let typeList;
    let typeListChoice;
    let listPokemonsCol1 = "";
    let listPokemonsCol2 = "";
    let listPokemonsCol3 = "";

    // Loop through the options
    for (const x in typeListArray) {
        let typeList = typeListArray[x];
        let pokemon = typeList.pokemon;
        let urlPokemon = pokemon.url;
        let perColumn;

        // Capitalize the names for visible choices
        let capPokemon = capitalize(pokemon.name);
        // Pick up ID from url
        let pokemonId = urlPokemon.substring(34,urlPokemon.length-1);

        if (total > 30) {
            perColumn = Math.ceil(total/3);
            secColumn = perColumn*2;

            if (x < perColumn) {
                // Create the rows for list items on the 1st column
                listPokemonsCol1 += "<tr><td class='right'>" + pokemonId +
                "</td><td><button value='" + pokemon.url + "'onclick='getPokemonDetails(this.value)'>" + capPokemon + "</button></td></tr>";

            } else if (x < perColumn * 2) {
                // Create the rows for list items on the 2nd column
                listPokemonsCol2 += "<tr><td class='right'>" + pokemonId +
                "</td><td><button value='" + pokemon.url + "'onclick='getPokemonDetails(this.value)'>" + capPokemon + "</button></td></tr>";
            } else {
                // Create the rows for list items on the 3rd column
                listPokemonsCol3 += "<tr><td class='right'>" + pokemonId +
                "</td><td><button value='" + pokemon.url + "'onclick='getPokemonDetails(this.value)'>" + capPokemon + "</button></td></tr>";
            }

        } else if (total > 15) {
            perColumn = Math.ceil(total/2);

            if (x < perColumn) {
                // Create the rows for list items on the 1st column
                listPokemonsCol1 += "<tr><td>" + pokemonId +
                "</td><td><button value='" + pokemon.url + "'onclick='getPokemonDetails(this.value)'>" + capPokemon + "</button></td></tr>";
            } else {
                // Create the rows for list items on the 2nd column
                listPokemonsCol2 += "<tr><td>" + pokemonId +
                "</td><td><button value='" + pokemon.url + "'onclick='getPokemonDetails(this.value)'>" + capPokemon + "</button></td></tr>";
            }
        }
    }

    // Print the 1st column list in a table
    document.getElementById("col1").innerHTML = "<table><tr><th class='right'>ID:</th><th> Name:</th></tr>" + listPokemonsCol1; + "</table>";

    // If not empty print the 2nd column list in a table
    if (listPokemonsCol2 != "") {
        document.getElementById("col2").innerHTML = "<table><tr><th class='right'>ID:</th><th> Name:</th></tr>" + listPokemonsCol2; + "</table>";
    } else {
        document.getElementById("col2").innerHTML = "";
    }

    // If not empty print the 2nd column list in a table
    if (listPokemonsCol3 != "") {
        document.getElementById("col3").innerHTML = "<table><tr><th class='right'>ID:</th><th> Name:</th></tr>" + listPokemonsCol3; + "</table>";
    } else {
        document.getElementById("col3").innerHTML = "";
    }

    document.getElementById("total").innerHTML = "&nbsp;Total: " + total;
}

// SELECTOR: TYPE -- Function to fetch the list of types and create selector
async function getTypesSelector(url) {
    let parsedTypes = await getData(url);
    let typesArray = parsedTypes.results;

    // Establish variables for loop
    let types;
    let typeChoice;
    let typeChoices = "";

    // Loop through the options
    for (const x in typesArray) {
        types = typesArray[x];

        // Do not include type Unknown or Shadow (no pokemons under them)
        if (types.name != "unknown" && types.name != "shadow") {
            //Capitalize the names for visible choices
            typeChoice = capitalize(types.name);
            typeChoices += "<option class='" + types.name + "' value='" + types.url + "'>" + typeChoice + "</option>";
        }
    }

    // Print the selector
    document.getElementById("selector").innerHTML = "<label for='type'>Choose a type:</label> <select name='typeSelector' id='typeSelector' onchange='chooseType()'><option value='all'>All</option>" + typeChoices + "</select>";
}

// Initial call for function -- calls SELECTOR
getTypesSelector(urlTypes);