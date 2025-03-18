import { useState, useEffect } from "react";
import axios from "axios";
import "./RecipeManager.css";

// const API_URL = "https://cloud-app-backend-1.onrender.com/api/recipes/";

const API_URL = "http://localhost:3003/api/recipes";

const RecipeManager = () => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([""]); 
  const [steps, setSteps] = useState([""]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const fetchAllRecipes = async () => {
    try {
      const response = await axios.get(`${API_URL}/all`);
      setRecipes(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách công thức:", error);
    }
  };

  const addRecipe = async () => {
    if (!name || ingredients.length === 0 || steps.length === 0) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      await axios.post(`${API_URL}/add`, { name, ingredients, steps });
      alert("Thêm công thức thành công!");
      fetchAllRecipes();
      setName("");
      setIngredients([""]);
      setSteps([""]);
    } catch (error) {
      console.error("Lỗi khi thêm công thức:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      fetchAllRecipes();
    } else {
      searchRecipes(value);
    }
  };

  const searchRecipes = async (query) => {
    try {
      const response = await axios.get(`${API_URL}/search?name=${query}`);
      setRecipes(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm công thức:", error);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const updateStep = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="form-container">
          <h2>Thêm Công Thức</h2>
          <input
            type="text"
            placeholder="Tên món ăn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <h3>Nguyên liệu</h3>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="input-group">
              <input
                type="text"
                placeholder={`Nguyên liệu ${index + 1}`}
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
              />
              <button onClick={() => removeIngredient(index)}>❌</button>
            </div>
          ))}
          <button onClick={addIngredient}>➕ Thêm nguyên liệu</button>

          <h3>Các bước</h3>
          {steps.map((step, index) => (
            <div key={index} className="input-group">
              <input
                type="text"
                placeholder={`Bước ${index + 1}`}
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
              />
              <button onClick={() => removeStep(index)}>❌</button>
            </div>
          ))}
          <button onClick={addStep}>➕ Thêm bước</button>

          <button onClick={addRecipe}>Thêm công thức</button>
        </div>

        <div className="form-container">
          <h2>Tìm kiếm</h2>
          <input
            type="text"
            placeholder="Nhập tên món ăn"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="recipe-list">
        <h2>Kết quả tìm kiếm</h2>
        {recipes.length === 0 ? (
          <p>Không có công thức nào</p>
        ) : (
          <ul>
            {recipes.map((recipe) => {
              const highlightText = (text, query) => {
                if (!query) return text;
                const regex = new RegExp(`(${query})`, "gi");
                return text.replace(regex, `<span class="highlight">$1</span>`);
              };

              return (
                <li key={recipe._id}>
                  <strong
                    dangerouslySetInnerHTML={{
                      __html: highlightText(recipe.name, searchQuery),
                    }}
                  />
                  <p>
                    <b>Nguyên liệu:</b> {recipe.ingredients.join(", ")}
                  </p>
                  <p>
                    <b>Các bước:</b> {recipe.steps.join(" → ")}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecipeManager;
