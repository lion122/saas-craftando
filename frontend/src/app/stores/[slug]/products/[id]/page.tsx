'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  Tabs,
  Tab,
  Chip,
  IconButton,
  Snackbar
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { api } from '@/config/api';

// Tipos
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock?: number;
  trackStock?: boolean;
  images: string[];
  status: string;
  sku?: string;
  weight?: number;
  dimensions?: string;
  featured: boolean;
}

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const storeSlug = params.slug as string;
  const productId = params.id as string;
  
  const [store, setStore] = useState<Store | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Buscar dados da loja e do produto
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados da loja
        const storeData = await api.getStoreBySlug(storeSlug);
        setStore(storeData);
        
        // Buscar dados do produto
        const productData = await api.getProductById(productId);
        setProduct(productData);
      } catch (err: any) {
        console.error('Erro ao buscar dados:', err);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [storeSlug, productId]);
  
  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Função para lidar com a mudança de quantidade
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (product?.trackStock && product?.stock && value > product.stock) {
      setQuantity(product.stock);
    } else {
      setQuantity(value);
    }
  };
  
  // Função para incrementar quantidade
  const incrementQuantity = () => {
    if (product?.trackStock && product?.stock && quantity >= product.stock) {
      return;
    }
    setQuantity(quantity + 1);
  };
  
  // Função para decrementar quantidade
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Função para mudar a aba
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Função para adicionar ao carrinho
  const addToCart = () => {
    if (!product || !store) return;
    
    // Criar item do carrinho
    const cartItem = {
      id: `${product.id}_${Date.now()}`, // ID único para o item do carrinho
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      quantity: quantity,
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : undefined,
      stock: product.stock,
      trackStock: product.trackStock
    };
    
    // Verificar se estamos no navegador
    if (typeof window !== 'undefined') {
      // Buscar carrinho atual do localStorage
      const savedCart = localStorage.getItem(`cart_${store.id}`);
      let currentCart = savedCart ? JSON.parse(savedCart) : [];
      
      // Adicionar novo item
      currentCart.push(cartItem);
      
      // Salvar no localStorage
      localStorage.setItem(`cart_${store.id}`, JSON.stringify(currentCart));
    }
    
    setSnackbarMessage('Produto adicionado ao carrinho!');
    setSnackbarOpen(true);
  };
  
  // Função para adicionar/remover dos favoritos
  const toggleFavorite = () => {
    setFavorite(!favorite);
    setSnackbarMessage(favorite ? 'Produto removido dos favoritos!' : 'Produto adicionado aos favoritos!');
    setSnackbarOpen(true);
  };
  
  // Função para fechar o snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (error || !product || !store) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          {error || 'Produto não encontrado ou erro ao carregar os dados.'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            component={Link} 
            href={`/stores/${storeSlug}`}
          >
            Voltar para a loja
          </Button>
        </Box>
      </Container>
    );
  }
  
  // Verificar se o produto está disponível
  const isOutOfStock = product.trackStock && product.stock === 0;
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Início
        </Link>
        <Link color="inherit" href={`/stores/${storeSlug}`}>
          {store.name}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Imagens do produto */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Box
              component="img"
              src={product.images && product.images.length > 0 
                ? product.images[selectedImage] 
                : 'https://via.placeholder.com/600x400?text=Sem+Imagem'}
              alt={product.name}
              sx={{ 
                width: '100%', 
                height: 400, 
                objectFit: 'contain',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
            />
          </Box>
          
          {/* Miniaturas */}
          {product.images && product.images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {product.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`${product.name} - Imagem ${index + 1}`}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: index === selectedImage ? '2px solid' : '1px solid',
                    borderColor: index === selectedImage ? 'primary.main' : 'divider'
                  }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </Box>
          )}
        </Grid>
        
        {/* Informações do produto */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <IconButton onClick={toggleFavorite} color={favorite ? 'error' : 'default'}>
              {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          
          {/* Preço */}
          <Box sx={{ my: 2 }}>
            {product.salePrice ? (
              <>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ textDecoration: 'line-through' }}
                >
                  {formatPrice(product.price)}
                </Typography>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {formatPrice(product.salePrice)}
                </Typography>
                <Chip 
                  label={`${Math.round((1 - product.salePrice / product.price) * 100)}% OFF`} 
                  color="error" 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </>
            ) : (
              <Typography variant="h4" color="text.primary" fontWeight="bold">
                {formatPrice(product.price)}
              </Typography>
            )}
          </Box>
          
          {/* Status do estoque */}
          {product.trackStock && (
            <Box sx={{ mb: 2 }}>
              {isOutOfStock ? (
                <Chip label="Produto indisponível" color="error" />
              ) : (
                <Chip 
                  label={`${product.stock} em estoque`} 
                  color="success" 
                  variant="outlined"
                />
              )}
            </Box>
          )}
          
          {/* SKU */}
          {product.sku && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              SKU: {product.sku}
            </Typography>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          {/* Quantidade e botão de compra */}
          <Box sx={{ my: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Quantidade:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <IconButton 
                onClick={decrementQuantity} 
                disabled={quantity <= 1 || isOutOfStock}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ 
                  min: 1, 
                  max: product.trackStock ? product.stock : undefined,
                  style: { textAlign: 'center' } 
                }}
                disabled={isOutOfStock}
                sx={{ width: 60, mx: 1 }}
              />
              <IconButton 
                onClick={incrementQuantity} 
                disabled={isOutOfStock || (product.trackStock && product.stock !== undefined && quantity >= product.stock)}
              >
                <AddIcon />
              </IconButton>
            </Box>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCartIcon />}
              fullWidth
              onClick={addToCart}
              disabled={isOutOfStock}
              sx={{ mb: 2 }}
            >
              Adicionar ao Carrinho
            </Button>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Informações adicionais */}
          {(product.weight || product.dimensions) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Informações de Envio:
              </Typography>
              {product.weight && (
                <Typography variant="body2">
                  Peso: {product.weight}g
                </Typography>
              )}
              {product.dimensions && (
                <Typography variant="body2">
                  Dimensões: {product.dimensions}
                </Typography>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
      
      {/* Abas de informações */}
      <Paper sx={{ mt: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
        >
          <Tab label="Descrição" id="product-tab-0" />
          <Tab label="Especificações" id="product-tab-1" />
          <Tab label="Avaliações" id="product-tab-2" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          {product.description ? (
            <Typography variant="body1">
              {product.description}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">
              Nenhuma descrição disponível para este produto.
            </Typography>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body2" color="text.secondary" align="center">
            Informações técnicas do produto serão exibidas aqui.
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body2" color="text.secondary" align="center">
            Este produto ainda não possui avaliações.
          </Typography>
        </TabPanel>
      </Paper>
      
      {/* Produtos relacionados serão implementados posteriormente */}
      
      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
} 