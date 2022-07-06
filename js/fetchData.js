async function fetchByTerm(term) {

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    const respData = await resp.json();

    return respData.meals;
}

async function getRandomMeal() {

    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");

    const respData = await resp.json();

    return respData.meals;

}

async function fetchMealsByCateg(category) {

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const respData = await resp.json();

    return respData.meals;
}

async function fetchMealById(idMeal) {

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`);
    const respData = await resp.json();

    return respData.meals[0]; 
}

async function fetchCategories() {

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    const respData = await resp.json();
    const categories = respData.categories;

    return categories;

}

export { fetchCategories, fetchMealsByCateg ,fetchMealById, getRandomMeal, fetchByTerm };
