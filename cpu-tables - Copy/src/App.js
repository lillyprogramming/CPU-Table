import './App.css';
import React, { useState, useEffect} from 'react';
import Axios from 'axios';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const client = Axios.create({
  baseURL: "http://localhost:3001/" 
});

function App() {
  const [brand, setBrand] = useState(" ");
  const [model, setModel] = useState("");
  const [socket, setSocket] = useState("PGA");
  const [clockspeed, setClockspeed] = useState(0);
  const [cores, setCores] = useState(0);
  const [threads, setThreads] = useState(0);
  const [TDP, setTDP] = useState(0);
  const [price, setPrice] = useState(0);

  const [cpuList, setCpuList] = useState([]);

  useEffect(() => {
    client.get('').then((response) => {
      setCpuList(response.data);
    });
 }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(checkIfValid()) {
      addCPU(brand, model, socket, clockspeed, cores, threads, TDP, price);
    }
    else {
      alert("Input of any number type cannot be negative.");
    }
 };
 const addCPU = (brand, model, socket, clockspeed, cores, threads, TDP, price) => {
  client.post('', {
    brand: brand, model: model, socket: socket, clockspeed: clockspeed, cores: cores, threads: threads, TDP: TDP, price: price,
  }).then(()=>{
    setCpuList([...cpuList, {
      brand: brand, model: model, socket: socket, clockspeed: clockspeed, cores: cores, threads: threads, TDP: TDP, price: price,
    }])
  });
  client.get('').then((response) => {setCpuList(response.data);});
  clearForm();
};
  const deleteCPU = async (id) => {
    await client.delete(`${id}`);
    setCpuList(
      cpuList.filter((val) => {
          return val.id !== id;
       })
    );
 };
 const handleSubmitEdit = (e, id) => {
  e.preventDefault();
  if(checkIfValid()) {
    editCPU(brand, model, socket, clockspeed, cores, threads, TDP, price,id);
  }
  else {
    alert("Input of any number type cannot be negative.");
  }
};
const checkIfValid = () => {
  let inputs = document.getElementsByTagName('input');
  let isValid = true;
  for (var i = 2; i < inputs.length; i++) {
    if(inputs[i].value < 0) {
      inputs[i].value = 0;
      isValid = false;
    }
  }
  setClockspeed(inputs[2].value);
  setCores(inputs[3].value);
  setThreads(inputs[4].value);
  setTDP(inputs[5].value);
  setPrice(inputs[6].value);
  return isValid;
}
  const editCPU = async (brand, model, socket, clockspeed, cores, threads, TDP, price, id) => {
    await client.put(`${id}`, {
      brand: brand, model: model, socket: socket, clockspeed: clockspeed, cores: cores, threads: threads, TDP: TDP, price: price,
    });
    cpuList.forEach(element => {
      if(element.id === id){
        element.brand = brand;
        element.model = model;
        element.socket = socket;
        element.clockspeed = clockspeed;
        element.cores = cores;
        element.threads = threads;
        element.TDP = TDP;
        element.price = price;
      }
    });  
    setCpuList(cpuList);
    client.get('').then((response) => {setCpuList(response.data);});
    clearForm();
  };
  const copyCPU = (val) => {
    let inputs = document.getElementsByTagName('input');
    inputs[0].value = val.brand; 
    inputs[1].value = val.model; 
    inputs[2].value = val.clockspeed; 
    inputs[3].value = val.cores; 
    inputs[4].value = val.threads; 
    inputs[5].value = val.TDP; 
    inputs[6].value = val.price; 
    setBrand(val.brand);
    setModel(val.model);
    setSocket(val.socket);
    setClockspeed(val.clockspeed);
    setCores(val.cores);
    setThreads(val.threads);
    setTDP(val.TDP);
    setPrice(val.price);
  }
  const clearForm=()=>{
    setBrand("");
    setModel("");
    setSocket("PGA");
    setClockspeed(0);
    setCores(0);
    setThreads(0);
    setTDP(0);
    setPrice(0);
  }

  return (
    <div className="App">
      <div className='info'>
        <label>Brand: </label>
        <input type="text" value = {brand} onChange={(event) => {setBrand(event.target.value); }}/>
        <label>Model: </label>
        <input type="text" value = {model} onChange={(event) => {setModel(event.target.value)}}/>
        <label>Socket: </label>
        <ToggleButtonGroup
      value={socket}
      exclusive
      onChange={(event) => {setSocket(event.target.value)}}
      aria-label="socket types"
    >
      <ToggleButton className = "tButton" value="PGA" aria-label="PGA" style ={{
                    width:80,
                    marginBottom:20,
                }}>
        PGA
      </ToggleButton>
      <ToggleButton className = "tButton" value="ZIF" aria-label="ZIF" style ={{
                    width:80,
                }}>
        ZIF
      </ToggleButton>
      <ToggleButton className = "tButton" value="BGA" aria-label="BGA" style ={{
                    width:80,
                }}>
        BGA
      </ToggleButton>
      <ToggleButton className = "tButton" value="LGA" aria-label="LGA" style ={{
                    width:80,
                }}>
        LGA
      </ToggleButton>
    </ToggleButtonGroup>
        <label>Clockspeed: </label>
        <input type="number" value = {clockspeed} onChange={(event) => {setClockspeed(event.target.value)}}/>
        <label>Number of cores: </label>
        <input type="number" value = {cores} onChange={(event) => {setCores(event.target.value)}}/>
        <label>Number of threads: </label>
        <input type="number" value = {threads} onChange={(event) => {setThreads(event.target.value)}}/>
        <label>TDP: </label>
        <input type="number" value = {TDP} onChange={(event) => {setTDP(event.target.value)}}/>
        <label>Price in EUR: </label>
        <input type="number" value = {price} onChange={(event) => {setPrice(event.target.value)}}/>
        <button onClick={clearForm}>Clear Form</button>
        <button onClick={handleSubmit}>Add CPU</button>
      </div>
      <div className='CPUs'>
        <table>
          <tr> 
              <th>Brand</th>
              <th>Model</th>
              <th>Socket</th>
              <th>Clockspeed</th>
              <th>Cores</th>
              <th>Threads</th>
              <th>TDP</th>
              <th>Price</th>
              <th>Functions</th>
          </tr>
          <tbody>
        {cpuList.map(val => {
          return (
            <tr key={val.id}>
              <td>{val.brand}™</td>
              <td>{val.model}</td>
              <td>{val.socket}</td>
              <td>{val.clockspeed} GHz</td>
              <td>{val.cores}</td>
              <td>{val.threads}</td>
              <td>{val.TDP}W</td>
              <td>€{val.price}</td>
              <td id = "functionTD">
              <button id = "deleteB" onClick={()=>{deleteCPU(val.id);}}>x</button>
              <button id = "editB" onClick={(e)=>{handleSubmitEdit(e, val.id);}}>✎</button>
              <button id = "copyB" onClick={()=>{copyCPU(val);}}>✓</button>
              <div></div>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default App;
