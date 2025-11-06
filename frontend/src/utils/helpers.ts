



export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'BUSY':
      return 'pi pi-calendar text-blue-500';
    case 'SWAPPABLE':
      return 'pi pi-refresh text-green-500';
    case 'SWAP_PENDING':
      return 'pi pi-clock text-orange-500';
    case 'PENDING':
      return 'pi pi-clock text-orange-500';
    case 'ACCEPTED':
      return 'pi pi-check text-green-500';
    case 'REJECTED':
      return 'pi pi-times text-red-500';
    default:
      return 'pi pi-info-circle text-gray-500';
  }
};