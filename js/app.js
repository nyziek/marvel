$(function() {

    var characterList = $(".characterList");
    var body = $(".body");
    var apiUrl = "https://gateway.marvel.com:443/v1/public/characters?limit=5&apikey=c767374de595fc64ed5dea718a47f2d1";

    function insertListContent(characters) {

        for (var i = 0; i < characters.length; i++) {
            characterList.append(`
                <li>
                    ${characters[i].name}
                </li>
            `);

            body.append(`
                <img class="thumbnail" src="${characters[i].thumbnail.path}.${characters[i].thumbnail.extension}">
            `);
        }

    }

    function loadApi() {
        $.ajax(apiUrl)
            .done(function(data) {
                console.log(data);

                var characters = data.data.results;

                insertListContent(characters);
            });
    }

    loadApi();
});