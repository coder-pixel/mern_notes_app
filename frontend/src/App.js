import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LandingPage from "./screens/LandingPage/LandingPage";
import MyNotes from "./screens/MyNotes/MyNotes";
import SingleNote from "./screens/SingleNote/SingleNote";
import CreateNote from "./screens/SingleNote/CreateNote";
import { useState } from "react";
import ProfileScreen from "./screens/ProfileScreen/ProfileScreen";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen/RegisterScreen";
import { Toaster } from "react-hot-toast";
import PublicRoute from "./routeComponents/PublicRoute";
import ProtectedRoute from "./routeComponents/ProtectedRoute";

function App() {
  const [search, setSearch] = useState("");

  return (
    <Router>
      <Header setSearch={(inp) => setSearch(inp)} />
      <Toaster position="bottom-right" reverseOrder={false} />

      <main className="App">
        <Switch>
          <PublicRoute
            exact
            path="/"
            component={LandingPage}
            redirectRoute={"/mynotes"}
          />
          <PublicRoute
            path="/login"
            component={LoginScreen}
            redirectRoute={"/mynotes"}
          />
          <PublicRoute
            path="/register"
            component={RegisterScreen}
            redirectRoute={"/mynotes"}
          />

          <ProtectedRoute
            path="/mynotes"
            component={({ history }) => (
              <MyNotes search={search} history={history} />
            )}
            redirectRoute={"/login"}
          />
          <ProtectedRoute
            path="/note/:id"
            component={SingleNote}
            redirectRoute={"/login"}
          />
          <ProtectedRoute
            path="/createnote"
            component={CreateNote}
            redirectRoute={"/login"}
          />
          <ProtectedRoute
            path="/profile"
            component={ProfileScreen}
            redirectRoute={"/login"}
          />

          <Route path="*" render={() => <Redirect to="/mynotes" />} />
        </Switch>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
