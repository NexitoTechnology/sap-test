// App.jsx
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('APP_COMPRAS');
  const [password, setPassword] = useState('f*K5%Hh%lD@73f4Qbmf46A&wQ');
  const [url, setUrl] = useState('https://vhtdsds4ci.hec.tmgrupoinmobiliario.com:44300/sap/bc/rest/zws_app_mm/liberar?sap-client=100');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState(null);
  const [useMiddleware, setUseMiddleware] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const credentials = btoa(`${username}:${password}`);
      // Si está marcado el checkbox, usa la ruta relativa para el proxy (función serverless en Vercel)
      // Si no, usa la URL directa al servicio SAP.
      const requestUrl = useMiddleware
        ? '/sap/bc/rest/zws_app_mm/liberar?sap-client=100'
        : url;

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': 'Fetch',
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Extraer token CSRF si se envía en la respuesta
      const csrfTokenFromHeader = response.headers.get('x-csrf-token');
      setCsrfToken(csrfTokenFromHeader || null);

      const text = await response.text();
      try {
        const jsonData = JSON.parse(text);
        setData(JSON.stringify(jsonData, null, 2));
      } catch {
        setData(text);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4">Prueba de Conexión SAP API</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL del servicio</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://vhtdsds4ci.hec.tmgrupoinmobiliario.com:44300/sap/bc/rest/zws_app_mm/liberar?sap-client=100"
              className="w-full p-2 border rounded"
              disabled={useMiddleware} // Si se usa middleware, la URL se fija
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="middlewareCheck"
              checked={useMiddleware}
              onChange={(e) => setUseMiddleware(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="middlewareCheck">Usar middleware</label>
          </div>

          <button 
            onClick={fetchData}
            disabled={loading || !url || !username || !password}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300 hover:bg-blue-600"
          >
            {loading ? 'Cargando...' : 'Enviar Petición'}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
              Error: {error}
            </div>
          )}

          {csrfToken && (
            <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
              Token CSRF: {csrfToken}
            </div>
          )}

          {data && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Respuesta del servidor:</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                {data}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
