const form = document.querySelector('.search-form');
const recipeList = document.querySelector('.recipe-list');
const recipeModal = document.getElementById('recipeModal');
const closeModalButton = document.getElementById('closeModal');
const recipeDetails = document.querySelector('.recipe-details');

// Adiciona o evento de submissão do formulário
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const inputValue = form.querySelector('input').value.trim();
    if (inputValue) {
        searchRecipes(inputValue);
    }
});

// Função para buscar receitas pela API
async function searchRecipes(ingredient) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();

        if (data.meals) {
            showRecipes(data.meals);
        } else {
            recipeList.innerHTML = `<p class="no-results">Nenhuma receita encontrada com esse ingrediente.</p>`;
        }
    } catch (error) {
        console.error('Erro na busca:', error);
        recipeList.innerHTML = `<p class="error">Erro ao buscar receitas. Tente novamente mais tarde.</p>`;
    }
}

// Função para exibir as receitas na página
function showRecipes(recipes) {
    recipeList.innerHTML = recipes.map(item => `
        <div class="recipe-card" onclick="openRecipeModal('${item.idMeal}')">
            <img src="${item.strMealThumb}" alt="Foto da receita: ${item.strMeal}">
            <h3>${item.strMeal}</h3>
        </div>
    `).join('');
}

// Função para abrir o modal com os detalhes da receita
async function openRecipeModal(id) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        const recipe = data.meals[0];

        // Exibir os detalhes da receita dentro do modal
        displayRecipeDetails(recipe);

        // Mostrar o modal
        recipeModal.style.display = 'flex';
    } catch (error) {
        console.error('Erro ao buscar detalhes da receita:', error);
    }
}

// Função para exibir os detalhes da receita no modal
function displayRecipeDetails(recipe) {
    recipeDetails.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" style="width:100%; border-radius: 10px; margin: 20px 0;" />
        <h3>Categoria: ${recipe.strCategory}</h3>
        <h3>Ingredientes:</h3>
        <ul>
            ${getIngredients(recipe)}
        </ul>
        <h3>Instruções:</h3>
        <p>${recipe.strInstructions}</p>
    `;
}

// Função para extrair os ingredientes da receita
function getIngredients(recipe) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`<li>${ingredient} - ${measure}</li>`);
        }
    }
    return ingredients.join('');
}

// Fecha o modal ao clicar no botão de fechar
closeModalButton.addEventListener('click', () => {
    recipeModal.style.display = 'none';
});
