import React, { useState, useEffect } from 'react';
    import Calendar from 'react-calendar';
    import 'react-calendar/dist/Calendar.css';
    import './App.css';

    function App() {
      const [date, setDate] = useState(new Date());
      const [events, setEvents] = useState([]);
      const [pets, setPets] = useState([]);
      const [showForm, setShowForm] = useState(false);
      const [showPetForm, setShowPetForm] = useState(false);
      const [currentEvent, setCurrentEvent] = useState({
        title: '',
        type: 'vet',
        date: new Date(),
        petIds: [],
        notes: '',
        isDaily: false
      });
      const [newPet, setNewPet] = useState({
        name: '',
        breed: '',
        age: '',
        weight: '',
        photo: null
      });

      useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('petEvents')) || [];
        const storedPets = JSON.parse(localStorage.getItem('pets')) || [];
        setEvents(storedEvents);
        setPets(storedPets);
      }, []);

      const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setNewPet({ ...newPet, photo: reader.result });
          };
          reader.readAsDataURL(file);
        }
      };

      const savePet = () => {
        let newPets;
        if (newPet.id) {
          newPets = pets.map(pet => pet.id === newPet.id ? newPet : pet);
        } else {
          if (pets.length >= 10) {
            alert('Maximum of 10 pets reached');
            return;
          }
          newPets = [...pets, { ...newPet, id: Date.now() }];
        }
        setPets(newPets);
        localStorage.setItem('pets', JSON.stringify(newPets));
        setShowPetForm(false);
        setNewPet({
          name: '',
          breed: '',
          age: '',
          weight: '',
          photo: null
        });
      };

      const editPet = (petId) => {
        const petToEdit = pets.find(pet => pet.id === petId);
        if (petToEdit) {
          setNewPet(petToEdit);
          setShowPetForm(true);
        }
      };

      const deletePet = (petId) => {
        const updatedPets = pets.filter(pet => pet.id !== petId);
        setPets(updatedPets);
        localStorage.setItem('pets', JSON.stringify(updatedPets));
      };

      return (
        <div className="app">
          <h1>Pet Scheduler</h1>
          <div className="controls">
            <button onClick={() => setShowForm(true)}>Add Event</button>
            <button onClick={() => setShowPetForm(true)}>Add Pet</button>
          </div>

          <div className="calendar-container card">
            <Calendar onChange={setDate} value={date} />
          </div>

          <div className="pet-profiles">
            <h2>Pet Profiles</h2>
            <div className="profiles-grid">
              {pets.map(pet => (
                <div key={pet.id} className="pet-profile card">
                  {pet.photo && (
                    <img 
                      src={pet.photo} 
                      alt={pet.name} 
                      className="profile-photo"
                    />
                  )}
                  <div className="profile-info">
                    <h3>{pet.name}</h3>
                    <p><strong>Breed:</strong> {pet.breed}</p>
                    <p><strong>Age:</strong> {pet.age}</p>
                    <p><strong>Weight:</strong> {pet.weight}</p>
                    <div className="profile-actions">
                      <button onClick={() => editPet(pet.id)}>Edit</button>
                      <button onClick={() => deletePet(pet.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showPetForm && (
            <div className="modal">
              <div className="modal-content card">
                <h2>{newPet.id ? 'Edit Pet' : 'Add New Pet'}</h2>
                <div className="form-group">
                  <label>Pet Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {newPet.photo && (
                    <img 
                      src={newPet.photo} 
                      alt="Preview" 
                      className="pet-preview"
                    />
                  )}
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newPet.name}
                    onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Breed</label>
                  <input
                    type="text"
                    value={newPet.breed}
                    onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="text"
                    value={newPet.age}
                    onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Weight</label>
                  <input
                    type="text"
                    value={newPet.weight}
                    onChange={(e) => setNewPet({...newPet, weight: e.target.value})}
                  />
                </div>
                <div className="form-actions">
                  <button onClick={savePet}>Save</button>
                  <button onClick={() => setShowPetForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    export default App;
