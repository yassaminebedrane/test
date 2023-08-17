import logo from './logo.svg';
import './App.css';
import MedicamentList from './features/medicaments/MedicamentsMainPage.js';
import BaremesMainPage from './features/baremes/BaremesMainPage';
function App() {
  // return (
  //   <div className="App">
  //    <MedicamentList></MedicamentList>
  //   </div>
  // );

  return (
    <div className="App">
     <BaremesMainPage></BaremesMainPage>
    </div>
  );
}

export default App;


