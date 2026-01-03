import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import introVideo from '../assets/Intro-gorboy-game.mp4';

export default function SplashScreen() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleVideoEnd = () => {
    navigate('/menu');
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    navigate('/menu');
  };

  return (
    <div style={styles.container} onClick={handleSkip}>
      <video
        ref={videoRef}
        src={introVideo}
        autoPlay
        playsInline
        onEnded={handleVideoEnd}
        style={styles.video}
      />
      <div style={styles.skipHint}>Click anywhere to skip</div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  video: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  skipHint: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    fontFamily: 'sans-serif',
  },
};
