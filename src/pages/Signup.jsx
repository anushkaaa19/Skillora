import React from 'react';
import signupImg from '../assets/logo.png';
import Template from '../components/Template';

const Signup = ({ setIsLoggedIn }) => {
  return (
    <div className="animate-fade-in">
      <Template
        title="Join millions learning to code with Skillora for free"
        desc1="Build skills for today, tomorrow, and beyond."
        desc2="Education to future-proof your career."
        image={signupImg}
        formType="signup"
        setIsLoggedIn={setIsLoggedIn}
      />
    </div>
  );
};

export default Signup;
