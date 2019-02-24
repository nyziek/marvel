$(function() {

    $(document).ready(function () {
        $(document).ajaxStart(function () {
            $("#loading").show();
            function runAnimation() {
                const spiderman = $("#spiderman");
                spiderman.animate({opacity:'0.3'}, 1000);
                spiderman.animate({opacity:'1'}, 1000, runAnimation);
            }
            runAnimation();
        }).ajaxStop(function () {
            $("#loading").hide();
            $("#spiderman").stop();
        });
    });

    const letters = ["3", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let firstLettersList = $(".firstLettersList");
    let chosenLetter = "3";

    let mainApiUrl = "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=3&limit=100&apikey=c767374de595fc64ed5dea718a47f2d1";

    let characters = [];

    for(var i = 0; i < letters.length; i++) {

        if(letters[i] === chosenLetter) {
            firstLettersList.append(`
            <li class="chosenLetter">${letters[i]}</li>
            `);
        } else {
            firstLettersList.append(`
            <li>${letters[i]}</li>
            `);
        }
    }

    $(".firstLettersList li").on("click", function(event) {

        const prevChosenLetter = $(".chosenLetter")[0];

        prevChosenLetter.classList.remove("chosenLetter");

        chosenLetter = $(this).text();

        $(this)[0].classList.add("chosenLetter");

        mainApiUrl = "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=" + chosenLetter + "&limit=100&apikey=c767374de595fc64ed5dea718a47f2d1";

        characterList.html(``);

        charactersList();
    });

    var characterApiUrl = "";
    var characterList = $(".characterList");

    function insertListContent(characters) {

        characterList.append(`
                <option></option>
            `);

        for (var i = 0; i < characters.length; i++) {
            characterList.append(`
                <option id = ${i}>${characters[i].name}</option>
            `);
        }
    }

    function insertComicContent(comic) {

        var comicsList = $(".comicsList");

        comicsList.append(`
                <li class="comicsListItem">
                    <img class="comicThumbnail" src="${comic[0].thumbnail.path}.${comic[0].thumbnail.extension}">
                    <p class="comicInfo">${comic[0].title}</p>
                </li>
            `);
    }

    function insertCharacterContent(character) {

        var thumbnailHolder = $(".thumbnailHolder");
        var nameHolder = $(".nameHolder");
        var infoHolder = $(".infoHolder");

        thumbnailHolder.html(`
            <img class="thumbnail" src="${character.thumbnail.path}.${character.thumbnail.extension}">
        `);

        nameHolder.html(`
            <p class="name">${character.name}</p>
        `);

        if(character.description === "") {
            infoHolder.html(`
                <p class="title">Description:</p>
                <p class="info">DESCRIPTION NOT FOUND</p>
            `);
        } else {
            infoHolder.html(`
                <p class="title">Description:</p>
                <p class="info">${character.description}</p>
            `);
        }

        var comicsListHolder = $(".comicsListHolder");

        comicsListHolder.html(`
            <p class="title">Apears in:</p>
            <ul class="comicsList">
            </ul>
        `);

        for (var i = 0; i < character.comics.items.length; i++) {

            var comicApiUrl = character.comics.items[i].resourceURI + "?apikey=c767374de595fc64ed5dea718a47f2d1";

            comicApiUrl = comicApiUrl.replace("http", "https");

            console.log(comicApiUrl);

            $.ajax(comicApiUrl)
                .done(function(data) {

                    var comic = data.data.results;
                    
                    console.log(comic);

                    insertComicContent(comic);
                });
        }
    }

    function charactersList() {
        $.ajax(mainApiUrl)
            .done(function(data) {

                characters = data.data.results;

                insertListContent(characters);

                characterList.on("change", function() {

                    var selectedOptionId = $(this).children(":selected").attr("id");
                    
                    characterApiUrl = characters[selectedOptionId].resourceURI + "?apikey=c767374de595fc64ed5dea718a47f2d1";

                    characterApiUrl = characterApiUrl.replace("http", "https");

                    console.log(characterApiUrl);

                    loadCharacter();
                });
            });
    }

    function loadCharacter() {

        $.ajax(characterApiUrl)
            .done(function(data) {

                var character = data.data.results[0];

                console.log(character);

                insertCharacterContent(character);
            });
    }

    charactersList();
});