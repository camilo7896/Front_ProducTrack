module.exports = {
  apps: [
    {
      name: "vite-app",
      script: "npm",
      args: "start", // Cambia esto si tu comando `start` es diferente
      env: {
        NODE_ENV: "production",
        PORT: 3001 // Ajusta el puerto si es necesario
      }
    }
  ]
};
