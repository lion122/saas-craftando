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
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '@/config/api';

// Tipos
interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  status: 'active' | 'draft' | 'out_of_stock' | 'deleted';
  createdAt: string;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  
  // Função para buscar produtos
  const fetchProducts = async () => {
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
      
      const response = await api.get<ProductsResponse>(`/products?${params.toString()}`);
      setProducts(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  // Carregar produtos quando a página, busca ou status mudar
  useEffect(() => {
    fetchProducts();
  }, [page, status]);
  
  // Função para lidar com a busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Resetar para a primeira página
    fetchProducts();
  };
  
  // Função para excluir produto
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    
    try {
      await api.delete(`/products/${id}`);
      // Atualizar a lista após excluir
      fetchProducts();
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      setError('Não foi possível excluir o produto. Tente novamente mais tarde.');
    }
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
    let color: 'success' | 'warning' | 'error' | 'default' = 'default';
    let label = status;
    
    switch (status) {
      case 'active':
        color = 'success';
        label = 'Ativo';
        break;
      case 'draft':
        color = 'default';
        label = 'Rascunho';
        break;
      case 'out_of_stock':
        color = 'warning';
        label = 'Sem estoque';
        break;
      case 'deleted':
        color = 'error';
        label = 'Excluído';
        break;
    }
    
    return <Chip label={label} color={color} size="small" />;
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Produtos
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/products/new')}
        >
          Novo Produto
        </Button>
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
              label="Buscar produtos"
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
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="draft">Rascunho</MenuItem>
                <MenuItem value="out_of_stock">Sem estoque</MenuItem>
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
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Carregando...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Nenhum produto encontrado</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.salePrice ? (
                      <>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                          {formatPrice(product.price)}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'error.main' }}>
                          {formatPrice(product.salePrice)}
                        </Typography>
                      </>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{renderStatusChip(product.status)}</TableCell>
                  <TableCell>
                    {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="primary"
                      onClick={() => router.push(`/admin/products/${product.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error"
                      onClick={() => handleDelete(product.id)}
                    >
                      <DeleteIcon />
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