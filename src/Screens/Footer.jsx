import React from 'react';
import '../Styles/footer.css';

const Footer = () => {
  return (
    <div className="text-center p-3 mt-5" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', color: 'whitesmoke',fontSize:"1rem" }}>
      <div className="d-flex  justify-content-center">
        <span className="mr-3">Made By - </span>
        <a className="text-body" href="https://www.linkedin.com/in/anukul-maity/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <h5 style={{ color: '#2F8D46' , fontSize:"1.2rem"}}> &nbsp; Anukul Maity</h5>
        </a>
      </div>
    </div>
  );
}

export default Footer;
