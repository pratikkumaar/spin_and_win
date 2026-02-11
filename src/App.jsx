import React, { useState } from 'react';
import Wheel from './components/Wheel';
import WinModal from './components/WinModal';
import logo from './assets/arnica_logo.png';
import valentineLogo from './assets/wheel_of_valentine.png';
import './components/Wheel.css'; // Ensure CSS is loaded

// Initial configuration logic to be used if no saved state exists
const INITIAL_SEGMENT_DATA = [
  { label: '5% off\nYoulry.com Voucher', weight: 5 },
  { label: 'Chocolate Boxes', weight: 13 },
  { label: 'Roses', weight: 3 },
  { label: 'Teddy Bear', weight: 8 },
  { label: 'Gold 22K Necklace', weight: 0 },
  { label: 'Gold Pendant', weight: 1 },
  { label: 'Dinner Date at\nLord of the Drinks', weight: 6 },
  { label: 'Couple Watch', weight: 4 }
];

function App() {
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Load weights from localStorage or use initial config
  const [currentWeights, setCurrentWeights] = useState(() => {
    try {
      const saved = localStorage.getItem('spin-win-weights');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load weights", e);
    }
    return INITIAL_SEGMENT_DATA.map(s => s.weight);
  });

  const totalAvailableSpins = currentWeights.reduce((a, b) => a + b, 0);

  const handleSpin = () => {
    if (isSpinning || totalAvailableSpins <= 0) return;

    // Reset state slightly
    setShowModal(false);
    setIsSpinning(true);

    // Weighted random selection based on currentWeights
    // We only select from indices where weight > 0
    // But since our "wheel" slices are fixed (labels don't change), we pick an index
    // and just ensure its weight > 0.

    let randomNum = Math.random() * totalAvailableSpins;
    let selectedIndex = -1;

    for (let i = 0; i < currentWeights.length; i++) {
      const weight = currentWeights[i];
      if (weight <= 0) continue; // Skip exhausted items

      if (randomNum < weight) {
        selectedIndex = i;
        break;
      }
      randomNum -= weight;
    }

    // Fallback if float precision issues or all weights 0 (though we checked total)
    if (selectedIndex === -1) {
      // Find first available
      selectedIndex = currentWeights.findIndex(w => w > 0);
    }

    if (selectedIndex === -1) {
      // Should not happen due to total check, but just in case
      setIsSpinning(false);
      return;
    }

    setWinnerIndex(selectedIndex);

    // Update weights immediately (or after spin? usually safer before to prevent double-click exploits)
    // But let's wait for actual "win" to finalize?
    // No, standard is to commit the result once determined.
    const newWeights = [...currentWeights];
    newWeights[selectedIndex] -= 1;
    setCurrentWeights(newWeights);
    localStorage.setItem('spin-win-weights', JSON.stringify(newWeights));
  };

  const onSpinComplete = () => {
    setIsSpinning(false);
    setTimeout(() => {
      setShowModal(true);
    }, 500);
  };

  const handleReset = () => {
    setShowModal(false);
  };

  const handleAdminReset = () => {
    if (adminPassword === 'arnika@reset') {
      const resetWeights = INITIAL_SEGMENT_DATA.map(s => s.weight);
      setCurrentWeights(resetWeights);
      localStorage.setItem('spin-win-weights', JSON.stringify(resetWeights));
      setShowAdminModal(false);
      setAdminPassword('');
      alert('Weights have been reset successfully!');
    } else {
      alert('Incorrect password!');
    }
  };

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {/* Admin Reset Button */}
      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
        <button
          onClick={() => setShowAdminModal(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.8rem',
            cursor: 'pointer',
            backdropFilter: 'blur(5px)'
          }}
        >
          ⚙️
        </button>
      </div>

      <header style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src={logo}
          alt="Arnika Logo"
          style={{ maxWidth: '280px', height: 'auto', marginBottom: '1.5rem' }}
        />
        <img
          src={valentineLogo}
          alt="Wheel of Valentine"
          style={{ maxWidth: '450px', width: '80%', height: 'auto' }}
        />
      </header>

      <main style={{ position: 'relative', zIndex: 10 }}>
        <div className="glass-panel" style={{ display: 'inline-block', padding: '3rem' }}>
          <Wheel
            segments={INITIAL_SEGMENT_DATA.map(s => s.label)}
            winnerIndex={winnerIndex}
            isSpinning={isSpinning}
            onSpinComplete={onSpinComplete}
          />

          <div style={{ marginTop: '3rem', minHeight: '60px' }}>
            {totalAvailableSpins > 0 ? (
              <button
                className="btn-primary"
                onClick={handleSpin}
                disabled={isSpinning}
                style={{ opacity: isSpinning ? 0.7 : 1, cursor: isSpinning ? 'not-allowed' : 'pointer' }}
              >
                {isSpinning ? 'Spinning...' : 'TAP TO SPIN'}
              </button>
            ) : (
              <div style={{
                padding: '1rem 2rem',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '9999px',
                color: '#fca5a5',
                fontWeight: 'bold'
              }}>
                No more spins available!
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <WinModal
          prize={INITIAL_SEGMENT_DATA[winnerIndex]?.label}
          onReset={handleReset}
        />
      )}

      {/* Admin Password Modal */}
      {showAdminModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-panel" style={{ width: '300px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Admin Login</h3>
            <input
              type="password"
              placeholder="Enter Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                marginBottom: '1rem',
                textAlign: 'center'
              }}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn-primary"
                onClick={handleAdminReset}
                style={{ flex: 1, fontSize: '1rem', padding: '0.8rem' }}
              >
                Login
              </button>
              <button
                onClick={() => { setShowAdminModal(false); setAdminPassword(''); }}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
