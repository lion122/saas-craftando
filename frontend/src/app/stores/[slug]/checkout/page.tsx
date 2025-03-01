'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Grid, 
  TextField, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio, 
  Divider, 
  Card, 
  CardContent, 
  CardMedia, 
  IconButton, 
  CircularProgress, 
  Alert,
  Snackbar,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { api } from '@/config/api';

// Função para validar CPF/CNPJ
const validateDocument = (document: string): boolean => {
  if (!document) return false;
  
  // Remover caracteres não numéricos
  const cleanDoc = document.replace(/\D/g, '');
  
  // Validar CPF
  if (cleanDoc.length === 11) {
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanDoc)) return false;
    
    // Algoritmo de validação de CPF
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanDoc.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanDoc.substring(9, 10))) return false;
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanDoc.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanDoc.substring(10, 11))) return false;
    
    return true;
  }
  
  // Validar CNPJ
  else if (cleanDoc.length === 14) {
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cleanDoc)) return false;
    
    // Algoritmo de validação de CNPJ
    let size = cleanDoc.length - 2;
    let numbers = cleanDoc.substring(0, size);
    const digits = cleanDoc.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;
    
    size += 1;
    numbers = cleanDoc.substring(0, size);
    sum = 0;
    pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  }
  
  return false;
};

// Tipos para o formulário de checkout
interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  document: string;
  documentType: 'cpf' | 'cnpj';
  notes?: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BOLETO = 'boleto',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
}

interface PaymentInfo {
  method: PaymentMethod;
  // Campos específicos para cada método seriam adicionados aqui
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  imageUrl?: string;
  stock?: number;
  trackStock?: boolean;
}

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
}

type CheckoutStep = 'cart' | 'address' | 'payment' | 'confirmation';

// Componente principal de checkout
export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Estados para gerenciar o processo de checkout
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Store | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Estados para formulários
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    document: '',
    documentType: 'cpf',
  });
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    phone: '',
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: PaymentMethod.PIX,
  });
  
  const [shippingMethod, setShippingMethod] = useState<string>('standard');
  const [shippingCost, setShippingCost] = useState<number>(15);
  const [processingOrder, setProcessingOrder] = useState(false);

  // Passos do checkout
  const steps = ['Carrinho', 'Endereço de Entrega', 'Pagamento', 'Confirmação'];
  
  // Carregar dados da loja e do carrinho
  useEffect(() => {
    const fetchData = async () => {
    try {
      setLoading(true);
      
        // Buscar dados da loja
        const storeData = await api.getStoreBySlug(slug);
        setStore(storeData);
        
        // Carregar itens do carrinho do localStorage (apenas no cliente)
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem(`cart_${storeData.id}`);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
    } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Não foi possível carregar os dados necessários. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
    };
    
    fetchData();
  }, [slug]);

  // Funções auxiliares
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + shippingCost;
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        // Verificar estoque se o produto tiver controle de estoque
        if (item.trackStock && item.stock !== undefined && newQuantity > item.stock) {
          showSnackbar(`Apenas ${item.stock} unidades disponíveis em estoque.`, 'error');
          return { ...item, quantity: item.stock };
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCartItems(updatedItems);
    
    // Atualizar localStorage (apenas no cliente)
    if (typeof window !== 'undefined' && store) {
      localStorage.setItem(`cart_${store.id}`, JSON.stringify(updatedItems));
    }
  };

  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    
    // Atualizar localStorage (apenas no cliente)
    if (typeof window !== 'undefined' && store) {
      localStorage.setItem(`cart_${store.id}`, JSON.stringify(updatedItems));
    }
  };

  const clearCart = () => {
    setCartItems([]);
    
    // Limpar localStorage (apenas no cliente)
    if (typeof window !== 'undefined' && store) {
      localStorage.removeItem(`cart_${store.id}`);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Manipuladores de formulário
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleShippingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({ ...paymentInfo, method: e.target.value as PaymentMethod });
  };

  const handleShippingMethodChange = (e: SelectChangeEvent) => {
    const method = e.target.value;
    let cost = 15; // Padrão
    
    if (method === 'express') {
      cost = 25;
    } else if (method === 'pickup') {
      cost = 0;
    }
    
    setShippingMethod(method);
    setShippingCost(cost);
  };

  // Navegação entre etapas
  const handleNext = () => {
    // Validar etapa atual antes de avançar
    if (activeStep === 0) {
      if (cartItems.length === 0) {
        showSnackbar('Seu carrinho está vazio', 'error');
        return;
      }
    } else if (activeStep === 1) {
      // Validar campos de endereço
      const requiredFields: (keyof ShippingAddress)[] = ['fullName', 'address', 'city', 'state', 'zipCode', 'phone'];
      const missingFields = requiredFields.filter(field => !shippingAddress[field]);

      if (missingFields.length > 0) {
        showSnackbar('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
      }
    } else if (activeStep === 2) {
      // Validar método de pagamento (já tem um valor padrão, então não precisa validar)
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Finalizar pedido
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showSnackbar('Seu carrinho está vazio', 'error');
      return;
    }
    
    try {
      setProcessingOrder(true);
      
      if (!store) {
        throw new Error('Dados da loja não encontrados');
      }
      
      // Verificar estoque dos produtos antes de finalizar o pedido
      const stockCheckPromises = cartItems
        .filter(item => item.trackStock)
        .map(async (item) => {
          try {
            const product = await api.getProductById(item.productId);
            if (product.stock < item.quantity) {
              return {
                productId: item.productId,
                name: item.name,
                available: product.stock,
                requested: item.quantity
              };
            }
            return null;
          } catch (error) {
            console.error(`Erro ao verificar estoque do produto ${item.productId}:`, error);
            return null;
          }
        });
      
      const stockCheckResults = await Promise.all(stockCheckPromises);
      const outOfStockItems = stockCheckResults.filter(item => item !== null);
      
      if (outOfStockItems.length > 0) {
        const itemNames = outOfStockItems.map(item => 
          `${item.name} (disponível: ${item.available}, solicitado: ${item.requested})`
        ).join(', ');
        
        showSnackbar(`Alguns itens não têm estoque suficiente: ${itemNames}`, 'error');
        setProcessingOrder(false);
        return;
      }
      
      // Validar CPF/CNPJ para faturamento
      if (!validateDocument(customerInfo.document)) {
        showSnackbar('CPF/CNPJ inválido. Por favor, verifique e tente novamente.', 'error');
        setProcessingOrder(false);
        return;
      }
      
      // Preparar itens do pedido
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.salePrice || item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      }));
      
      // Preparar dados do pedido
      const orderData = {
        tenantId: store.id,
        subtotal: calculateSubtotal(),
        shipping: shippingCost,
        discount: 0,
        total: calculateTotal(),
        paymentMethod: paymentInfo.method,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone
        },
        // Usar o mesmo endereço para cobrança
        billingAddress: {
          fullName: shippingAddress.fullName,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          document: customerInfo.document,
          documentType: customerInfo.documentType
        },
        items: orderItems,
        notes: customerInfo.notes || ''
      };
      
      // Enviar pedido para a API
      const response = await api.createOrder(orderData);
      
      // Limpar carrinho após pedido bem-sucedido
        clearCart();
      
      // Mostrar mensagem de sucesso
      showSnackbar('Pedido realizado com sucesso!', 'success');
        
      // Redirecionar para página de confirmação com ID do pedido
      setTimeout(() => {
        router.push(`/stores/${slug}/pedido/${response.orderNumber}`);
      }, 2000);
      
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      showSnackbar('Ocorreu um erro ao processar seu pedido. Tente novamente.', 'error');
    } finally {
      setProcessingOrder(false);
    }
  };

  // Renderizar conteúdo com base na etapa atual
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
    return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Itens no Carrinho
            </Typography>
            
            {cartItems.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Seu carrinho está vazio. Adicione produtos antes de continuar.
              </Alert>
            ) : (
              <>
                {cartItems.map((item) => (
                  <Card key={item.id} sx={{ display: 'flex', mb: 2 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 100, height: 100, objectFit: 'cover' }}
                      image={item.imageUrl || 'https://via.placeholder.com/100'}
                      alt={item.name}
                    />
                    <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography component="div" variant="h6">
                          {item.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                          {formatPrice(item.salePrice || item.price)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.trackStock && item.stock !== undefined && item.quantity >= item.stock}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        
                        <Button 
                          variant="text" 
                          color="error" 
                          onClick={() => removeItem(item.id)}
                        >
                          Remover
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                
                <Divider sx={{ my: 3 }} />
        
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Resumo do Pedido
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography>Subtotal:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography>{formatPrice(calculateSubtotal())}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography>Frete:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography>{formatPrice(shippingCost)}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="h6">Total:</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="h6">{formatPrice(calculateTotal())}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Informações de Entrega
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                      required
                  fullWidth
                  label="Nome Completo"
                  name="fullName"
                  value={shippingAddress.fullName}
                      onChange={handleShippingAddressChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                      required
                  fullWidth
                  label="Endereço Completo"
                  name="address"
                  value={shippingAddress.address}
                      onChange={handleShippingAddressChange}
                  placeholder="Rua, Número, Complemento, Bairro"
                    />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                      required
                  fullWidth
                  label="Cidade"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleShippingAddressChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                      required
                  fullWidth
                  label="Estado"
                      name="state"
                      value={shippingAddress.state}
                      onChange={handleShippingAddressChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                      required
                  fullWidth
                  label="CEP"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleShippingAddressChange}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                      required
                  fullWidth
                  label="Telefone"
                  name="phone"
                  value={shippingAddress.phone}
                      onChange={handleShippingAddressChange}
                    />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle1" gutterBottom>
                    Método de Envio
                  </Typography>
                  <Select
                    value={shippingMethod}
                    onChange={handleShippingMethodChange}
                    >
                    <MenuItem value="standard">Padrão (R$ 15,00) - 5 a 10 dias úteis</MenuItem>
                    <MenuItem value="express">Expresso (R$ 25,00) - 2 a 4 dias úteis</MenuItem>
                    <MenuItem value="pickup">Retirada na loja (Grátis)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Método de Pagamento
            </Typography>
            
            <FormControl component="fieldset">
              <RadioGroup
                name="paymentMethod"
                value={paymentInfo.method}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel 
                  value={PaymentMethod.CREDIT_CARD} 
                  control={<Radio />} 
                  label="Cartão de Crédito" 
                />
                <FormControlLabel 
                  value={PaymentMethod.DEBIT_CARD} 
                  control={<Radio />} 
                  label="Cartão de Débito" 
                />
                <FormControlLabel 
                  value={PaymentMethod.BOLETO} 
                  control={<Radio />} 
                  label="Boleto Bancário" 
                />
                <FormControlLabel 
                  value={PaymentMethod.PIX} 
                  control={<Radio />} 
                  label="PIX" 
                />
                <FormControlLabel 
                  value={PaymentMethod.BANK_TRANSFER} 
                  control={<Radio />} 
                  label="Transferência Bancária" 
                />
              </RadioGroup>
            </FormControl>

            {/* Campos específicos para cada método de pagamento seriam adicionados aqui */}
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Resumo do Pedido
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography>Subtotal:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography>{formatPrice(calculateSubtotal())}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography>Frete:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography>{formatPrice(shippingCost)}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="h6">Total:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="h6">{formatPrice(calculateTotal())}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirmação do Pedido
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Endereço de Entrega
              </Typography>
              <Typography>
                {shippingAddress.fullName}
              </Typography>
              <Typography>
                {shippingAddress.address}
              </Typography>
              <Typography>
                {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.zipCode}
              </Typography>
              <Typography>
                {shippingAddress.country}
              </Typography>
              <Typography>
                Telefone: {shippingAddress.phone}
              </Typography>
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Método de Pagamento
              </Typography>
              <Typography>
                {paymentInfo.method === PaymentMethod.CREDIT_CARD && 'Cartão de Crédito'}
                {paymentInfo.method === PaymentMethod.DEBIT_CARD && 'Cartão de Débito'}
                {paymentInfo.method === PaymentMethod.BOLETO && 'Boleto Bancário'}
                {paymentInfo.method === PaymentMethod.PIX && 'PIX'}
                {paymentInfo.method === PaymentMethod.BANK_TRANSFER && 'Transferência Bancária'}
              </Typography>
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Itens do Pedido
              </Typography>
            
              {cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography>
                    {formatPrice((item.salePrice || item.price) * item.quantity)}
                  </Typography>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>{formatPrice(calculateSubtotal())}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Frete</Typography>
                <Typography>{formatPrice(shippingCost)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{formatPrice(calculateTotal())}</Typography>
              </Box>
            </Paper>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
                  onClick={handlePlaceOrder}
                  disabled={processingOrder}
              startIcon={processingOrder ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
            >
              {processingOrder ? 'Processando...' : 'Finalizar Compra'}
            </Button>
          </Box>
        );
      
      default:
        return 'Etapa desconhecida';
    }
  };

  // Exibir estado de carregamento
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Exibir mensagem de erro
  if (error || !store) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Loja não encontrada'}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/stores/${slug}`)}
        >
          Voltar para a loja
        </Button>
      </Container>
    );
  }

  // Exibir mensagem se o carrinho estiver vazio e o usuário estiver na primeira etapa
  if (cartItems.length === 0 && activeStep === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Seu carrinho está vazio
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Adicione produtos ao seu carrinho antes de finalizar a compra.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/stores/${slug}`)}
          >
            Voltar para a loja
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" align="center" gutterBottom>
          Finalizar Compra
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4, pt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mb: 4 }}>
          {getStepContent(activeStep)}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Voltar
          </Button>
          
          {activeStep === steps.length - 1 ? null : (
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
            >
              Próximo
            </Button>
          )}
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

// Componente para o formulário de informações do cliente
const CustomerInfoForm = ({ 
  customerInfo, 
  handleCustomerInfoChange 
}: { 
  customerInfo: CustomerInfo; 
  handleCustomerInfoChange: (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => void;
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Informações do Cliente
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          required
          id="name"
          name="name"
          label="Nome Completo"
          fullWidth
          variant="outlined"
          value={customerInfo.name}
          onChange={handleCustomerInfoChange}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="email"
          name="email"
          label="Email"
          fullWidth
          variant="outlined"
          type="email"
          value={customerInfo.email}
          onChange={handleCustomerInfoChange}
        />
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="phone"
          name="phone"
          label="Telefone"
          fullWidth
          variant="outlined"
          value={customerInfo.phone}
          onChange={handleCustomerInfoChange}
        />
      </Grid>
      
      <Grid item xs={12} sm={8}>
        <TextField
          required
          id="document"
          name="document"
          label={customerInfo.documentType === 'cpf' ? "CPF" : "CNPJ"}
          fullWidth
          variant="outlined"
          value={customerInfo.document}
          onChange={handleCustomerInfoChange}
          helperText="Necessário para emissão da nota fiscal"
        />
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <Select
            id="documentType"
            name="documentType"
            value={customerInfo.documentType}
            onChange={handleCustomerInfoChange as any}
          >
            <MenuItem value="cpf">CPF</MenuItem>
            <MenuItem value="cnpj">CNPJ</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          id="notes"
          name="notes"
          label="Observações para o pedido"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={customerInfo.notes || ''}
          onChange={handleCustomerInfoChange}
        />
      </Grid>
    </Grid>
  );
};
