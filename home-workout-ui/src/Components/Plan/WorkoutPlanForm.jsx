import React, {useState} from 'react';
import {cs} from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function WorkoutPlanForm({newWorkoutPlan, setNewWorkoutPlan, insertWorkoutPlan}) {
  const [showForm, setShowForm] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validDescription, setValidDescription] = useState(false);
  const [selectedDateNew, setSelectedDateNew] = useState(null);

  // nové workout plány - jméno a popis
  const handleInputChange = e => {
    const {name, value} = e.target;
    setNewWorkoutPlan(prev => ({...prev, [name]: value}));
    if (name === 'Name') {
      setValidName(value.trim() !== '');
    } else if (name === 'Description') {
      setValidDescription(value.trim() !== '');
    }
  };

  // změny v datumu
  const handleDateChange = date => {
    if (!date) return;
    const fixedDate = new Date(date);
    fixedDate.setHours(12, 0, 0, 0);
    setSelectedDateNew(fixedDate);
    setNewWorkoutPlan(prev => ({...prev, Date: fixedDate}));
  };

  // odeslání formuláře
  const handleSubmit = e => {
    e.preventDefault();
    if (validName && validDescription) {
      if (!selectedDateNew) {
        alert('Musíte vybrat datum.');
        return;
      }

      const fixedDate = new Date(selectedDateNew);
      fixedDate.setHours(12, 0, 0, 0);

      const formattedData = {
        ...newWorkoutPlan,
        Date: fixedDate.toISOString().split('T')[0]
      };

      insertWorkoutPlan(formattedData);
      setNewWorkoutPlan({Name: '', Description: '', Date: '', Checked: false});
      setValidName(false);
      setValidDescription(false);
      setShowForm(false);
      setSelectedDateNew(null);
    }
  };

  const formIsValid = validName && validDescription;

  return (
    <>
      <button className={`btn mb-3 ${showForm ? 'btn-danger' : 'btn-outline-primary'}`} onClick={() => setShowForm(!showForm)}>
        {showForm ? '− Zavřít formulář' : '+ Vytvoř nový plán'}
      </button>

      {/* Formulář pro vytvoření nového plánu */}
      {showForm && (
        <div className="card border-primary shadow-sm mb-3">
          <div className="card-body p-3">
            <h5 className="card-title mb-3">Vytvořit nový plán</h5>
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12">
                <label htmlFor="PlanName" className="form-label fw-semibold small">
                  Název plánu
                </label>
                <input
                  type="text"
                  id="PlanName"
                  name="Name"
                  className="form-control form-control-sm rounded-2 mb-2"
                  value={newWorkoutPlan.name}
                  onChange={handleInputChange}
                  placeholder="Např. Pondělní full‑body"
                  required
                  autoFocus
                />
                <label htmlFor="PlanDescription" className="form-label fw-semibold small mt-2">
                  Popis plánu
                </label>
                <textarea
                  id="PlanDescription"
                  name="Description"
                  className="form-control form-control-sm rounded-2 mb-2"
                  value={newWorkoutPlan.description}
                  onChange={handleInputChange}
                  placeholder="Krátký popis plánu"
                  required
                  rows={2}
                />
                <label className="form-label fw-semibold small mt-2">Kdy budete cvičit?</label>
                <br />
                <DatePicker
                  selected={selectedDateNew}
                  onChange={handleDateChange}
                  locale={cs}
                  dateFormat="P"
                  placeholderText="Vyberte datum"
                  className="form-control form-control-sm rounded-2 mb-2"
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-outline-success" disabled={!formIsValid}>
                  Přidat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default WorkoutPlanForm;
