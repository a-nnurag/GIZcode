import 'maplibre-gl/dist/maplibre-gl.css';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { MapApp } from './components/MapApp/MapApp';
import { AboutPage } from './components/About/AboutPage';
import { ConsultationGallery } from './components/About/ConsultationGallery';

function App() {
  return (
    <div className="flex h-full flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<MapApp />} />
        <Route path="/about/consultation" element={<ConsultationGallery />} />
        <Route path="/about/:slug" element={<AboutPage />} />
      </Routes>
    </div>
  );
}

export default App;
