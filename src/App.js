import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          抱歉啊，我是个夜猫子，所以打卡会比较晚^~^
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          今天开始学习一个全新的前端框架 React...
        </a>
      </header>
    </div>
  );
}

export default App;
