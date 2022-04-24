const ToggleTheme = ({ theme, setTheme }) => {
    return (
        <>
            <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <i className="bi bi-sun"></i> : <i className="bi bi-moon"></i>}
            </button>
        </>
    );
};

export default ToggleTheme;