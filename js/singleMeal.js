const fetchSinglMeal = 'https://www.themealdb.com/api/json/v1/1/lookup.php';
const mealImage = document.querySelector(".meal-img img");
const singleMealContainer = document.querySelector('.single-meal-page .container');

window.addEventListener('DOMContentLoaded', fetchElementById);

async function fetchElementById() {

    const idSearchMeal = document.location.search;

    const resp = await fetch(`${fetchSinglMeal}${idSearchMeal}`);

    const respData = await resp.json();

    const mealData = respData.meals[0];

    const { strMealThumb, strCategory, strTags, strMeal, strInstructions } = mealData;


    let arrIngredients = [];

    for (let i = 1; i < 20; i++) {

        if (!mealData["strIngredient" + i]) {
            break;
        }

        arrIngredients.push(`${mealData["strMeasure" + i]} ${mealData["strIngredient" + i]} `);

    }

    singleMealContainer.innerHTML = `

            <article class="meal">
                  <h1>${strMeal}</h1>
                    <div class="meal-header">
                        <img src="${strMealThumb}" alt="${strMeal}" title="${strMeal}">
                    </div>

                    ${(strTags !== null) ?
                      ` <div class="tags">
                            Tags : 
                                ${strTags.split(",").map(tag => `<span>${tag}</span>`).join("")}
                            </div>` : ""
                       }

                    <div class="meal-infos">
                        <h3>Ingredients</h3>
                        <ul>
                              ${arrIngredients.map(item => `<li>${item}</li>`).join("")}
                        </ul> 

                        <h3>Instructions</h3>
                        <p>
                             ${strInstructions}  
                        </p>
                             
                    </div>
            </article>`;

}

