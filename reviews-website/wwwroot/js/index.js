

function init_list() {
    $('.star-list').each(function () {
        const fill = '<li><span class="bi bi-star-fill star-list"></span></li>';
        const empty = '<li><span class="bi bi-star star-list"></span></li>';
        const rating = $(this).attr("alt");
        for (let i = 0; i < rating; i++) {
            $(this).append(fill);
        }
        for (let i = rating; i < 5; i++) {
            $(this).append(empty);
        }
    });

}

async function search() {
    const query = $('#search-bar').val();
    const response = await fetch('Reviews/Search?query=' + query);
    const data = await response.json();
    const template = $('#template').html();
    let results = '';
    for (let item in data) {
        let row = template;
        for (let key in data[item]) {
            row = row.replaceAll('{' + key + '}', data[item][key]);
            row = row.replaceAll('%7B' + key + '%7D', data[item][key]);
        }
        results += row;
    }

    $('.comments').html(results);
    init_list();
}

$(function () {
    $('#search-bar').keyup(search);
    init_list();
})