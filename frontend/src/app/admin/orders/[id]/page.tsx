'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '@/config/api';

// Tipos
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface Address {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface StatusHistoryItem {
  status: string;
  date: string;
  comment?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  tenantId: string;
  customerId?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod?: string;
  paymentTransactionId?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  items: OrderItem[];
  trackingCode?: string;
  notes?: string;
  statusHistory: StatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estado para o diálogo de atualização de status
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  
  // Estado para o diálogo de cancelamento
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  
  // Buscar dados do pedido
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getOrderById(orderId);
        setOrder(data);
      } catch (err: any) {
        console.error('Erro ao buscar pedido:', err);
        setError('Não foi possível carregar os dados do pedido. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Função para formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
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
    
    return <Chip label={label} color={color} />;
  };
  
  // Função para renderizar o método de pagamento
  const formatPaymentMethod = (method: string | undefined) => {
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
  
  // Função para abrir o diálogo de atualização de status
  const handleOpenStatusDialog = () => {
    if (order) {
      setNewStatus(order.status);
      setOpenStatusDialog(true);
    }
  };
  
  // Função para fechar o diálogo de atualização de status
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setStatusComment('');
  };
  
  // Função para atualizar o status do pedido
  const handleUpdateStatus = async () => {
    if (!order || !newStatus) return;
    
    setUpdatingStatus(true);
    
    try {
      await api.updateOrderStatus(orderId, newStatus, statusComment);
      
      // Atualizar o pedido com o novo status
      const updatedOrder = await api.getOrderById(orderId);
      setOrder(updatedOrder);
      
      setSuccess('Status do pedido atualizado com sucesso!');
      handleCloseStatusDialog();
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      setError(err.response?.data?.message || 'Não foi possível atualizar o status do pedido. Tente novamente mais tarde.');
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  // Função para abrir o diálogo de cancelamento
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };
  
  // Função para fechar o diálogo de cancelamento
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };
  
  // Função para cancelar o pedido
  const handleCancelOrder = async () => {
    setCancelling(true);
    
    try {
      await api.cancelOrder(orderId);
      
      // Atualizar o pedido com o novo status
      const updatedOrder = await api.getOrderById(orderId);
      setOrder(updatedOrder);
      
      setSuccess('Pedido cancelado com sucesso!');
      handleCloseCancelDialog();
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Erro ao cancelar pedido:', err);
      setError(err.response?.data?.message || 'Não foi possível cancelar o pedido. Tente novamente mais tarde.');
    } finally {
      setCancelling(false);
    }
  };
  
  // Opções de status disponíveis para transição
  const getAvailableStatusOptions = () => {
    if (!order) return [];
    
    const statusTransitions: Record<string, string[]> = {
      'pending': ['paid', 'cancelled'],
      'paid': ['shipped', 'refunded', 'cancelled'],
      'shipped': ['delivered', 'refunded'],
      'delivered': ['completed', 'refunded'],
      'completed': ['refunded'],
      'cancelled': [],
      'refunded': [],
    };
    
    return statusTransitions[order.status] || [];
  };
  
  // Tradução dos status para exibição
  const statusTranslations: Record<string, string> = {
    'pending': 'Pendente',
    'paid': 'Pago',
    'shipped': 'Enviado',
    'delivered': 'Entregue',
    'completed': 'Concluído',
    'cancelled': 'Cancelado',
    'refunded': 'Reembolsado',
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Pedido não encontrado ou erro ao carregar os dados.
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin/orders')}
          >
            Voltar para Pedidos
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/orders')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Pedido #{order.orderNumber}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {/* Cabeçalho do Pedido */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Box sx={{ mt: 1 }}>
              {renderStatusChip(order.status)}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Data do Pedido
            </Typography>
            <Typography variant="body1">
              {formatDate(order.createdAt)}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Cliente
            </Typography>
            <Typography variant="body1">
              {order.customer ? order.customer.name : 'Cliente não registrado'}
            </Typography>
            {order.customer && (
              <Typography variant="body2">
                {order.customer.email}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Método de Pagamento
            </Typography>
            <Typography variant="body1">
              {formatPaymentMethod(order.paymentMethod)}
            </Typography>
            {order.paymentTransactionId && (
              <Typography variant="body2">
                ID da Transação: {order.paymentTransactionId}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleOpenStatusDialog}
                disabled={getAvailableStatusOptions().length === 0}
              >
                Atualizar Status
              </Button>
              
              {(order.status === 'pending' || order.status === 'paid') && (
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={handleOpenCancelDialog}
                >
                  Cancelar Pedido
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Detalhes do Pedido */}
      <Grid container spacing={3}>
        {/* Itens do Pedido */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Itens do Pedido
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Preço</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.imageUrl && (
                            <Box 
                              component="img" 
                              src={item.imageUrl} 
                              alt={item.name}
                              sx={{ width: 50, height: 50, objectFit: 'cover', mr: 2 }}
                            />
                          )}
                          <Typography variant="body1">
                            {item.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatPrice(item.price)}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatPrice(item.price * item.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 3, borderTop: '1px solid #eee', pt: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    Subtotal:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    {formatPrice(order.subtotal)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    Frete:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" align="right">
                    {formatPrice(order.shipping)}
                  </Typography>
                </Grid>
                
                {order.discount > 0 && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right">
                        Desconto:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" align="right" color="error">
                        -{formatPrice(order.discount)}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    Total:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" align="right">
                    {formatPrice(order.total)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          
          {/* Histórico de Status */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Histórico de Status
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell>Comentário</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.statusHistory && order.statusHistory.length > 0 ? (
                    order.statusHistory.map((history, index) => (
                      <TableRow key={index}>
                        <TableCell>{renderStatusChip(history.status)}</TableCell>
                        <TableCell>{formatDate(history.date)}</TableCell>
                        <TableCell>{history.comment || '-'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Nenhum histórico de status disponível
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Endereços */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Endereço de Entrega
            </Typography>
            <Typography variant="body1">
              {order.shippingAddress.fullName}
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress.address}
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
            </Typography>
            <Typography variant="body2">
              {order.shippingAddress.country}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Telefone: {order.shippingAddress.phone}
            </Typography>
          </Paper>
          
          {order.billingAddress && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Endereço de Cobrança
              </Typography>
              <Typography variant="body1">
                {order.billingAddress.fullName}
              </Typography>
              <Typography variant="body2">
                {order.billingAddress.address}
              </Typography>
              <Typography variant="body2">
                {order.billingAddress.city}, {order.billingAddress.state} - {order.billingAddress.zipCode}
              </Typography>
              <Typography variant="body2">
                {order.billingAddress.country}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Telefone: {order.billingAddress.phone}
              </Typography>
            </Paper>
          )}
          
          {order.notes && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Observações
              </Typography>
              <Typography variant="body2">
                {order.notes}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Diálogo de Atualização de Status */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
        <DialogTitle>Atualizar Status do Pedido</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Selecione o novo status para este pedido.
          </DialogContentText>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Novo Status</InputLabel>
            <Select
              value={newStatus}
              label="Novo Status"
              onChange={(e: SelectChangeEvent) => setNewStatus(e.target.value)}
            >
              <MenuItem value={order.status}>
                {statusTranslations[order.status] || order.status} (atual)
              </MenuItem>
              {getAvailableStatusOptions().map((status) => (
                <MenuItem key={status} value={status}>
                  {statusTranslations[status] || status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Comentário (opcional)"
            fullWidth
            multiline
            rows={3}
            value={statusComment}
            onChange={(e) => setStatusComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancelar</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained"
            disabled={updatingStatus || newStatus === order.status}
          >
            {updatingStatus ? 'Atualizando...' : 'Atualizar Status'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de Cancelamento */}
      <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
        <DialogTitle>Cancelar Pedido</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog}>Não, Manter Pedido</Button>
          <Button 
            onClick={handleCancelOrder} 
            variant="contained" 
            color="error"
            disabled={cancelling}
          >
            {cancelling ? 'Cancelando...' : 'Sim, Cancelar Pedido'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 