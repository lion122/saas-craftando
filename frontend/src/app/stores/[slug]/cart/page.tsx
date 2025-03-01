'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button,
  Breadcrumbs,
  Link,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '@/config/api';

// Tipos
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

// Simulação de carrinho (será substituído por um contexto ou estado global posteriormente)
const mockCartItems: CartItem[] = [
  {
    id: '1',
    productId: 'prod-1',
    name: 'Camiseta Básica',
    price: 49.90,
    quantity: 2,
    imageUrl: 'https://via.placeholder.com/100x100',
    stock: 10,
    trackStock: true
  },
  {
    id: '2',
    productId: 'prod-2',
    name: 'Calça Jeans',
    price: 129.90,
    salePrice: 99.90,
    quantity: 1,
    imageUrl: 'https://via.placeholder.com/100x100',
    stock: 5,
    trackStock: true
  }
];

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params.slug as string;
  
  const [store, setStore] = useState<Store | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  // Buscar dados da loja e carregar carrinho
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar dados da loja
        const storeData = await api.getStoreBySlug(storeSlug);
        setStore(storeData);
        
        // Carregar itens do carrinho do localStorage (apenas no cliente)
        if (typeof window !== 'undefined') {
          const savedCart = localStorage.getItem(`cart_${storeData.id}`);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (err: any) {
        console.error('Erro ao buscar dados:', err);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [storeSlug]);
  
  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Função para remover item do carrinho
  const removeItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    
    // Atualizar localStorage (apenas no cliente)
    if (typeof window !== 'undefined' && store) {
      localStorage.setItem(`cart_${store.id}`, JSON.stringify(updatedItems));
    }
  };
  
  // Função para atualizar quantidade
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => {
      if (item.id === id) {
        // Verificar estoque se o produto tiver controle de estoque
        if (item.trackStock && item.stock !== undefined && newQuantity > item.stock) {
          alert(`Apenas ${item.stock} unidades disponíveis em estoque.`);
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
  
  // Função para aplicar cupom
  const applyCoupon = () => {
    if (!couponCode.trim()) return;
    
    // Simulação de aplicação de cupom
    // Posteriormente, isso será validado no backend
    if (couponCode.toUpperCase() === 'DESCONTO10') {
      setCouponApplied(true);
      setDiscount(calculateSubtotal() * 0.1); // 10% de desconto
    } else {
      setError('Cupom inválido ou expirado');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Função para calcular subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.salePrice || item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };
  
  // Função para calcular total
  const calculateTotal = () => {
    return calculateSubtotal() - discount;
  };
  
  // Função para ir para o checkout
  const goToCheckout = () => {
    router.push(`/stores/${storeSlug}/checkout`);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error && !store) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link color="inherit" href="/">
            Início
          </Link>
          <Link color="inherit" href={`/stores/${storeSlug}`}>
            {store?.name || 'Loja'}
          </Link>
          <Typography color="text.primary">Carrinho</Typography>
        </Breadcrumbs>
        
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Seu carrinho está vazio
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Adicione produtos para continuar suas compras
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />}
            href={`/stores/${storeSlug}`}
          >
            Continuar Comprando
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Início
        </Link>
        <Link color="inherit" href={`/stores/${storeSlug}`}>
          {store?.name || 'Loja'}
        </Link>
        <Typography color="text.primary">Carrinho</Typography>
      </Breadcrumbs>
      
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Meu Carrinho
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={4}>
        {/* Lista de produtos */}
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell align="center">Preço</TableCell>
                  <TableCell align="center">Quantidade</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => {
                  const itemPrice = item.salePrice || item.price;
                  const itemSubtotal = itemPrice * item.quantity;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.imageUrl && (
                            <Box
                              component="img"
                              src={item.imageUrl}
                              alt={item.name}
                              sx={{ width: 50, height: 50, mr: 2, objectFit: 'cover' }}
                            />
                          )}
                          <Box>
                            <Typography variant="body1">
                              {item.name}
                            </Typography>
                            {item.salePrice && (
                              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                {formatPrice(item.price)}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {formatPrice(itemPrice)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                updateQuantity(item.id, value);
                              }
                            }}
                            inputProps={{ 
                              min: 1, 
                              style: { textAlign: 'center', width: '40px' } 
                            }}
                            variant="standard"
                            sx={{ mx: 1 }}
                          />
                          <IconButton 
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.trackStock && item.stock !== undefined && item.quantity >= item.stock}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {formatPrice(itemSubtotal)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="error"
                          onClick={() => removeItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              startIcon={<ArrowBackIcon />}
              href={`/stores/${storeSlug}`}
            >
              Continuar Comprando
            </Button>
          </Box>
        </Grid>
        
        {/* Resumo do pedido */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo do Pedido
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">{formatPrice(calculateSubtotal())}</Typography>
                </Box>
                
                {discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Desconto</Typography>
                    <Typography variant="body1" color="error.main">
                      -{formatPrice(discount)}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary.main">
                    {formatPrice(calculateTotal())}
                  </Typography>
                </Box>
              </Box>
              
              {/* Cupom de desconto */}
              {!couponApplied ? (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Cupom de desconto
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Digite o código"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      sx={{ mr: 1 }}
                    />
                    <Button 
                      variant="outlined" 
                      onClick={applyCoupon}
                      disabled={!couponCode.trim()}
                    >
                      Aplicar
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">
                    Cupom aplicado: <strong>{couponCode.toUpperCase()}</strong>
                  </Typography>
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => {
                      setCouponApplied(false);
                      setCouponCode('');
                      setDiscount(0);
                    }}
                  >
                    Remover
                  </Button>
                </Box>
              )}
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={goToCheckout}
                sx={{ mt: 2 }}
              >
                Finalizar Compra
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 