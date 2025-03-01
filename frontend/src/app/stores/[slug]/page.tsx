'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Pagination,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '@/config/api';

// Tipos
interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  status: string;
  featured: boolean;
}

interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
}

export default function StorePage() {
  const params = useParams();
  const storeSlug = params.slug as string;
  
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
  
  // Buscar dados da loja
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const storeData = await api.getStoreBySlug(storeSlug);
        setStore(storeData);
        
        // Após obter os dados da loja, buscar os produtos
        fetchProducts(storeData.id);
      } catch (err: any) {
        console.error('Erro ao buscar loja:', err);
        setError('Não foi possível carregar os dados da loja. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchStore();
  }, [storeSlug]);
  
  // Função para buscar produtos
  const fetchProducts = async (tenantId: string) => {
    setLoading(true);
    
    try {
      // Construir query params
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '12');
      params.append('tenantId', tenantId);
      params.append('status', 'active'); // Apenas produtos ativos
      
      if (search) {
        params.append('search', search);
      }
      
      params.append('sortBy', sortBy);
      params.append('sortDirection', sortDirection);
      
      const response = await api.getProducts(tenantId);
      setProducts(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Atualizar produtos quando a página, busca ou ordenação mudar
  useEffect(() => {
    if (store) {
      fetchProducts(store.id);
    }
  }, [page, sortBy, sortDirection, store]);
  
  // Função para lidar com a busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Resetar para a primeira página
    if (store) {
      fetchProducts(store.id);
  }
  };
  
  // Função para formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Função para lidar com a mudança de ordenação
  const handleSortChange = (e: SelectChangeEvent) => {
    const value = e.target.value;
    
    // Valores esperados: price_asc, price_desc, name_asc, name_desc, newest, oldest
    switch (value) {
      case 'price_asc':
        setSortBy('price');
        setSortDirection('ASC');
        break;
      case 'price_desc':
        setSortBy('price');
        setSortDirection('DESC');
        break;
      case 'name_asc':
        setSortBy('name');
        setSortDirection('ASC');
        break;
      case 'name_desc':
        setSortBy('name');
        setSortDirection('DESC');
        break;
      case 'newest':
        setSortBy('createdAt');
        setSortDirection('DESC');
        break;
      case 'oldest':
        setSortBy('createdAt');
        setSortDirection('ASC');
        break;
    }
  };
  
  if (loading && !store) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  if (!store) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          Loja não encontrada ou erro ao carregar os dados.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Cabeçalho da Loja */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        {store.logo && (
          <Box 
            component="img" 
            src={store.logo} 
            alt={store.name}
            sx={{ 
              height: 100, 
              maxWidth: '100%', 
              objectFit: 'contain',
              mb: 2
            }}
          />
        )}
        <Typography variant="h3" component="h1" gutterBottom>
            {store.name}
        </Typography>
        {store.description && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            {store.description}
          </Typography>
        )}
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Barra de Busca e Filtros */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={`${sortBy === 'price' ? 'price_' : sortBy === 'name' ? 'name_' : sortBy === 'createdAt' ? (sortDirection === 'DESC' ? 'newest' : 'oldest') : ''}`}
            label="Ordenar por"
            onChange={handleSortChange}
          >
            <MenuItem value="newest">Mais recentes</MenuItem>
            <MenuItem value="oldest">Mais antigos</MenuItem>
            <MenuItem value="price_asc">Menor preço</MenuItem>
            <MenuItem value="price_desc">Maior preço</MenuItem>
            <MenuItem value="name_asc">Nome (A-Z)</MenuItem>
            <MenuItem value="name_desc">Nome (Z-A)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Lista de Produtos */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhum produto encontrado
          </Typography>
        </Box>
          ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative'
                }}
              >
                {product.featured && (
                  <Chip 
                    label="Destaque" 
                    color="primary" 
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10, 
                      zIndex: 1 
                    }}
                  />
                )}
                <CardActionArea 
                  sx={{ flexGrow: 1 }}
                  href={`/stores/${storeSlug}/products/${product.id}`}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images && product.images.length > 0 
                      ? product.images[0] 
                      : 'https://via.placeholder.com/300x200?text=Sem+Imagem'}
                          alt={product.name}
                    sx={{ objectFit: 'cover' }}
                        />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                      {product.name}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                          {product.salePrice ? (
                            <>
                          <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ textDecoration: 'line-through' }}
                          >
                            {formatPrice(product.price)}
                          </Typography>
                          <Typography variant="h6" color="error.main">
                            {formatPrice(product.salePrice)}
                          </Typography>
                            </>
                          ) : (
                        <Typography variant="h6" color="text.primary">
                          {formatPrice(product.price)}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Paginação */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={(_, value) => setPage(value)} 
            color="primary" 
            size="large"
          />
        </Box>
      )}
    </Container>
  );
} 