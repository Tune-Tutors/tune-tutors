import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom"; // Import useParams
import "./App.css";
import NewPage from "./NewPage";
import SearchPage from "./SearchPage"; // Import the SearchPage component
import { Outlet } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/new-page" element={<NewPage />} />
              <Route path="/search/:subject" element={<SearchPageWrapper />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

function Layout() {
  return (
    <ClerkProvider
      publishableKey={"pk_test_d2FudGVkLWxlbXVyLTM3LmNsZXJrLmFjY291bnRzLmRldiQ"}
    >
      <SignedIn>
        <UserButton />
        <Outlet />
      </SignedIn>
      <SignedOut>
        <div className="layout-container">
          <div className="clerkool">
            <SignIn />
          </div>
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}

const SearchPageWrapper = () => {
  const { subject } = useParams();
  return <SearchPage subject={subject} />;
};

const Home = () => (
  <>
    <Navbar />
    <Hero />
    <Features />
    <Footer />
  </>
);

const Navbar = () => (
  <nav className="navbar">
    <div className="logo">TuneTutor</div>
    <ul className="nav-links">
      <li>
        <a href="#future">Futures</a>
      </li>
      <li>
        <a href="#about">About Us</a>
      </li>
      <li>
        <a href="#contact">Contact</a>
      </li>
    </ul>
  </nav>
);

const Hero = () => (
  <section className="hero">
    <h1>Changing Education's Status Quo Through Music</h1>
    <p>
      Meet TuneTutor, the intelligent music guru and teacher that helps you
      create songs based on any topic.
    </p>
    <a href="/new-page" className="navigate-btn">
      Dive in
    </a>
  </section>
);

const Features = () => (
  <section id="features" className="features">
    <h2>Why Us?</h2>
    <div className="feature-list">
      <div className="feature-item">
        <h3>Unique Learning</h3>
        <p>AI-driven music for you to master your subject of choice.</p>
      </div>
      <div className="feature-item">
        <h3>Auditory Emphasis</h3>
        <p>
          Providing new solutions for the visually impaired or auditory
          learners.
        </p>
      </div>
      <div className="feature-item">
        <h3>Interactive Exercises</h3>
        <p>
          Engaging exercises to test your knowledge and build your skillset.
        </p>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <p>&copy; 2024 TuneTutor | Empowering education through AI</p>
    <ul className="footer-links">
      <li>
        <a href="#terms">Terms of Service</a>
      </li>
      <li>
        <a href="#privacy">Privacy Policy</a>
      </li>
    </ul>
  </footer>
);

const Math = () => <div>Math Content</div>;
const English = () => <div>English Content</div>;
const History = () => <div>History Content</div>;
const Science = () => <div>Science Content</div>;

export default App;
