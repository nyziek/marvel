$(function() {

    var mainApiUrl = "https://gateway.marvel.com:443/v1/public/characters?limit=100&apikey=c767374de595fc64ed5dea718a47f2d1";
    var characterApiUrl = "";
    var characterList = $(".characterList");

    function insertListContent(characters) {

        for (var i = 0; i < characters.length; i++) {
            characterList.append(`
                <option id = ${i}>
                    ${characters[i].name}
                </option>
            `);
        }
    }

    function insertCharacterContent(character) {

        var thumbnailHolder = $(".thumbnailHolder");
        var nameHolder = $(".nameHolder");
        var infoHolder = $(".infoHolder");

        thumbnailHolder.replaceWith(`
            <div class="thumbnailHolder">
                <img class="thumbnail" src="${character.thumbnail.path}.${character.thumbnail.extension}">
            </div>
        `);

        nameHolder.replaceWith(`
            <div class="nameHolder">
                <p class="name">${character.name}</p>
            </div>    
        `);

        console.log(character.description);

        if(character.description === "") {
            infoHolder.replaceWith(`
                <div class="infoHolder">
                    <p class="infoTitle">Description:</p>
                    <p class="info">DESCRIPTION NOT FOUND</p>
                </div>
            `);
        } else {
            infoHolder.replaceWith(`
                <div class="infoHolder">
                    <p class="infoTitle">Description:</p>
                    <p class="info">${character.description}</p>
                </div>
            `);
        }
    }

    function charactersList() {
        $.ajax(mainApiUrl)
            .done(function(data) {
                console.log(data);

                var characters = data.data.results;

                insertListContent(characters);

                characterList.on("change", function() {

                    var selectedOptionId = $(this).children(":selected").attr("id");

                    characterApiUrl = characters[selectedOptionId].resourceURI + "?apikey=c767374de595fc64ed5dea718a47f2d1";

                    console.log("I work");

                    loadCharacter();
                });
            });
    }

    function loadCharacter() {

        $.ajax(characterApiUrl)
            .done(function(data) {
                console.log(data);

                var character = data.data.results[0];

                insertCharacterContent(character);
            });
    }

    charactersList();
});