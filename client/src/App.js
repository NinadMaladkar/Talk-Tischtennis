import './App.css';

import { Route } from 'react-router-dom';

import Homepage from './components/Homepage';
import ChatsPage from './components/Chats/ChatsPage';

function App() {
  return (
    <div className='App'>
      <Route path='/' component={Homepage} exact />
      <Route path='/chats' component={ChatsPage} />
    </div>
  );
}

export default App;
