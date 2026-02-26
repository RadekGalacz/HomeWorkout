/**
 * App – Hlavní komponenta aplikace. Obsahuje navbar, routing a správu dat.
 * Načítá všechna data po přihlášení a předává je child komponentám.
 */
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { bodyPartApi, exerciseApi, planApi, planExerciseApi, userApi, roleApi } from './api';
import ProtectedRoute from './Components/ProtectedRoute';
import ExerciseAdmin from './Components/Exercise/ExerciseAdmin';
import BodyPartAdmin from './Components/BodyPart/BodyPartAdmin';
import WorkoutPlan from './Components/Plan/WorkoutPlan';
import WelcomeModal from './Components/WelcomeModal/WelcomeModal';
import UserAdmin from './Components/User/UserAdmin';
import Roles from './Components/Roles/Roles';
import Login from './Components/Auth/Login';

function AppContent() {
  const { user, role, authChecked, handleLogout } = useAuth();

  const [bodyParts, setBodyParts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [plans, setPlans] = useState([]);
  const [planExercises, setPlanExercises] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showHelp, setShowHelp] = useState(() => localStorage.getItem('hasSeenWelcomeModal') !== 'true');

  const fetchAll = useCallback(async () => {
    const [bp, ex, pl, pe, us, ro] = await Promise.all([
      bodyPartApi.getAll(), exerciseApi.getAll(), planApi.getAll(),
      planExerciseApi.getAll(), userApi.getAll(), roleApi.getAll(),
    ]);
    if (Array.isArray(bp)) setBodyParts(bp);
    if (Array.isArray(ex)) setExercises(ex);
    if (Array.isArray(pl)) setPlans(pl);
    if (Array.isArray(pe)) setPlanExercises(pe);
    if (Array.isArray(us)) setUsers(us);
    if (Array.isArray(ro)) setRoles(ro);
  }, []);

  const refetchBodyParts = useCallback(() => bodyPartApi.getAll().then(d => Array.isArray(d) && setBodyParts(d)), []);
  const refetchExercises = useCallback(() => exerciseApi.getAll().then(d => Array.isArray(d) && setExercises(d)), []);
  const refetchPlans = useCallback(() => planApi.getAll().then(d => Array.isArray(d) && setPlans(d)), []);
  const refetchPlanExercises = useCallback(() => planExerciseApi.getAll().then(d => Array.isArray(d) && setPlanExercises(d)), []);
  const refetchUsers = useCallback(() => userApi.getAll().then(d => Array.isArray(d) && setUsers(d)), []);
  const refetchRoles = useCallback(() => roleApi.getAll().then(d => Array.isArray(d) && setRoles(d)), []);

  useEffect(() => {
    if (authChecked && user) fetchAll();
  }, [user, authChecked, fetchAll]);

  const closeWelcomeModal = () => {
    setShowHelp(false);
    localStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link hw-nav-link px-3 py-2 ${isActive ? 'active-link' : 'text-dark'}`;

  // Zavřít hamburger při kliknutí mimo
  const navRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = async (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        const collapseEl = navRef.current.querySelector('.navbar-collapse.show');
        if (collapseEl) {
          const { Collapse } = await import('bootstrap');
          const instance = Collapse.getInstance(collapseEl);
          if (instance) instance.hide();
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleToggle = async () => {
    const collapseEl = navRef.current?.querySelector('#mainNav');
    if (collapseEl) {
      const { Collapse } = await import('bootstrap');
      const instance = Collapse.getInstance(collapseEl) || new Collapse(collapseEl, { toggle: false });
      instance.toggle();
    }
  };

  return (
    <div className="min-vh-100">
      <WelcomeModal isOpen={showHelp} onClose={closeWelcomeModal} />

      {/* Navbar */}
      <nav ref={navRef} className="navbar navbar-expand-md hw-navbar shadow-sm sticky-top">
        <div className="container">
          <Link to="/" className="navbar-brand mb-0 fs-5 text-decoration-none">
            💪 HomeWorkout
          </Link>

          {user && (
            <button className="navbar-toggler border-0" type="button" onClick={handleToggle}>
              <span className="navbar-toggler-icon"></span>
            </button>
          )}

          <div className="collapse navbar-collapse" id="mainNav">
            {user && (
              <ul className="navbar-nav me-auto mb-2 mb-md-0 gap-1">

                {role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/edit" className={navLinkClass}>✍️ Cviky</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/admin" className={navLinkClass}>🛡️ Admin</NavLink>
                    </li>
                  </>
                )}
              </ul>
            )}

            <div className="d-flex flex-wrap justify-content-center justify-content-md-end align-items-center gap-2 mt-2 mt-md-0">
              <button className="hw-btn" onClick={() => setShowHelp(true)}>
                ❓ Nápověda
              </button>
              {user && (
                <div className="d-flex align-items-center gap-2 border-start ps-2">
                  <span className="hw-badge">
                    {user} ({role})
                  </span>
                  <button className="hw-btn hw-btn-danger" onClick={handleLogout}>
                    Odhlásit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container py-4">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <WorkoutPlan
                exercises={exercises} workoutPlans={plans} workoutExercises={planExercises} bodyParts={bodyParts}
                onPlanCreate={(data) => planApi.create(data).then(refetchPlans)}
                onPlanUpdate={(id, data) => planApi.update(id, data).then(refetchPlans)}
                onPlanDelete={(id) => planApi.delete(id).then(refetchPlans)}
                onExerciseCreate={(data) => planExerciseApi.create(data).then(refetchPlanExercises)}
                onExerciseUpdate={(id, data) => planExerciseApi.update(id, data).then(refetchPlanExercises)}
                onExerciseDelete={(id) => planExerciseApi.delete(id).then(refetchPlanExercises)}
              />
            </ProtectedRoute>
          } />

          <Route path="/edit" element={
            <ProtectedRoute requireAdmin>
              <ExerciseAdmin
                dataExercises={exercises} dataParts={bodyParts}
                onAdd={(data) => exerciseApi.create(data).then(refetchExercises)}
                onUpdate={(id, data) => exerciseApi.update(id, data).then(refetchExercises)}
                onDelete={(id) => exerciseApi.delete(id).then(refetchExercises)}
              />
              <BodyPartAdmin
                dataParts={bodyParts}
                onAdd={(data) => bodyPartApi.create(data).then(refetchBodyParts)}
                onUpdate={(id, data) => bodyPartApi.update(id, data).then(refetchBodyParts)}
                onDelete={(id) => bodyPartApi.delete(id).then(refetchBodyParts)}
              />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <UserAdmin
                users={users}
                onAdd={(data) => userApi.create(data).then(refetchUsers)}
                onUpdate={(id, data) => userApi.update(id, data).then(refetchUsers)}
                onDelete={(id) => userApi.delete(id).then(refetchUsers)}
              />
              <Roles
                roles={roles} users={users}
                onAdd={(roleName) => roleApi.create(roleName).then(refetchRoles)}
                onUpdate={(data) => roleApi.update(data).then(() => { refetchRoles(); refetchUsers(); })}
                onDelete={(id) => roleApi.delete(id).then(refetchRoles)}
              />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
