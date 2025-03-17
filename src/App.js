import RecipeManager from "./components/RecipeManager";
import "./index.css";

const App = () => {
  return (
    <div className="app-container">
      <header className="cloud-container">
        <h1>👨‍🍳 Muốn ăn thì lăn vào bếp! 🍲</h1>
      </header>
      <main>
        <RecipeManager />
      </main>
    </div>
  );
};

export default App;
