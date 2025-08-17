import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [contador, setContador] = useState(0);
  const [historial, setHistorial] = useState([]);

  // Implementación de alertas compatible
  const showAlert = (config) => {
    return new Promise((resolve) => {
      if (config.showCancelButton) {
        const result = window.confirm(
          `${config.title}\n${config.text || ''}`
        );
        resolve({ isConfirmed: result });
      } else {
        const icons = {
          success: '✅',
          warning: '⚠️',
          error: '❌',
          info: 'ℹ️',
          question: '❓'
        };
        const icon = icons[config.icon] || '';
        alert(`${icon} ${config.title}\n${config.text || ''}`);
        resolve({ isConfirmed: true });
      }
    });
  };

  // Validación para valores extremos
  const validarLimites = (nuevoValor) => {
    const LIMITE_MAXIMO = 999999;
    const LIMITE_MINIMO = -999999;
    
    if (nuevoValor > LIMITE_MAXIMO) {
      showAlert({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: `El contador no puede exceder ${LIMITE_MAXIMO.toLocaleString()}`
      });
      return false;
    }
    
    if (nuevoValor < LIMITE_MINIMO) {
      showAlert({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: `El contador no puede ser menor a ${LIMITE_MINIMO.toLocaleString()}`
      });
      return false;
    }
    
    return true;
  };

  // Función para incrementar
  const incrementar = () => {
    const nuevoValor = contador + 1;
    
    if (validarLimites(nuevoValor)) {
      setContador(nuevoValor);
      setHistorial(prev => [...prev, { 
        accion: 'Incremento', 
        valor: nuevoValor, 
        timestamp: new Date() 
      }]);
      
      // Alerta cada 10 incrementos
      if (nuevoValor % 10 === 0 && nuevoValor > 0) {
        showAlert({
          icon: 'success',
          title: '¡Milestone alcanzado!',
          text: `Has llegado a ${nuevoValor} conteos`
        });
      }
    }
  };

  // Función para decrementar
  const decrementar = () => {
    const nuevoValor = contador - 1;
    
    if (validarLimites(nuevoValor)) {
      setContador(nuevoValor);
      setHistorial(prev => [...prev, { 
        accion: 'Decremento', 
        valor: nuevoValor, 
        timestamp: new Date() 
      }]);
      
      // Validación para valores negativos
      if (nuevoValor < 0) {
        showAlert({
          icon: 'info',
          title: 'Valor negativo',
          text: 'El contador ahora tiene un valor negativo'
        });
      }
    }
  };

  // Función para reiniciar con confirmación
  const reiniciar = async () => {
    if (contador === 0) {
      showAlert({
        icon: 'info',
        title: 'Ya está en cero',
        text: 'El contador ya está reiniciado'
      });
      return;
    }

    const result = await showAlert({
      title: '¿Reiniciar contador?',
      text: `Se perderá el valor actual: ${contador}`,
      icon: 'question',
      showCancelButton: true
    });

    if (result.isConfirmed) {
      setContador(0);
      setHistorial(prev => [...prev, { 
        accion: 'Reinicio', 
        valor: 0, 
        timestamp: new Date() 
      }]);
      
      showAlert({
        icon: 'success',
        title: '¡Reiniciado!',
        text: 'El contador ha sido restablecido a cero'
      });
    }
  };

  // Función para limpiar historial
  const limpiarHistorial = async () => {
    if (historial.length === 0) {
      showAlert({
        icon: 'info',
        title: 'Sin historial',
        text: 'No hay acciones en el historial para limpiar'
      });
      return;
    }

    const result = await showAlert({
      title: '¿Limpiar historial?',
      text: `Se eliminarán ${historial.length} registros`,
      icon: 'warning',
      showCancelButton: true
    });

    if (result.isConfirmed) {
      setHistorial([]);
      showAlert({
        icon: 'success',
        title: '¡Limpiado!',
        text: 'El historial ha sido eliminado'
      });
    }
  };

  return (
    <div className="contador-app">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="icon-container">
            <span className="main-icon">🧮</span>
          </div>
          <h1 className="title">Contador Digital</h1>
          <p className="subtitle">
            Herramienta de conteo para <strong>Daniel</strong> - Analista de Datos
          </p>
        </div>

        {/* Tarjeta Principal del Contador */}
        <div className="main-card">
          <div className="card-header">
            <h3>📊 Panel de Conteo</h3>
          </div>
          <div className="card-body">
            {/* Display del Contador */}
            <div className="counter-display">
              <div className="counter-number">
                {contador.toLocaleString()}
              </div>
              <div className="counter-label">
                <small>Eventos registrados</small>
              </div>
            </div>

            {/* Botones de Control */}
            <div className="button-grid">
              <button 
                className="btn btn-success"
                onClick={incrementar}
                title="Incrementar en 1"
              >
                <span>➕</span>
                Incrementar
              </button>
              <button 
                className="btn btn-warning"
                onClick={decrementar}
                title="Decrementar en 1"
              >
                <span>➖</span>
                Decrementar
              </button>
              <button 
                className="btn btn-danger"
                onClick={reiniciar}
                title="Reiniciar a cero"
              >
                <span>🔄</span>
                Reiniciar
              </button>
            </div>

            {/* Información adicional */}
            <div className="info-panel">
              <div className="info-item">
                <strong>Estado:</strong> 
                <span className={`badge ${
                  contador === 0 ? 'badge-neutral' : 
                  contador > 0 ? 'badge-positive' : 'badge-negative'
                }`}>
                  {contador === 0 ? 'Inicial' : contador > 0 ? 'Positivo' : 'Negativo'}
                </span>
              </div>
              <div className="info-item">
                <strong>Acciones:</strong> 
                <span className="badge badge-info">
                  {historial.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Historial */}
        <div className="history-card">
          <div className="card-header">
            <h5>📝 Historial de Acciones</h5>
            <button 
              className="btn btn-small btn-danger"
              onClick={limpiarHistorial}
              disabled={historial.length === 0}
              title="Limpiar historial"
            >
              🗑️ Limpiar
            </button>
          </div>
          <div className="history-body">
            {historial.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📥</div>
                <p>No hay acciones registradas aún</p>
                <small>Las acciones aparecerán aquí cuando uses los botones</small>
              </div>
            ) : (
              <div className="history-list">
                {historial.slice(-10).reverse().map((item, index) => (
                  <div key={historial.length - index} className="history-item">
                    <div className="history-content">
                      <span className={`history-badge ${
                        item.accion === 'Incremento' ? 'badge-positive' :
                        item.accion === 'Decremento' ? 'badge-warning' : 'badge-negative'
                      }`}>
                        {item.accion === 'Incremento' ? '➕' :
                         item.accion === 'Decremento' ? '➖' : '🔄'} {item.accion}
                      </span>
                      <strong>Valor: {item.valor.toLocaleString()}</strong>
                    </div>
                    <small className="history-time">
                      🕐 {item.timestamp.toLocaleTimeString()}
                    </small>
                  </div>
                ))}
                {historial.length > 10 && (
                  <div className="history-footer">
                    <small>
                      ℹ️ Mostrando las últimas 10 acciones de <strong>{historial.length}</strong> totales
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <small>
            👨‍💼 Diseñado para análisis de datos profesional
          </small>
        </div>
      </div>
    </div>
  );
};

export default App;