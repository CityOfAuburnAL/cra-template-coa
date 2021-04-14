import Info from '@material-ui/icons/Info';

function InfoBox(props) {
    const { children, style, ...other } = props;
    const defaultStyle = {
        border: '1px solid purple',
        borderWidth: '1px 1px 1px 5px',
        padding: '0.5rem',
        margin: '1.5rem 0 1rem 0',
        textAlign: 'left'
    };
  return (
    <div style={{...defaultStyle, ...style }}
      {...other}
    >
        <Info style={{color: 'purple', float: 'left' }} />
        <p style={{margin: 0, paddingLeft: '2rem'}}>{children}</p>
    </div>
  );
}

export { InfoBox };