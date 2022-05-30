const categorieList = document.querySelector(".categories ul");
const mealsContainer = document.querySelector(".meals-container");
const inputSearch = document.querySelector("#searchInput");
const suggestList = document.querySelector(".search-list");

// filter by categorie 

async function fetchCategories() {

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    const respData = await resp.json();
    const categories = respData.categories;

    //display catgories to dom

    categorieList.innerHTML = categories.map(categData => {
        const { strCategoryThumb, strCategory } = categData;

        return `
            <li>
                <img src="${strCategoryThumb}" alt="${strCategory}">
                            <span>${strCategory}</span>    
            </li>
        `
    }).join("");

    // on click send categorie name to the api to be fetched

    const liCategories = categorieList.querySelectorAll("li");

    liCategories.forEach(li => {

        li.addEventListener('click', (e) => {

            const currentLi = e.currentTarget;

            liCategories.forEach(li => li.classList.remove("active"));
            currentLi.classList.add("active");

            fetchCategorieMeals(currentLi.textContent.trim());
        });
    })
}
async function getRandomMeal() {

    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const respData = await resp.json();

    const randomMealData = respData.meals[0];

    displayMeal(randomMealData);

}

async function fetchCategorieMeals(categorie) {

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorie}`);
    const respData = await resp.json();
    const categMeals = respData.meals;


    mealsContainer.innerHTML = "";

    categMeals.forEach(async categMealData => {

        const mealData = await fetchMealById(categMealData.idMeal);

        displayMeal(mealData);
    }

    );
}

async function fetchMealById(idMeal) {

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    const respData = await resp.json();

    const mealData = respData.meals[0];

    return mealData;
}

async function fetchMealsBySearch(term) {

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    const respData = await resp.json();

    return respData.meals;
}

function displayMeal(mealData) {

    const { idMeal, strMeal, strMealThumb, strCategory } = mealData;
    const meal = document.createElement("article");

    meal.classList.add("meal");
    meal.innerHTML =
        `   <div class="meal-header">
                <span class="categorie">${strCategory}</span> 
                    <a href="singleMeal.html?i=${idMeal}" target="_blank">
                        <img src="${strMealThumb}"alt="${strMeal}" title="${strMeal}">
                    </a>
            </div>
            <div class="meal-body">
                <h5>${strMeal}</h5>
                <button class="fav-btn">
                    <i class="fa fa-heart"></i>
                </button>
            </div>`;

    mealsContainer.appendChild(meal);

}

inputSearch.addEventListener("keyup", async (e) => {

    // e.preventDefault(); 
    // 
    const inputValue = inputSearch.value;
    const mealsFound = await fetchMealsBySearch(inputValue);

    if (inputValue) {
        suggestList.classList.add("show");

        if (mealsFound !== null) {

            suggestList.innerHTML = mealsFound.map(mealData => `<li id=${mealData.idMeal}>${mealData.strMeal}</li>`).join("");

            suggestList.querySelectorAll("li").forEach(li => {

                li.addEventListener("click", async() => {

                   inputSearch.value = li.textContent;
                    const mealData = await fetchMealById(li.id);

                    mealsContainer.innerHTML = '';
                    suggestList.classList.remove("show");
                    displayMeal(mealData);
                
                })
            })

        }
        else {
            suggestList.innerHTML = '<li>Ooops nothinf found try something else ...</li>';
        }
    }

    else {
        suggestList.classList.remove("show");

    }


});



// Start from here **********************************

const init = () => {

    fetchCategories();
    getRandomMeal();

}

init();



