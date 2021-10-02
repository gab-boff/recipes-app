import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import FoodsContext from '../context/FoodsContext';

export default function CategoryButtons() {
  const FOOD_BUTTONS_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
  const DRINK_BUTTONS_URL = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
  const FOOD_CATEGORIES_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';
  const DRINK_CATEGORIES_URL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=';
  const FOOD_CARDS_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  const DRINK_CARDS_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
  const sizeButtons = 5;
  const location = useLocation();
  const [category, setCategory] = useState('');
  const {
    setRecipeData,
    recipeData,
    buttonsCategories,
    setButtonsCategories,
  } = useContext(FoodsContext);

  const categoryClickOptions = {
    '/comidas': FOOD_CATEGORIES_URL,
    '/bebidas': DRINK_CATEGORIES_URL,
  };

  function setFoodRecipeData(data, buttonText) {
    setRecipeData([...data.meals]);
    setCategory(buttonText);
  }

  function setDrinkRecipeData(data, buttonText) {
    setRecipeData([...data.drinks]);
    setCategory(buttonText);
  }

  const setRecipeOptions = {
    '/comidas': (data, buttonText) => setFoodRecipeData(data, buttonText),
    '/bebidas': (data, buttonText) => setDrinkRecipeData(data, buttonText),
  };

  async function searchRecipeByCategory(buttonText) {
    const endpoint = categoryClickOptions[location.pathname];
    const response = await fetch(`${endpoint}${buttonText}`);
    const data = await response.json();

    return setRecipeOptions[location.pathname](data, buttonText);
  }

  async function foodsRequest() {
    const response = await fetch(FOOD_CARDS_URL);
    const data = await response.json();
    return data.meals;
  }

  async function drinksRequest() {
    const response = await fetch(DRINK_CARDS_URL);
    const data = await response.json();
    return data.drinks;
  }

  function toogleCategoryButton(buttonText) {
    if (location.pathname === '/comidas' && category === buttonText) {
      return foodsRequest().then((data) => setRecipeData([...data]));
    }
    if (location.pathname === '/bebidas' && category === buttonText) {
      return drinksRequest().then((data) => setRecipeData([...data]));
    }

    searchRecipeByCategory(buttonText);
  }
  function handleAllCategory() {
    const searchOptions = {
      '/comidas': () => foodsRequest()
        .then((data) => setRecipeData([...data])),
      '/bebidas': () => drinksRequest()
        .then((data) => setRecipeData([...data])),
    };
    return searchOptions[location.pathname]();
  }

  useEffect(() => {
    const buttonsRequest = async () => {
      if (location.pathname === '/comidas') {
        const response = await fetch(FOOD_BUTTONS_URL);
        const data = await response.json();
        return data;
      } const response = await fetch(DRINK_BUTTONS_URL);
      const data = await response.json();
      return data;
    };
    if (location.pathname === '/comidas') {
      buttonsRequest().then((data) => setButtonsCategories([...data.meals]));
    }
    if (location.pathname === '/bebidas') {
      buttonsRequest().then((data) => setButtonsCategories([...data.drinks]));
    }
  }, [location, setButtonsCategories]);

  function generateCategoriesButtons() {
    const recipeCategories = buttonsCategories.map(({ strCategory }) => strCategory);
    return (
      recipeCategories.slice(0, sizeButtons).map((type) => (
        <Button
          className="m-1 flex-fill"
          variant="secondary"
          key={ type }
          data-testid={ `${type}-category-filter` }
          onClick={ ({ target }) => toogleCategoryButton(target.innerHTML) }
        >
          { type }
        </Button>
      ))
    );
  }

  return (
    <div className="d-flex flex-wrap justify-content-center px-5 mb-3">
      <Button
        className="m-1 flex-fill"
        variant="secondary"
        onClick={ handleAllCategory }
        data-testid="All-category-filter"
      >
        All
      </Button>
      { recipeData && buttonsCategories ? generateCategoriesButtons() : null }
    </div>
  );
}
