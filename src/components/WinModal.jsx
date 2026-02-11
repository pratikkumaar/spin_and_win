import React from 'react';

const WinModal = ({ prize, icon, onReset }) => {
    return (
        <div
            className="animate-fade-in"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(8, 51, 68, 0.85)', // Matches theme bg
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                className="animate-pop-in"
                style={{
                    textAlign: 'center',
                    maxWidth: '450px',
                    width: '90%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '0.5px solid #fbbf24', // Gold border
                    borderRadius: '2.5rem',
                    padding: '3rem',
                    boxShadow: '0 0 50px rgba(0,0,0,0.5), 0 0 20px rgba(251, 191, 36, 0.3)'
                }}
            >
                {icon && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <img
                            src={icon}
                            alt={prize}
                            style={{
                                width: '120px',
                                height: 'auto',
                                filter: 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.5))'
                            }}
                        />
                    </div>
                )}

                <h2 style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    color: '#fbbf24',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 900
                }}>
                    🎉 WINNER!
                </h2>

                <p style={{
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                    color: '#f0f9ff',
                    fontFamily: "'Playfair Display', serif"
                }}>
                    Congratulations, you won
                </p>

                <div style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    background: 'rgba(211, 135, 159, 0.3)', // Matching redLight hex color
                    padding: '1rem 1.5rem',
                    borderRadius: '1rem',
                    marginBottom: '2.5rem',
                    border: '1px solid #d3879f',
                    display: 'inline-block'
                }}>
                    {prize}
                </div>

                <div style={{ display: 'block' }}>
                    <button className="btn-primary" onClick={onReset}>
                        GO BACK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinModal;
