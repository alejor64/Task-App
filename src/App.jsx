import React, { useEffect, useState } from 'react'
import {firebase} from './firebase'

function App() {

  const [tareas, setTareas] = useState([])
  const [tarea, setTarea] = useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] = useState('')

  useEffect(() => {

    const obtenerDatos = async () => {

      try {
        const db = firebase.firestore()
        const data = await db.collection('tareas').get()
        // console.log(data.docs)
        const arrayData = data.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // console.log(arrayData)
        setTareas(arrayData)
      } catch (err) {
        console.log(err)
      }

    }

    obtenerDatos()

  }, [])

  const agregar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()) {
      console.log('Está vacío')
      return
    }

    try {

      const db = firebase.firestore()
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }

      const data = await db.collection('tareas').add(nuevaTarea)
      setTareas([
        ...tareas,
      {...nuevaTarea, id: data.id}
    ])
      setTarea('')

    } catch (err) {
      console.log(err)
    }

    console.log(tarea)
  }

  const eliminar = async (id) => {
    try {

      const db = firebase.firestore()
      await db.collection('tareas').doc(id).delete()

      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)

    } catch (err) {
      console.log(err)
    }

  }

  const activarEdicion = (item) => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  }

  const editar = async (e) => {
    e.preventDefault()
    if(!tarea.trim()) {
      console.log('Está vacío')
      return
    }
    try {

      const db = firebase.firestore()
      await db.collection('tareas').doc(id).update({
        name: tarea
      })
      const arrayEditado = tareas.map(item => (
        item.id === id ? {id: item.id, fecha: item.fecha, name:tarea} : item
      ))
      setTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setId('')

    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <div className="container mt-3">
        <div className="row">
          <div className="col-md 4">
            <ul className="list-group">
              {
                tareas.map(item => (
                  <li key={item.id}className="list-group-item">
                    {item.name}
                    <button 
                      className="btn btn-danger btn-sm float-right"
                      onClick={() => eliminar(item.id)}
                    ><i class="material-icons">delete_forever</i>
                    </button>
                    <button 
                      className="btn btn-warning btn-sm float-right mr-2"
                      onClick={() => activarEdicion(item)}
                    ><i class="material-icons">edit</i>
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="col-md 6">
            <h3>
              {modoEdicion ? 'Editar tarea' : 'Agregar Tarea'}
            </h3>
            <form onSubmit={ modoEdicion ? editar : agregar}>
              <input 
                type="text"
                placeholder="Ingrese Tarea"
                className="form-control mb-2"
                onChange={(e) => setTarea(e.target.value)}
                value={tarea}
              />
              <button
                className={
                  modoEdicion ? 'btn btn-warning btn-block' : "btn btn-dark btn-block"
                }
                type="submit"
              >
                {modoEdicion ? 'Editar' : 'Agregar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
