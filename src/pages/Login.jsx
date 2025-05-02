import React from 'react';
import Template from '../components/Template';
import loginImg from '../assets/logo.png';

const Login = ({ setIsLoggedIn }) => {
  return (
    <div className="animate-fade-in">
      <Template
        title="Welcome Back"
        desc1="Build skills for today, tomorrow, and beyond."
        desc2="Education to future-proof your career."
        image={loginImg}
        formType="login"
        setIsLoggedIn={setIsLoggedIn}
      />
    </div>
  );
};

export default Login;
