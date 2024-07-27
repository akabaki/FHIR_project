import './App.css'
//import logo from  './images/dept finder logo.png'
import styled from "styled-components";
import Grid from "./components/Grid";
import logo from './images/FHIR_patient_finder_3.png'
const Wrapper = styled.div`
  background-color: #18a558;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: white;
  border: 2px red solid;
  border-radius: 5px;
  justify-content:center;
`;
const Image = styled.img`
    margin-top: -306px;
    margin-bottom: -133px;  
    transform:rotate(-4deg);
  `;


function App() {
  return (
    <Wrapper className='App'>
      <Image src={logo} alt='logo' />     
      <Grid />  
    </Wrapper>
  )
}

export default App
