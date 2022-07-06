function addMealLS(mealId) {

    const mealIds = getMealsLS();
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));

}

function removeMealLS(mealId) {

    const mealIds = getMealsLS();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getMealsLS() {

    const mealIds = JSON.parse(localStorage.getItem('mealIds')) || [];
    return mealIds;
}


export { addMealLS, removeMealLS, getMealsLS };