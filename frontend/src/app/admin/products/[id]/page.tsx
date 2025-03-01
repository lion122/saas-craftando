'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  TextField, 
  Grid, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { api } from '@/config/api';

// Tipos
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  stock: string;
  trackStock: boolean;
  sku: string;
  weight: string;
  dimensions: string;
  status: string;
  featured: boolean;
  images: string[];
  tenantId: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    stock: '0',
    trackStock: true,
    sku: '',
    weight: '0',
    dimensions: '',
    status: 'draft',
    featured: false,
    images: [''],
    tenantId: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Buscar dados do produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await api.getProductById(productId);
        
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price.toString(),
          salePrice: product.salePrice ? product.salePrice.toString() : '',
          stock: product.stock.toString(),
          trackStock: product.trackStock,
          sku: product.sku || '',
          weight: product.weight.toString(),
          dimensions: product.dimensions || '',
          status: product.status,
          featured: product.featured,
          images: product.images && product.images.length > 0 ? product.images : [''],
          tenantId: product.tenantId,
        });
      } catch (err: any) {
        console.error('Erro ao buscar produto:', err);
        setError('Não foi possível carregar os dados do produto. Tente novamente mais tarde.');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);
  
  // Função para lidar com mudanças nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando ele for alterado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Função para lidar com mudanças nos selects
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Função para lidar com mudanças nos switches
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Função para adicionar campo de imagem
  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };
  
  // Função para remover campo de imagem
  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Função para atualizar URL da imagem
  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };
  
  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'Preço deve ser um número válido maior ou igual a zero';
    }
    
    if (formData.salePrice && (isNaN(Number(formData.salePrice)) || Number(formData.salePrice) < 0)) {
      newErrors.salePrice = 'Preço promocional deve ser um número válido maior ou igual a zero';
    }
    
    if (formData.trackStock && (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)) {
      newErrors.stock = 'Estoque deve ser um número válido maior ou igual a zero';
    }
    
    if (isNaN(Number(formData.weight)) || Number(formData.weight) < 0) {
      newErrors.weight = 'Peso deve ser um número válido maior ou igual a zero';
    }
    
    // Validar URLs das imagens
    formData.images.forEach((url, index) => {
      if (url && !url.match(/^(http|https):\/\/[^ "]+$/)) {
        newErrors[`images[${index}]`] = 'URL da imagem inválida';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Função para enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Preparar dados para envio
      const productData = {
        ...formData,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        stock: Number(formData.stock),
        weight: Number(formData.weight),
        // Remover URLs de imagem vazias
        images: formData.images.filter(url => url.trim() !== ''),
      };
      
      await api.updateProduct(productId, productData);
      
      setSuccess('Produto atualizado com sucesso!');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
      
    } catch (err: any) {
      console.error('Erro ao atualizar produto:', err);
      setError(err.response?.data?.message || 'Não foi possível atualizar o produto. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/products')}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Editar Produto
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
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informações básicas */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações Básicas
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nome do Produto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                label="SKU (Código)"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            
            {/* Preços */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Preços
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Preço"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Preço Promocional"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                fullWidth
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                error={!!errors.salePrice}
                helperText={errors.salePrice}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            
            {/* Estoque */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Estoque
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.trackStock}
                    onChange={handleSwitchChange}
                    name="trackStock"
                    color="primary"
                  />
                }
                label="Controlar estoque"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantidade em Estoque"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                disabled={!formData.trackStock}
                error={!!errors.stock}
                helperText={errors.stock}
              />
            </Grid>
            
            {/* Dimensões e Peso */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Dimensões e Peso
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Peso (em gramas)"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                error={!!errors.weight}
                helperText={errors.weight}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dimensões (L x A x C)"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                fullWidth
                placeholder="Ex: 10x5x20"
              />
            </Grid>
            
            {/* Imagens */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Imagens
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            {formData.images.map((url, index) => (
              <Grid item xs={12} key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label={`URL da Imagem ${index + 1}`}
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  fullWidth
                  error={!!errors[`images[${index}]`]}
                  helperText={errors[`images[${index}]`]}
                />
                {index > 0 && (
                  <Button 
                    color="error" 
                    onClick={() => removeImageField(index)}
                    sx={{ ml: 1 }}
                  >
                    Remover
                  </Button>
                )}
              </Grid>
            ))}
            
            <Grid item xs={12}>
              <Button onClick={addImageField}>
                Adicionar Imagem
              </Button>
            </Grid>
            
            {/* Status e Destaque */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Status e Visibilidade
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="draft">Rascunho</MenuItem>
                  <MenuItem value="active">Ativo</MenuItem>
                  <MenuItem value="out_of_stock">Sem Estoque</MenuItem>
                </Select>
                <FormHelperText>
                  Produtos com status "Rascunho" não são exibidos na loja
                </FormHelperText>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={handleSwitchChange}
                    name="featured"
                    color="primary"
                  />
                }
                label="Produto em Destaque"
              />
              <FormHelperText>
                Produtos em destaque aparecem na página inicial da loja
              </FormHelperText>
            </Grid>
            
            {/* Botões */}
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                onClick={() => router.push('/admin/products')}
                sx={{ mr: 2 }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
} 