export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'PLACED':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'CONFIRMED':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'SHIPPED':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'RETURNED':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'PAID':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'FAILED':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'REFUNDED':
      return 'bg-teal-100 text-teal-800 border-teal-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};
