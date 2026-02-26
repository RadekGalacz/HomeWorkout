/**
 * WorkoutPlanForm – Formulář pro vytvoření nového tréninkového plánu.
 * Obsahuje název, popis a výběr data.
 */
import { useState, useMemo } from 'react';
import { cs } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function WorkoutPlanForm({ onSubmit }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const formIsValid = useMemo(() => name.trim() !== '' && description.trim() !== '' && selectedDate !== null, [name, description, selectedDate]);

  const handleDateChange = (date) => {
    if (!date) return;
    const d = new Date(date); d.setHours(12, 0, 0, 0);
    setSelectedDate(d);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formIsValid) return;
    if (!selectedDate) { alert('Musíte vybrat datum.'); return; }
    const d = new Date(selectedDate); d.setHours(12, 0, 0, 0);
    onSubmit({ Name: name, Description: description, Date: d.toISOString().split('T')[0] });
    setName(''); setDescription(''); setSelectedDate(null); setShowForm(false);
  };

  return (
    <>
      <button className={`hw-btn ${showForm ? 'hw-btn-danger' : 'hw-btn-filled'}`} onClick={() => setShowForm(!showForm)}>
        {showForm ? '✕ Zavřít' : '+ Nový plán'}
      </button>

      {showForm && (
        <div className="hw-card mt-3 mb-3 w-100 p-3">
          <h6 className="fw-bold mb-3">Nový tréninkový plán</h6>
          <form onSubmit={handleSubmit} className="row g-2">
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Název</label>
              <input type="text" className="form-control form-control-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="Např. Pondělní full‑body" required autoFocus />
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-semibold">Popis</label>
              <input type="text" className="form-control form-control-sm" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Krátký popis" required />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold">Datum</label>
              <DatePicker selected={selectedDate} onChange={handleDateChange} locale={cs} dateFormat="P" placeholderText="Vyberte" className="form-control form-control-sm" />
            </div>
            <div className="col-6 col-md-2 d-flex align-items-end">
              <button type="submit" className="hw-btn hw-btn-success w-100" disabled={!formIsValid}>+ Vytvořit</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default WorkoutPlanForm;
