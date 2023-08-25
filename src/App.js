import logo from './logo.svg';
import './App.css';
import MedicamentList from './features/medicaments/MedicamentsMainPage.js';
import BaremesMainPage from './features/baremes/BaremesMainPage';
import ActesMainPage from './features/actes/ActesMainPage'
function App() {
  // return (
  //   <div className="App">
  //    <MedicamentList></MedicamentList>
  //   </div>
  // );

  // return (
  //   <div className="App">
  //    <BaremesMainPage></BaremesMainPage>
  //   </div>
  // );

  return (
    <div className="App">
     <ActesMainPage></ActesMainPage>
    </div>
  );
}

export default App;


