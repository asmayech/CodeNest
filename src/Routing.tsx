import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ListExercisePage from "./pages/ListExercices";
import ExercisePage from "./pages/ExercisePage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import NewExercisePage from "./pages-admin/CreateExercicePage";
import EditExercisePage from "./pages-admin/EditExercisePage";
import Profile from "./pages/Profile";
import ListUsers from "./pages-admin/ListUsers";
import ExerciseForumPage from "./pages/ExerciseForumPage";
import ListCategory from "./pages-admin/ListCategory";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ListExercisePage" element={<ListExercisePage />} />
      <Route path="/ExercisePage/:id" element={<ExercisePage />} />
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/ContactUs" element={<ContactUs />} />
      <Route path="/Profile/:id" element={<Profile />} />
      <Route path="/ExerciseForumPage/:id" element={<ExerciseForumPage />} />

      {/* Admin Routes */}
      <Route path="/NewExercisePage" element={<NewExercisePage />} />
      <Route path="/EditExercisePage/:id" element={<EditExercisePage />} />
      <Route path="/ListUsers" element={<ListUsers />} />
      <Route path="/Category" element={<ListCategory />} />

    </Routes>
  );
}

export default App;
