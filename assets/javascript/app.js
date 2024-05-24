const articleContainerCards = document.querySelector(".article__container-cards");
const detailsContainer = document.querySelector(".details__container-information");
const newsCard = document.querySelector(".article__container-cards-card");
const homeCategory = document.querySelector(".home__category");
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const phoneInput = document.querySelector("#phone-input");
const textarea = document.querySelector("#textarea");
const btnSubmit = document.querySelector(".submit-btn");

let allData = [];
let allCategory = [];
let likeData = [];
let dislikeData = [];
let formArray = [];
let getFormArray = localStorage.getItem("form");
if (getFormArray) {
    try {
        formArray = JSON.parse(getFormArray);
    } catch {
        console.error('error');
    }
}

function getCurrentUrl() {
    let url = new URLSearchParams(window.location.search);
    let id = url.get("cartId");
    let catId = url.get("categoryId");
    let searchName = url.get('searchName');
    let pathName = window.location.pathname.split("/").pop();
    return {
        id: id,
        pathName: pathName,
        catId: catId,
        searchName: searchName,
    }
}
let page = getCurrentUrl();
// window.onload = () => {}
if (page.pathName == "index.html") {
    fetchData();
    fetchDataCategory();
    searchIndex();
}

else if (page.pathName == "news.html") {
    fetchDataInner(page.id);
    fetchDataCategory();
    fetchData();
    searchIndex();
}
else if (page.pathName == "pages.html") {
    fetchData();
    fetchDataCategory();
    searchIndex();
    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let filter = searchData(searchInput.value, 'name')
        getData(filter);
    });
}
else if (page.pathName == "contact.html") {
    contactForm();
}
function searchIndex() {
    searchBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = "./pages.html?searchName=" + `${searchInput.value}`;
    });
}

async function getAllData() {
    let response = await fetch('http://localhost:3000/news')
    let data = await response.json()
    allData = data;
}
async function fetchData() {
    await getAllData();
    await getData(allData);
    let findc = searchData(page.searchName, 'name')
    getData(findc);
}

async function getData(x) {
    let empty = '';
    x.map((item, index) => {
        // if(index<3){ }
        empty += `
        <div class="article__container-cards-card">
                    <img src="${item.image}" alt="photo">
                    <div class="article__container-cards-card-info">
                        <a href="news.html?cartId=${item.id}" target="_self">${item.name.substring(0, 24).concat("..")}</a>
                        <div class="card-info-spans">
                        <span> 2 hours ago</span>
                        <span>${item.location}</span>
                        </div>
                </div>
         </div>
        `
        articleContainerCards.innerHTML = empty;
    });
}

async function fetchDataInner(id) {
    await getAllData();
    let find = allData.find(item => item.id == id);
    await innerData(find);
    await getData(allData);
}

async function innerData(info) {
    detailsContainer.innerHTML = `
    <h1>${info.name}</h1>
    <div class="details__container-information-img">
        <img src="${info.image}" alt="photo">
    </div>
    <div class="details__container-information-date">
        <p>${info.date}</p>
        <div class="information-date-like">
        <span  class="date-like-count">0</span>
            <button class="btn-like " onclick="likesData(this, ${info.id})">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                        d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z" />
                </svg>
            </button>
            <button class="btn-dislike " onclick="disLikesData(this, ${info.id})">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                        d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z" />
                </svg> 
            </button>
            <span  class="date-dislike-count">0</span>
        </div>
        <p>Outher: <span>${info.auther}</span></p>
    </div>
    <div class="details__container-information-text">
        <p>${info.text}</p>   
    </div>
    `
    // let likeCount = document.querySelector(".date-like-count");
    // localStorage.setItem('likes', JSON.stringify(likeData.length));
    // likeCount.textContent = likeData.length;
}

let getitemData = localStorage.getItem('likes');
if (getitemData) {
    try {
        likeData = JSON.parse(getitemData);
        likeCount.textContent = likeData.length;
    }
    catch {
        console.error('error');
    }
}
async function likesData(e, id) {
    await getAllData()
    const btnLike = document.querySelector(".btn-like");
    const btnDislike = document.querySelector(".btn-dislike");
    let likeCount = document.querySelector(".date-like-count");
    // e.preventDefault();
    btnLike.classList.add("btnActive");
    btnLike.classList.contains("btnActive") ? btnDislike.classList.remove("btnActive") : '';
    let find = allData.find(item => item.id == id);
    console.log(find);
    likeData.push(find);
    localStorage.setItem('likes', JSON.stringify(likeData.length));
    likeCount.textContent = likeData.length;
}

let getitemDataTwo = localStorage.getItem('dislikes');
if (getitemDataTwo) {
    try {
        dislikeData = JSON.parse(getitemDataTwo);
        dislikeCount.textContent = dislikeData.length;
    }
    catch {
        console.error('error');
    }
}
async function disLikesData(e, id) {
    const btnLike = document.querySelector(".btn-like");
    const btnDislike = document.querySelector(".btn-dislike");
    let dislikeCount = document.querySelector(".date-dislike-count");
    btnDislike.classList.add("btnActive");
    btnDislike.classList.contains("btnActive") ? btnLike.classList.remove("btnActive") : '';
    let find = allData.find(item => item.id == id);
    console.log(find);
    dislikeData.push(find);
    localStorage.setItem('dislikes', JSON.stringify(dislikeData.length));
    dislikeCount.textContent = dislikeData.length;
}

async function fetchDataCategory() {
    await categories();
    await category(allCategory);
    await filter(page.catId);
}
async function categories() {
    let response = await fetch('http://localhost:3000/categories')
    let data = await response.json()
    allCategory = data;
}
async function category(x) {
    homeCategory.innerHTML = '';
    x.map(item => {
        homeCategory.innerHTML += `
        <div class="home__category-cart">
                <a href="pages.html?categoryId=${item.id}" class="category-cart-name">${item.name}</a>
            </div>
        `
    });
}
async function filter(id) {
    await getAllData();
    let filter = allData.filter(item => item.categoriesId == id);
    await getData(filter);
}
function searchData(value, type) {
    return allData.filter(item => item[type].toLowerCase().includes(value.toLowerCase()))
}

function contactForm() {
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        formArray.push(
            {
                nameInput: nameInput.value,
                emailInput: emailInput.value,
                phoneInput: phoneInput.value,
                textarea: textarea
            }
        );
        console.log(formArray);
        localStorage.setItem("form", JSON.stringify(formArray));
    })
}

