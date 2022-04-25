const ToggleTheme = ({ theme, setTheme }) => {
    return (
        <>
            <button className="icon-button center" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <i className="bi bi-sun"/> : <i className="bi bi-moon-stars"/>}
            </button>
        </>
    );
};

export default ToggleTheme;