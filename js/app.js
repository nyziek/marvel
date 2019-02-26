$(function() {

// VARIABLES

    // List of first letters of characters' names

    const letters = ["3", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let firstLettersList = $(".firstLettersList");
    let chosenLetter = "3";

    // APIs

    let mainApiUrl = "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=3&limit=100&apikey=c767374de595fc64ed5dea718a47f2d1";
    let characterApiUrl = "";

    // Character list

    let characters = [];
    let characterList = $(".characterList");

    // Chosen character info

    const thumbnailHolder = $(".thumbnailHolder");
    const nameHolder = $(".nameHolder");
    const infoHolder = $(".infoHolder");

    // Comics list

    const comicsListHolder = $(".comicsListHolder");

    // Data loading page

    const loadingPage = $("#loading");
    const spiderman = $("#spiderman");
    const loadingText = $("#loadingText");

// METHODS

    // Data loading page

    const loadingPageAnimation = () => {
        spiderman.animate({opacity:'0.4'}, 700);
        loadingText.animate({opacity:'0.3'}, 700);
        spiderman.animate({opacity:'0.9'}, 700);
        loadingText.animate({opacity:'0.8'}, 700, loadingPageAnimation);
    };

    const showLoadingPage = () => {
        loadingPage.show();
        loadingPageAnimation();
    };

    const hideLoadingPage = () => {
        loadingPage.hide();
        spiderman.stop();
        loadingText.stop();
    };

    // List of first letters of characters' names - list display

    const displayLettersList = () => {

        letters.forEach(letter => {
            if(letter === chosenLetter) {
                firstLettersList.append(`
            <li class="chosenLetter">${letter}</li>
            `);
            } else {
                firstLettersList.append(`
            <li>${letter}</li>
            `);
            }
        });
    };

    // List of first letters of characters' names - highlighted letter change

    function changeLetter() {

        const prevChosenLetter = $(".chosenLetter")[0];

        prevChosenLetter.classList.remove("chosenLetter");

        chosenLetter = $(this).text();

        $(this)[0].classList.add("chosenLetter");

        mainApiUrl = "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=" + chosenLetter + "&limit=100&apikey=c767374de595fc64ed5dea718a47f2d1";

        characterList.html(``);

        charactersList();
    }

    // Characters' names list

    const insertListContent = characters => {

        characterList.append(`
            <option></option>
        `);

        let id = 0;

        characters.forEach(character => {

            characterList.append(`
                <option id = ${id}>${character.name}</option>
            `);

            id++;
        });
    };

    const charactersList = () => {
        $.ajax(mainApiUrl)
            .done(function(data) {

                characters = data.data.results;

                insertListContent(characters);
            });
    };

    // Chosen character info

    const insertComicContent = comic => {

        const comicsList = $(".comicsList");

        comicsList.append(`
                <li class="comicsListItem">
                    <img class="comicThumbnail" src="${comic[0].thumbnail.path}.${comic[0].thumbnail.extension}">
                    <p class="comicInfo">${comic[0].title}</p>
                </li>
            `);
    };

    const insertCharacterContent = character => {

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

        comicsListHolder.html(`
            <p class="title">Apears in:</p>
            <ul class="comicsList">
            </ul>
        `);

        const collectionApiUrl = character.comics.collectionURI + "?limit=20&apikey=c767374de595fc64ed5dea718a47f2d1";

        let collection = [];

        $.ajax(collectionApiUrl)
            .done(function(data) {

                collection = data.data.results;

                console.log(collection);

                collection.forEach(comic => {
                    let comicApiUrl = comic.resourceURI + "?apikey=c767374de595fc64ed5dea718a47f2d1";

                    comicApiUrl = comicApiUrl.replace("http", "https");

                    $.ajax(comicApiUrl)
                        .done(function(data) {

                            const comicInfo = data.data.results;

                            insertComicContent(comicInfo);
                        });
                });
            });
    };

    const loadCharacter = () => {

        $.ajax(characterApiUrl)
            .done(function(data) {

                const character = data.data.results[0];

                console.log(character);

                insertCharacterContent(character);
            });
    };

    const changeCharacter = () => {

        const selectedOptionId = characterList.children(":selected").attr("id");

        if(characters[selectedOptionId] !== undefined) {

            characterApiUrl = characters[selectedOptionId].resourceURI + "?apikey=c767374de595fc64ed5dea718a47f2d1";
            characterApiUrl = characterApiUrl.replace("http", "https");

            loadCharacter();
        }
    };

// PAGE LOGIC

    // Loading page display

    $(document).ajaxStart(
        showLoadingPage
    ).ajaxStop(
        hideLoadingPage
    );

    // Displaying first letters of name list

    displayLettersList();

    // Changing chosen first letter of name

    firstLettersList.on("click", "li", changeLetter);

    // Inserting characters list options on page load

    charactersList();

    // Choosing character from characters list

    characterList.on("change", changeCharacter);

});