'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  Stack,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '@/config/api';

// Tipos
interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded' | 'shipped' | 'delivered' | 'completed';
  paymentMethod: string;
  customer: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
}

interface OrdersResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  
  // Função para buscar pedidos
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Construir query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      
      if (search) {
        params.append('search', search);
      }
      
      if (status) {
        params.append('status', status);
      }
      
      // Temporariamente usando um ID de tenant fixo para teste
      // Isso deve ser substituído pelo ID do tenant do usuário logado
      const tenantId = '123e4567-e89b-12d3-a456-426614174000';
      params.append('tenantId', tenantId);
      
      const response = await api.getOrders(params.toString());
      setOrders(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError('Não foi possível carregar os pedidos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar pedidos quando a página, busca ou status mudar
  useEffect(() => {
    fetchOrders();
  }, [page, status]);
  
  // Função para lidar com a busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Resetar para a primeira página
    fetchOrders();
  };
  
  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Função para renderizar o chip de status
  const renderStatusChip = (status: string) => {
    let color: 'success' | 'warning' | 'error' | 'default' | 'info' | 'primary' | 'secondary' = 'default';
    let label = status;
    
    switch (status) {
      case 'pending':
        color = 'warning';
        label = 'Pendente';
        break;
      case 'paid':
        color = 'info';
        label = 'Pago';
        break;
      case 'shipped':
        color = 'primary';
        label = 'Enviado';
        break;
      case 'delivered':
        color = 'secondary';
        label = 'Entregue';
        break;
      case 'completed':
        color = 'success';
        label = 'Concluído';
        break;
      case 'cancelled':
        color = 'error';
        label = 'Cancelado';
        break;
      case 'refunded':
        color = 'error';
        label = 'Reembolsado';
        break;
    }
    
    return <Chip label={label} color={color} size="small" />;
  };
  
  // Função para renderizar o método de pagamento
  const formatPaymentMethod = (method: string | null) => {
    if (!method) return 'N/A';
    
    const methods: Record<string, string> = {
      'credit_card': 'Cartão de Crédito',
      'debit_card': 'Cartão de Débito',
      'boleto': 'Boleto',
      'pix': 'PIX',
      'bank_transfer': 'Transferência Bancária',
      'wallet': 'Carteira Digital',
    };
    
    return methods[method] || method;
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Pedidos
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <form onSubmit={handleSearch}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Buscar por número do pedido"
              variant="outlined"
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e: SelectChangeEvent) => setStatus(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="paid">Pago</MenuItem>
                <MenuItem value="shipped">Enviado</MenuItem>
                <MenuItem value="delivered">Entregue</MenuItem>
                <MenuItem value="completed">Concluído</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
                <MenuItem value="refunded">Reembolsado</MenuItem>
              </Select>
            </FormControl>
            <Button 
              type="submit"
              variant="contained" 
              startIcon={<SearchIcon />}
            >
              Buscar
            </Button>
          </Stack>
        </form>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número do Pedido</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pagamento</TableCell>
              <TableCell>Data</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Carregando...</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Nenhum pedido encontrado</TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customer ? order.customer.name : 'Cliente não registrado'}</TableCell>
                  <TableCell>{formatPrice(order.total)}</TableCell>
                  <TableCell>{renderStatusChip(order.status)}</TableCell>
                  <TableCell>{formatPaymentMethod(order.paymentMethod)}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={(_, value) => setPage(value)} 
          color="primary" 
        />
      </Box>
    </Container>
  );
} 