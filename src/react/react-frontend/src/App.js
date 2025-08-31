import './App.css';
import Trainers from './components/Trainers';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokemon Trainer Manager</h1>
        <p>Manage your Pokemon trainers and their Pokemon teams</p>
      </header>
      
      <main className="App-main">
        <Trainers />
      </main>
    </div>
  );
}

export default App;
