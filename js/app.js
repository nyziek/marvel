$(function() {

// VARIABLES

    // List of first letters of characters' names

    const letters = ["3", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let firstLettersList = $(".firstLettersList");
    let chosenLetter = "3";

    // APIs

    let mainApiUrl = "https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=3&limit=100&apikey=c767374de595fc64ed5dea718a47f2d1";
    let characterApiUrl = "";
    let collectionApiUrl = "";

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

    // Comic cover

    const comicCover = $(".comicCover");

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
                    <img class="comicThumbnail" src="${comic.thumbnail.path.replace("http", "https")}.${comic.thumbnail.extension}">
                    <p class="comicInfo">${comic.title}</p>
                </li>
            `);
    };

    const comicList = character => {

        collectionApiUrl = (character.comics.collectionURI + "?dateRange=1900-01-01%2C2019-12-31&orderBy=onsaleDate&limit=100&apikey=c767374de595fc64ed5dea718a47f2d1").replace("http", "https");

        $.ajax(collectionApiUrl)

            .done(function(data) {

                const collection = data.data.results;

                collection.forEach(comic => {

                    insertComicContent(comic);
                });
            });
    };

    const insertCharacterContent = character => {

        thumbnailHolder.html(`
            <img class="thumbnail" src="${character.thumbnail.path.replace("http", "https")}.${character.thumbnail.extension}">
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

        comicList(character);
    };

    const loadCharacter = () => {

        $.ajax(characterApiUrl)
            .done(function(data) {

                const character = data.data.results[0];

                insertCharacterContent(character);
            });
    };

    const changeCharacter = () => {

        const selectedOptionId = characterList.children(":selected").attr("id");

        if(characters[selectedOptionId] !== undefined) {

            characterApiUrl = (characters[selectedOptionId].resourceURI + "?apikey=c767374de595fc64ed5dea718a47f2d1").replace("http", "https");

            loadCharacter();
        }
    };

    // Comic cover enlargement

    function showCover() {

        comicCover.show();

        comicCover.append(`
            <div class="comicCoverHolder">
                <img src="${$(this).attr("src")}">
            </div>
        `)
    }

    const hideCover = () => {

        comicCover.html(`
            <div class="comicCoverClose">CLOSE (X)</div>
        `);

        comicCover.hide();
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

    // Enlarging comic cover

    comicsListHolder.on("click", "img", showCover);

    comicCover.on("click", ".comicCoverClose", hideCover);

});
