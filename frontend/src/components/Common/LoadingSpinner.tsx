export const LoadingSpinner = () => {
  return (
    <div className="flex justify-content-center align-items-center min-h-screen">
      <div className="loading-spinner text-center">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
        <p className="mt-2 text-color-secondary">Loading...</p>
      </div>
    </div>
  );
};