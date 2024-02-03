import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App () {
  const [data, setData] = useState({
    email: '',
    password: ''
  })
  const handler =async  e => {
    e.preventDefault()
   
    const res= await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    })
    const result=await res.json()
    alert(result.message)
    
  }
  return (
    <>
      <form onSubmit={handler}>
        <input
          type='text'
          placeholder='email'
          style={{ margin: 20 }}
          value={data.email}
          onChange={e => setData({ ...data, email: e.target.value })}
        />
        <input
          type='text'
          placeholder='password'
          style={{ margin: 20 }}
          value={data.password}
          onChange={e => setData({ ...data, password: e.target.value })}
        />
        <button type='submit'>Login </button>
      </form>
    </>
  )
}

export default App
