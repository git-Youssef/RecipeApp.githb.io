import { addMealLS, removeMealLS, getMealsLS } from './localStorage.js';
import * as myObj from './fetchData.js';


let arrMeals ;

const categorieList = document.querySelector(".categories ul");
const mealsContainer = document.querySelector(".meals-container");
const inputSearch = document.querySelector("#searchInput");
const suggestList = document.querySelector(".search-list");
const favMeals = document.querySelector(".fav-meals");
const btnClose = document.querySelector("aside .close");
const showFavMeals = document.querySelector(".show-fav-meals");
const aside = document.querySelector("aside");
let mealsId = getMealsLS();
let favCounter = mealsId.length;
let myFavNumber = document.querySelector(".fav-number");

myFavNumber.innerHTML = favCounter;



async function displayCategories() {

    const categories = await myObj.fetchCategories();

    categorieList.innerHTML = categories.map(categData => {
        const { strCategoryThumb, strCategory } = categData;

        return `
            <li data-categorie=${strCategory}>
                <img src="${strCategoryThumb}" alt="${strCategory}">
                            <span>${strCategory}</span>    
            </li>
        `
    }).join("");

    // on click send categorie name to the api to be fetched

    const liCategories = categorieList.querySelectorAll("li");

    liCategories.forEach(li => {

        li.addEventListener('click', async (e) => {

            const categorie = li.dataset.categorie;

            liCategories.forEach(li => li.classList.remove("active"));
            li.classList.add("active");

             arrMeals = await myObj.fetchMealsByCateg(categorie);

            displayMeal(arrMeals);
        });
    })

}

function displayMeal(meals, random = false) {

    mealsId = getMealsLS();
    mealsContainer.innerHTML = "";
    mealsContainer.innerHTML = meals.map(mealData => {

        const { strMeal, strMealThumb, idMeal } = mealData;

        return ` <article class="meal" data-id=${idMeal}>
                    <div class="meal-header">
                       ${(random) ? ` <span class="random">Random recipe</span>` : ""}  
                            <a href="singleMeal.html?i=${idMeal}" target="_blank">
                                <img src="${strMealThumb}"alt="${strMeal}" title="${strMeal}">
                            </a>
                    </div>
                    <div class="meal-body">
                        <h5>${strMeal}</h5>
                        <button class="fav-btn ${(mealsId.includes(idMeal)) ? "active" : ""}">
                            <i class="fa fa-heart"></i>
                        </button>
                    </div>
                </article>`

    }).join("");


    // add To Favorite

    document.querySelectorAll(".fav-btn").forEach(favBtn => {

        favBtn.addEventListener("click", (e) => {

            const idMeal = favBtn.closest("article").dataset.id;

            if (favBtn.classList.contains("active")) {

                removeMealLS(idMeal);
                favBtn.classList.remove("active");
                myFavNumber.innerHTML = --favCounter;
                AddToFavMeals();

            }
            else {

                addMealLS(idMeal);
                favBtn.classList.add("active");
                myFavNumber.innerHTML = ++favCounter;
                AddToFavMeals();
            }

            myFavNumber.classList.add("show");
            // remove show class when annimation end 
            myFavNumber.addEventListener("animationend", function () {
                this.classList.remove("show");

            }, false);
        })
    })
}

function AddToFavMeals() {

    mealsId = getMealsLS();

    if (mealsId.length === 0) {
        favMeals.innerHTML = 'Nothing Found , Add some meals to your favorite ... !';
    }

    else {

        favMeals.innerHTML = '';

        mealsId.forEach(async (id) => {

            const meal = await myObj.fetchMealById(id);

            const { strMeal, strMealThumb, idMeal } = meal;

            const li = document.createElement("li");
            li.setAttribute(`data-id`, `${idMeal}`);
            li.innerHTML = `<img src=${strMealThumb} alt="${strMeal}" title="${strMeal}"><span class="removeMeal"><i class="fa-solid fa-circle-minus"></i></span>`;
            favMeals.appendChild(li);

            li.querySelector(".removeMeal").addEventListener('click', (e) => {

                const li = e.currentTarget.parentElement;

                removeMealLS(li.dataset.id);
                li.remove();
                myFavNumber.innerHTML = --favCounter;

                displayMeal(arrMeals);
            })

        });

    }

}


// Search ********************************************

inputSearch.addEventListener("keyup", async (e) => {

    const inputValue = inputSearch.value;

    if (inputValue) {

        const mealsFound = await myObj.fetchByTerm(inputValue);

        suggestList.classList.add("show");

        if (mealsFound !== null) {

            suggestList.innerHTML = [`<li>${inputValue}</li>`, ...mealsFound.map(mealData => `<li id=${mealData.idMeal}>${mealData.strMeal}</li>`)].join("");

            suggestList.querySelectorAll("li").forEach(li => {

                li.addEventListener("click", async () => {

                    const meals = await myObj.fetchByTerm(li.textContent);
                    displayMeal(meals);
                    inputSearch.value = li.textContent;
                    suggestList.classList.remove("show");

                });
            })

        }
        else {
            suggestList.innerHTML = '<li>Ooops ! nothing found ,  try something else ...</li>';
        }
    }

    else {

        suggestList.classList.remove("show");
    }


});

document.querySelector("form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const inputVal = inputSearch.value;

    const meals = await myObj.fetchByTerm(inputVal);

    if (meals) {
        displayMeal(meals);
    }

})


// App start from here **********************************

const init = async () => {

  arrMeals = await myObj.getRandomMeal();
    displayMeal(arrMeals, true);
    displayCategories();
    AddToFavMeals();

    btnClose.addEventListener("click", (e) => {
        aside.classList.toggle("show");
    });

    showFavMeals.addEventListener("click", (e) => {
        aside.classList.toggle("show");
    });

}


window.addEventListener('DOMContentLoaded', init);
