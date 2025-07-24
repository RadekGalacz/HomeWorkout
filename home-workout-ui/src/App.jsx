import {BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';
import ExerciseAdmin from './Components/Exercise/ExerciseAdmin';
import BodyPartAdmin from './Components/BodyPart/BodyPartAdmin';
import WorkoutPlan from './Components/Plan/WorkoutPlan';
import WelcomeModal from './Components/WelcomeModal/WelcomeModal';
import UserAdmin from './Components/User/UserAdmin';
import Roles from './Components/Roles/Roles';
import Login from './Components/Auth/Login';

// Nastavení Axios pro cookies (nutné pro autentizaci)
axios.defaults.withCredentials = true;

function AppContent() {
  // Stavy entit
  const [bodyParts, setBodyParts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [plans, setPlans] = useState([]);
  const [planExercises, setPlanExercises] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  // Autentizace
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Welcome modal
  const [showHelp, setShowHelp] = useState(() => localStorage.getItem('hasSeenWelcomeModal') !== 'true');

  const navigate = useNavigate();
  const baseUrl1 = 'https://localhost:44341/';
  const baseUrl = 'https://homeworkoutwebapp.runasp.net/';

  // Výchozí stavy entit
  const [newBodyPart, setNewBodyPart] = useState({BodyPartName: ''});
  const [newExercise, setNewExercise] = useState({ExerciseName: '', ExerciseDescription: '', Difficulty: '', BodyPartId: ''});
  const [newPlan, setNewPlan] = useState({Name: '', Description: '', Date: ''});
  const [newPlanExercise, setNewPlanExercise] = useState({sets: '', reps: '', workoutPlanId: null, exerciseId: null, checked: null});
  const [newUser, setNewUser] = useState({Name: '', Email: '', Password: ''});
  const [newRole, setNewRole] = useState({RoleName: ''});

  // Zpracování chyb Axios
  const handleError = error => {
    const msg = error.response?.data?.errors
      ? Object.values(error.response.data.errors)[0]
      : error.response?.data?.message || error.message || 'Neznámá chyba';

    if (error.response?.status === 404 && error.config.url.includes('AccessDenied')) return;
    if (error.response?.status === 405 && error.config.url.includes('Account/Login')) return;
    alert(`Chyba: ${msg}`);
    console.error(`Chyba: ${msg}`);
  };

  // Autentizace
  const checkAuth = async () => {
    try {
      const {data} = await axios.get(`${baseUrl}Account/UserInfo`);
      setUser(data.userName || null);
      setRole(data.role?.toLowerCase() || null);
    } catch (error) {
      setUser(null);
      setRole(null);
      console.error('Chyba autentizace:', error);
    } finally {
      setAuthChecked(true);
    }
  };

  // Funkce pro načtení dat
  const fetchBodyParts = () =>
    axios
      .get(`${baseUrl}BodyParts`)
      .then(res => setBodyParts(res.data))
      .catch(handleError);
  const fetchExercises = () =>
    axios
      .get(`${baseUrl}exercises`)
      .then(res => setExercises(res.data))
      .catch(handleError);
  const fetchPlans = () =>
    axios
      .get(`${baseUrl}WorkoutPlan`)
      .then(res => setPlans(res.data))
      .catch(handleError);
  const fetchPlanExercises = () =>
    axios
      .get(`${baseUrl}WorkoutExercise`)
      .then(res => setPlanExercises(res.data))
      .catch(handleError);
  const fetchUsers = () =>
    axios
      .get(`${baseUrl}Users`)
      .then(res => setUsers(res.data))
      .catch(handleError);
  const fetchRoles = () =>
    axios
      .get(`${baseUrl}Roles`)
      .then(res => setRoles(res.data.roles))
      .catch(handleError);

  // Funkce pro vkládání
  const addExercise = () => axios.post(`${baseUrl}exercises`, newExercise).then(fetchExercises).catch(handleError);
  const addPlan = data => axios.post(`${baseUrl}WorkoutPlan`, data).then(fetchPlans).catch(handleError);
  const addBodyPart = () => axios.post(`${baseUrl}BodyParts`, newBodyPart).then(fetchBodyParts).catch(handleError);
  const addPlanExercise = () => axios.post(`${baseUrl}WorkoutExercise`, newPlanExercise).then(fetchPlanExercises).catch(handleError);
  const addUser = () =>
    axios
      .post(`${baseUrl}Users/Create`, newUser)
      .then(() => {
        fetchUsers();
        setNewUser({Name: '', Email: '', Password: ''});
      })
      .catch(handleError);
  const addRole = () =>
    axios
      .post(`${baseUrl}Roles/create`, newRole.RoleName, {headers: {'Content-Type': 'application/json'}})
      .then(() => {
        fetchRoles();
        setNewRole({RoleName: ''});
      })
      .catch(handleError);

  // Funkce pro aktualizaci
  const updateExercise = (id, data) => axios.put(`${baseUrl}exercises/${id}`, data).then(fetchExercises).catch(handleError);
  const updatePlan = (id, data) => axios.put(`${baseUrl}WorkoutPlan/${id}`, data).then(fetchPlans).catch(handleError);
  const updateBodyPart = (id, data) => axios.put(`${baseUrl}BodyParts/${id}`, data).then(fetchBodyParts).catch(handleError);
  const updatePlanExercise = (id, data) => axios.put(`${baseUrl}WorkoutExercise/${id}`, data).then(fetchPlanExercises).catch(handleError);
  const updateUser = (id, data) => axios.put(`${baseUrl}Users/${id}`, data).then(fetchUsers).catch(handleError);
  const updateRoleMembers = (roleId, roleName, addIds, deleteIds) =>
    axios
      .post(`${baseUrl}Roles`, {RoleId: roleId, RoleName: roleName, AddIds: addIds, DeleteIds: deleteIds})
      .then(() => {
        fetchRoles();
        fetchUsers();
      })
      .catch(handleError);

  // Funkce pro mazání
  const deleteExercise = id => axios.delete(`${baseUrl}exercises/${id}`).then(fetchExercises).catch(handleError);
  const deletePlan = id => axios.delete(`${baseUrl}WorkoutPlan/${id}`).then(fetchPlans).catch(handleError);
  const deleteBodyPart = id => axios.delete(`${baseUrl}BodyParts/${id}`).then(fetchBodyParts).catch(handleError);
  const deletePlanExercise = id => axios.delete(`${baseUrl}WorkoutExercise/${id}`).then(fetchPlanExercises).catch(handleError);
  const deleteUser = id => axios.delete(`${baseUrl}Users/${id}`).then(fetchUsers).catch(handleError);
  const deleteRole = id => axios.delete(`${baseUrl}Roles/${id}`).then(fetchRoles).catch(handleError);

  // Přihlášení a odhlášení
  const handleLogin = async user => {
    if (typeof user === 'object' && user !== null) {
      setUser(user.userName || user.username || user.Name || null);
      setRole((user.role || user.Role || '').toLowerCase());
      navigate('/');
    } else {
      await checkAuth();
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${baseUrl}Account/Logout`, {}, {withCredentials: true});
      setUser(null);
      setRole(null);
      setAuthChecked(false);
      navigate('/login');
    } catch (error) {
      handleError(error);
    }
  };

  // Počáteční kontrola autentizace
  useEffect(() => {
    if (!authChecked) checkAuth();
  }, []);

  // Načítání dat a navigace
  useEffect(() => {
    if (!authChecked) return;
    if (!user && window.location.pathname !== '/login') navigate('/login');
    else if (user && window.location.pathname === '/login') navigate('/');
    else if (user) {
      fetchBodyParts();
      fetchExercises();
      fetchPlans();
      fetchPlanExercises();
      fetchUsers();
      fetchRoles();
    }
  }, [user, authChecked, navigate]);

  // Uzavření welcome modalu
  const closeWelcomeModal = () => {
    setShowHelp(false);
    localStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  return (
    <div className="bg-light min-vh-100 py-4">
  <WelcomeModal isOpen={showHelp} onClose={closeWelcomeModal} />
  <header className="container my-4">
    <div className="p-3 bg-white rounded shadow text-center">
      <h1 className="h3 fw-bold text-success mb-2">
        💪 <span className="text-primary">HomeWorkout</span>
      </h1>
      <p className="small text-muted mb-3">Aplikace pro správu cviků a plánů.</p>
      <nav className="d-flex flex-wrap justify-content-center gap-2 p-2">
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-wrap justify-content-center align-items-center bg-light border rounded shadow-sm p-2 gap-2">
            {/* Sekce pro přihlášené uživatele */}
            {user && (
              <>
                <NavLink to="/" className={({isActive}) => `btn btn-sm shadow-sm ${isActive ? 'btn-primary' : 'btn-success'}`}>
                  🏠 Domů
                </NavLink>

                {role === 'admin' && (
                  <>
                    <NavLink
                      to="/edit"
                      className={({isActive}) => `btn btn-sm shadow-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      ✍️ Editace cviků
                    </NavLink>

                    <NavLink
                      to="/admin"
                      className={({isActive}) => `btn btn-sm shadow-sm ${isActive ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                      🛡️ Admin
                    </NavLink>
                  </>
                )}
              </>
            )}

            {/* Tlačítko Nápověda je viditelné pro všechny, v rámci panelu */}
            <button className="btn btn-outline-info btn-sm shadow-sm" onClick={() => setShowHelp(true)} title="Nápověda">
              ❓ Nápověda
            </button>
          </div>
        </div>
      </nav>
      
      {user && (
        <div className="d-flex justify-content-center mb-3 mt-3">
          <div className="d-flex align-items-center bg-secondary text-white shadow-sm rounded px-3 py-2">
            <i className="bi bi-person-circle me-2"></i>
            <span className="me-3">
              {user} ({role})
            </span>
            <button className="btn btn-sm btn-light text-danger border-0 px-2 py-1" onClick={handleLogout} title="Odhlásit se">
              🔓
            </button>
          </div>
        </div>
      )}
    </div>
  </header>


      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login baseUrl={baseUrl} onLoginSuccess={handleLogin} />} />
        <Route
          path="/"
          element={
            user ? (
              <section className="container mb-5">
                <h2 className="text-center mb-4">🔋 Uživatelská sekce</h2>
                <WorkoutPlan
                  handleUpdateWorkoutExercises={updatePlanExercise}
                  exercises={exercises}
                  workoutPlans={plans}
                  insertWorkoutPlan={addPlan}
                  newWorkoutPlan={newPlan}
                  setNewWorkoutPlan={setNewPlan}
                  handleUpdateWorkoutPlan={updatePlan}
                  handleDeleteWorkoutPlan={deletePlan}
                  setNewWorkoutExercises={setNewPlanExercise}
                  newWorkoutExercises={newPlanExercise}
                  workoutExercises={planExercises}
                  insertWorkoutExercises={addPlanExercise}
                  handleDeleteWorkoutExercises={deletePlanExercise}
                  bodyParts={bodyParts}
                />
              </section>
            ) : authChecked ? (
              <Navigate to="/login" />
            ) : null
          }
        />
        <Route
          path="/edit"
          element={
            user ? (
              role === 'admin' ? (
                <section className="container mb-5">
                  <h2 className="text-center mb-4">✍️ Editace cviků a partií</h2>
                  <ExerciseAdmin
                    newExercise={newExercise}
                    setNew={setNewExercise}
                    insertExercise={addExercise}
                    handleDelete={deleteExercise}
                    dataExercises={exercises}
                    handleUpdate={updateExercise}
                    dataParts={bodyParts}
                    newBodyPart={newBodyPart}
                    setNewBodyPart={setNewBodyPart}
                    insertExerciseBodyPart={addBodyPart}
                    handleDeleteBodyPart={deleteBodyPart}
                    handleUpdateBodyPart={updateBodyPart}
                  />
                  <BodyPartAdmin
                    dataParts={bodyParts}
                    newBodyPart={newBodyPart}
                    setNewBodyPart={setNewBodyPart}
                    insertExerciseBodyPart={addBodyPart}
                    handleDeleteBodyPart={deleteBodyPart}
                    handleUpdateBodyPart={updateBodyPart}
                  />
                </section>
              ) : (
                <Navigate to="/" />
              )
            ) : authChecked ? (
              <Navigate to="/login" />
            ) : null
          }
        />
        <Route
          path="/admin"
          element={
            role === 'admin' ? (
              <section className="container mb-5">
                <h2 className="text-center mb-4">🛡️ Administrace</h2>
                <UserAdmin
                  users={users}
                  newUser={newUser}
                  setNewUser={setNewUser}
                  insertUser={addUser}
                  deleteUser={deleteUser}
                  handleUpdateUser={updateUser}
                />
                <Roles
                  roles={roles}
                  newRole={newRole}
                  setNewRole={setNewRole}
                  insertRole={addRole}
                  deleteRole={deleteRole}
                  users={users}
                  handleUpdateRoleMembers={updateRoleMembers}
                  baseUrl={baseUrl}
                />
              </section>
            ) : user ? (
              <Navigate to="/" />
            ) : authChecked ? (
              <Navigate to="/login" />
            ) : null
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
