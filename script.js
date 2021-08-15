$(document).ready(() => {
    // Initial page
    window.pagination = 1;

    // Number of rows per result
    window.noOfRows = 10; 
    getUsers(window.pagination);
});



function getRow(name, email, designation) {
    var parent = document.createElement('div');
    parent.classList.add('row','border-top','border-bottom','border-secondary','py-2');

    var col1 = document.createElement('div');
    col1.classList.add('col-8');

    var col2 = document.createElement('div');
    col2.classList.add('col-4');

    var nameHolder = document.createElement('p');
    nameHolder.classList.add('h6');

    var emailHolder = document.createElement('p');
    emailHolder.classList.add('font-weight-light','mb-0');

    nameHolder.innerHTML = name;
    emailHolder.innerHTML = email;
    col2.innerHTML = designation;

    col1.appendChild(nameHolder);
    col1.appendChild(emailHolder);
    parent.appendChild(col1);
    parent.appendChild(col2);

    return parent;

}

function getUsers(pagination) {
    document.getElementById('results').classList.add('d-none');
    document.getElementById('noResults').classList.add('d-none');
    document.getElementById('loader').classList.remove('d-none');
    document.getElementById('footer').innerHTML = "";
    document.getElementById('footer').classList.add('d-none');
    var holder = document.getElementById('resultsHolder')
    holder.innerHTML = "";

    $.ajax({
        url: "https://roshs-apis.000webhostapp.com/api/users.php",
        dataType: 'html',
        type: 'POST',
        data: {
            pagination: pagination
        },
        success: (response) => {
            response = JSON.parse(response);
            if (response.data.length > 0) {
                document.getElementById('results').classList.remove('d-none');
                document.getElementById('total').innerHTML = response.totalRows;
                document.getElementById('from-to').innerHTML = (((parseInt(pagination) -1)*window.noOfRows)+1) +" - "+ (((parseInt(pagination) -1)*window.noOfRows)+response.data.length);
                window.totalRows = response.totalRows;

                for (var i = 0; i< response.data.length; i++) {
                    holder.appendChild(getRow(response.data[i].name, response.data[i].email, response.data[i].designation));
                }

                if (window.totalRows > window.noOfRows) {
                    var footer = document.getElementById('footer');
                    footer.classList.remove('d-none');
                    footer.appendChild(getPaginationBar(pagination))
                }

            } else {
                document.getElementById('noResults').classList.remove('d-none');
                document.getElementById('from-to').innerHTML = "0";
                document.getElementById('total').innerHTML = "0";
            }
            document.getElementById('loader').classList.add('d-none');

        },
        error: (err) => {
            console.log(err)
        }
    })
}

function getPaginationBar(currentPage) {
    var parent = document.createElement('nav');
    parent.setAttribute("aria-label", "Navigate");

    var unOrderedList = document.createElement('ul'); 
    unOrderedList.classList.add('pagination', 'justify-content-center');

    parent.appendChild(unOrderedList);

    var prevArrow = document.createElement('li');
    prevArrow.classList.add('page-item')
    var prevLink = document.createElement('a');
    prevLink.classList.add("page-link")
    prevLink.setAttribute("aria-label","Previous");
    prevLink.innerHTML = "<span aria-hidden='true'>&laquo;</span>";
    prevLink.setAttribute('onclick', 'goToPreviousPage()')
    prevArrow.appendChild(prevLink);

    var nextArrow = document.createElement('li');
    nextArrow.classList.add('page-item')
    var nextLink = document.createElement('a');
    nextLink.classList.add("page-link")
    nextLink.setAttribute("aria-label","Next");
    nextLink.innerHTML = "<span aria-hidden='true'>&raquo;</span>";
    nextLink.setAttribute('onclick', 'goToNextPage()')
    nextArrow.appendChild(nextLink);

    var page1 = document.createElement('li');
    page1.classList.add('page-item');
    var page1Link = document.createElement('a')
    page1Link.classList.add('page-link')
    page1.appendChild(page1Link);

    var page2 = document.createElement('li');
    page2.classList.add('page-item');
    var page2Link = document.createElement('a')
    page2Link.classList.add('page-link')
    page2.appendChild(page2Link);

    var page3 = document.createElement('li');
    page3.classList.add('page-item');
    var page3Link = document.createElement('a')
    page3Link.classList.add('page-link')
    page3.appendChild(page3Link);

    unOrderedList.appendChild(prevArrow)
    unOrderedList.appendChild(page1)
    unOrderedList.appendChild(page2)

    let pages = [];
    const noOfPages = Math.floor(window.totalRows / window.noOfRows);
    const noOfButtons = ((noOfPages+1) < 3) ? 2 : 3;
    
    if (currentPage == 1) {
        page1.classList.add('active');
        page1.setAttribute('aria-current', 'page');
        pages = (noOfButtons == 2) ? [1, 2] : [1, 2, 3];
        prevArrow.classList.add('disabled')

    } else if ((currentPage == noOfPages+1) && (noOfButtons == 3)) {
        page3.classList.add('active');
        page3.setAttribute('aria-current', 'page')
        pages = [currentPage-2, currentPage-1, currentPage];
        nextArrow.classList.add('disabled')

    } else {
        page2.classList.add('active');
        page2.setAttribute('aria-current', 'page')
        if (noOfButtons == 2) {
            nextArrow.classList.add('disabled')
            pages = [currentPage-1, currentPage]
        } else
            pages = [currentPage-1, currentPage, currentPage+1];
    }

    page1Link.innerHTML = pages[0];
    page1Link.setAttribute('onclick', 'getPage('+ pages[0] +')')
    page2Link.innerHTML = pages[1];
    page2Link.setAttribute('onclick', 'getPage('+ pages[1] +')')
    if (pages[2] != null) {
        page3Link.innerHTML = pages[2];
        page3Link.setAttribute('onclick', 'getPage('+ pages[2] +')')
        unOrderedList.appendChild(page3);
    }
    
    unOrderedList.appendChild(nextArrow)
    return parent;
}

function goToPreviousPage() {
    if (window.pagination-1 >= 1) {
        window.pagination = window.pagination - 1;
        getUsers(window.pagination)
    }
}

function goToNextPage() {
    if (window.pagination+1 <= (Math.floor(window.totalRows/window.noOfRows)+1) ) {
        window.pagination = window.pagination + 1;
        getUsers(window.pagination)
    }
}


function getPage(page) {
    window.pagination = parseInt(page);
    getUsers(page);
}